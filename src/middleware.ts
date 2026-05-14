import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const AUTH_RATE_LIMITED = [
  "/api/auth/register",
  "/api/auth/callback/credentials",
];

let _authLimiter: Ratelimit | undefined;

function getAuthLimiter(): Ratelimit | undefined {
  if (
    !process.env.UPSTASH_REDIS_REST_URL ||
    !process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    return undefined;
  }
  if (!_authLimiter) {
    _authLimiter = new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      }),
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "shopforge:auth",
    });
  }
  return _authLimiter;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  // --- Rate limiting on sensitive auth endpoints ---
  if (AUTH_RATE_LIMITED.some((p) => pathname.startsWith(p))) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "127.0.0.1";

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
  if (pathname === "/login" || pathname === "/register") {
    const token = await getToken({ req, secret });
    if (token) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
