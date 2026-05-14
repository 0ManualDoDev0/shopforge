import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const AUTH_RATE_LIMITED = [
  "/api/auth/register",
  "/api/auth/callback/credentials",
];

interface RateLimitRule {
  prefix: string;
  path: string;
  limit: number;
}

const PAYMENT_RATE_RULES: RateLimitRule[] = [
  { prefix: "shopforge:mp",       path: "/api/mercadopago/", limit: 10 },
  { prefix: "shopforge:stripe",   path: "/api/stripe/",      limit: 10 },
  { prefix: "shopforge:reviews",  path: "/api/reviews",      limit: 20 },
  { prefix: "shopforge:wishlist", path: "/api/wishlist",     limit: 30 },
];

let _authLimiter: Ratelimit | undefined;
const _paymentLimiters = new Map<string, Ratelimit>();

function buildRedis() {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) return undefined;
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function getAuthLimiter(): Ratelimit | undefined {
  if (!_authLimiter) {
    const redis = buildRedis();
    if (!redis) return undefined;
    _authLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "shopforge:auth",
    });
  }
  return _authLimiter;
}

function getPaymentLimiter(rule: RateLimitRule): Ratelimit | undefined {
  if (!_paymentLimiters.has(rule.prefix)) {
    const redis = buildRedis();
    if (!redis) return undefined;
    _paymentLimiters.set(
      rule.prefix,
      new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(rule.limit, "60 s"),
        prefix: rule.prefix,
      })
    );
  }
  return _paymentLimiters.get(rule.prefix);
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  // --- Rate limiting: auth endpoints ---
  if (AUTH_RATE_LIMITED.some((p) => pathname.startsWith(p))) {
    const ip = getIp(req);
    try {
      const limiter = getAuthLimiter();
      if (limiter) {
        const { success } = await limiter.limit(`auth:${ip}`);
        if (!success) {
          return NextResponse.json(
            { error: "Muitas tentativas. Aguarde 1 minuto." },
            { status: 429 }
          );
        }
      }
    } catch {
      // Redis indisponível — fail open
    }
  }

  // --- Rate limiting: payment & interaction endpoints ---
  const paymentRule = PAYMENT_RATE_RULES.find((r) =>
    pathname.startsWith(r.path)
  );
  if (paymentRule) {
    const ip = getIp(req);
    try {
      const limiter = getPaymentLimiter(paymentRule);
      if (limiter) {
        const { success } = await limiter.limit(`${paymentRule.prefix}:${ip}`);
        if (!success) {
          return NextResponse.json(
            { error: "Muitas tentativas. Aguarde 1 minuto." },
            { status: 429 }
          );
        }
      }
    } catch {
      // Redis indisponível — fail open
    }
  }

  // --- Dashboard: exige autenticação e role ADMIN ---
  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({ req, secret });
    if (!token) {
      const loginUrl = new URL("/login", req.nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if ((token as { role?: string }).role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next();
  }

  // --- Páginas de autenticação: redireciona quem já está logado ---
  const AUTH_PAGES = ["/login", "/register", "/forgot-password"];
  if (AUTH_PAGES.includes(pathname)) {
    const rawCallback = req.nextUrl.searchParams.get("callbackUrl") ?? "";
    // Só aceita redirects relativos para evitar open redirect
    const safeCallback =
      rawCallback.startsWith("/") && !rawCallback.startsWith("//")
        ? rawCallback
        : "/";

    const token = await getToken({ req, secret });
    if (token) {
      return NextResponse.redirect(new URL(safeCallback, req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
