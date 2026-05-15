# Security Policy

## Reporting a Vulnerability

To report a security vulnerability, please e-mail **security@shopforge.com.br** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Affected component(s) and version(s)

We aim to acknowledge reports within **48 hours** and provide a fix timeline within **7 days** for critical issues.

**Please do not open public GitHub issues for security vulnerabilities.**

---

## Security Score: **A**

> Full audit completed on **2026-05-14**.  
> Zero TypeScript errors. No raw SQL. No exposed secrets in client bundles.  
> All mutable API endpoints protected with authentication + input validation.  
> Automated dependency monitoring active via Dependabot.

---

## Audit Summary — 2026-05-14

Three rounds of security review were performed on this date, covering dependency vulnerabilities, API route protection, input validation, rate limiting, CSP headers, authentication flows, and data integrity.

---

## Complete Vulnerability Log

All issues found and fixed across the three audit rounds, ordered by severity.

### Round 1 — Dependency & Configuration Audit

| Severity | Location | Vulnerability | Fix applied |
|----------|----------|--------------|-------------|
| MODERATE | `package.json` | `next-auth` 5.0.0-beta.28 had a known advisory (session token exposure under specific conditions) | Updated to 5.0.0-beta.31 |
| MODERATE | `next.config.ts` | CSP `img-src` missing `lh3.googleusercontent.com` — Google OAuth avatars blocked or fallback not enforced by policy | Added domain to `img-src` |
| MODERATE | `next.config.ts` | CSP `connect-src` missing `https://viacep.com.br` and `https://api.mercadopago.com` | Added both domains |
| MODERATE | `next.config.ts` | CSP `script-src` and `frame-src` missing Mercado Pago checkout domains | Added `mp-checkout-sandbox.mercadopago.com` and `mp-checkout.mercadopago.com` |
| MODERATE | `next.config.ts` | `worker-src` directive absent — Web Workers and blob: URLs could be blocked | Added `worker-src 'self' blob:` |
| LOW | `src/components/store/ContactForm.tsx:40` | `console.log("Contact form submission:", data)` leaked full form payload (name, email, message) to server logs | Removed |
| LOW | `src/middleware.ts` | No rate limiting on `/api/mercadopago/*` and `/api/stripe/*` — payment endpoints exposed to abuse | Added 10 req/60 s sliding window via Upstash Redis |
| LOW | `src/middleware.ts` | No rate limiting on `/api/reviews` and `/api/wishlist` | Added 20 req/60 s and 30 req/60 s respectively |
| LOW | `src/middleware.ts` | `callbackUrl` parameter accepted external URLs — open redirect risk on login | Restricted to relative paths (`/…`) only |
| LOW | `src/middleware.ts` | `/forgot-password` missing from auth-page redirect list — logged-in users could reach it | Added to list |

### Round 2 — Route Handler & Code Audit

| Severity | Location | Vulnerability | Fix applied |
|----------|----------|--------------|-------------|
| HIGH | `src/app/api/stripe/webhook/route.ts` | `JSON.parse(itemsJson)` called without try/catch inside webhook handler — malformed Stripe metadata caused uncaught exception → HTTP 500 → Stripe retried the webhook indefinitely, risking duplicate order creation | Wrapped in try/catch; `break` on parse failure |
| MODERATE | `src/app/api/stripe/create-session/route.ts` | Request body accepted via TypeScript type assertion (`as`) with no runtime validation — `quantity: 0` or negative values passed silently to Stripe line items | Replaced with Zod schema: `quantity: z.number().int().positive()` |
| MODERATE | `src/app/api/mercadopago/create-pix/route.ts` | Same type assertion pattern — unvalidated `quantity` sent to Mercado Pago | Replaced with Zod schema |
| LOW | `src/middleware.ts` | `/api/orders` POST had no rate limiting — authenticated users could create unlimited PENDING orders | Added 20 req/60 s sliding window |

### Round 3 — Hardening & Consistency Audit

| Severity | Location | Vulnerability | Fix applied |
|----------|----------|--------------|-------------|
| MODERATE | `src/app/api/orders/route.ts` | Stock check was a pre-flight read followed by a separate write — race condition allowed two concurrent requests to both pass the check and oversell the same item | Replaced with `db.$transaction` using `updateMany({ where: { stock: { gte: qty } } })` — atomic check-and-decrement at DB level |
| LOW | `src/app/api/auth/register/route.ts` | Prisma `select` in `user.create` included `role` field — newly registered users could read their own role from the API response (minor info disclosure) | Removed `role` from `select`; response now returns only `{ id, name, email, createdAt }` |
| LOW | `src/app/api/products/route.ts` | Used `getToken` from `next-auth/jwt` requiring manual `AUTH_SECRET` env resolution — inconsistent with all other routes and a potential source of misconfiguration | Replaced with `auth()` from `@/lib/auth` |
| LOW | `src/app/api/products/[id]/route.ts` | Same `getToken` inconsistency | Replaced with `auth()` |
| MAINTENANCE | `.github/dependabot.yml` | No automated dependency tracking — transitive vulnerability updates required manual intervention | Created Dependabot config with weekly npm updates, grouped by ecosystem |

### Remaining vulnerabilities (not actionable)

| Severity | Package | Path | Reason | Mitigation |
|----------|---------|------|--------|-----------|
| HIGH | `effect` < 3.20.0 | `@uploadthing/react` → `effect` | Waiting for UploadThing to release a version pinning `effect` ≥ 3.20.0 | No user-controlled input reaches Effect fibers in this project |
| MODERATE | `postcss` < 8.5.10 | `@sentry/nextjs` → `next` → `postcss` | Waiting for Sentry to update its Next.js peer dep | PostCSS runs only at build time, not at runtime; no user input is processed by PostCSS |

---

## Route Protection Matrix (current state)

| Route | Methods | Auth | Role | Input | Rate limit |
|-------|---------|------|------|-------|-----------|
| `/api/auth/register` | POST | Public | — | Zod | 5/min |
| `/api/auth/callback/credentials` | POST | NextAuth | — | NextAuth | 5/min |
| `/api/coupons/validate` | POST | `auth()` | Any | Zod | — |
| `/api/mercadopago/create-pix` | POST | `auth()` | Any | Zod | 10/min |
| `/api/orders` | GET | `auth()` | Scoped by userId / ADMIN sees all | — | 20/min |
| `/api/orders` | POST | `auth()` | Any | Zod schema | 20/min |
| `/api/orders/[id]` | PATCH | `auth()` | ADMIN only | Zod enum | — |
| `/api/products` | GET | Public | — | Query params | — |
| `/api/products` | POST | `auth()` | ADMIN only | Zod | — |
| `/api/products/[id]` | GET | Public | — | — | — |
| `/api/products/[id]` | PATCH | `auth()` | ADMIN only | Zod partial | — |
| `/api/products/[id]` | DELETE | `auth()` | ADMIN only | — | — |
| `/api/reviews` | POST | `auth()` | Any | Zod | 20/min |
| `/api/stripe/create-session` | POST | `auth()` | Any | Zod | 10/min |
| `/api/stripe/webhook` | POST | Stripe signature | — | Stripe SDK | — |
| `/api/wishlist` | GET, POST | `auth()` | Any | Zod | 30/min |

---

## Rate Limiting Summary

All limiters use **Upstash Redis sliding window** and **fail open** (Redis outage does not block legitimate users).

| Endpoint group | Limit | Window | Rationale |
|----------------|-------|--------|-----------|
| `/api/auth/register` | 5 req | 60 s | Prevent account enumeration and spam registrations |
| `/api/auth/callback/credentials` | 5 req | 60 s | Brute-force protection on password login |
| `/api/mercadopago/*` | 10 req | 60 s | Payment API abuse / cost protection |
| `/api/stripe/*` | 10 req | 60 s | Payment API abuse / cost protection |
| `/api/orders` | 20 req | 60 s | Prevent phantom order creation and stock exhaustion |
| `/api/reviews` | 20 req | 60 s | Prevent review spam |
| `/api/wishlist` | 30 req | 60 s | Prevent wishlist enumeration |

---

## OWASP Top 10 — 2021

| # | Category | Status | Control applied |
|---|----------|--------|----------------|
| A01 | Broken Access Control | ✅ | ADMIN role guard on all write routes; `userId` scoping on order/wishlist GETs; `callbackUrl` restricted to relative paths; middleware dashboard guard |
| A02 | Cryptographic Failures | ✅ | HSTS (`max-age=63072000; includeSubDomains; preload`); `bcrypt(12)` for passwords; secrets only in env vars; no sensitive data in client bundles |
| A03 | Injection | ✅ | Prisma ORM with parameterised queries throughout; Zod input validation on every mutable route; zero `$queryRaw` / `$executeRaw` calls in codebase |
| A04 | Insecure Design | ✅ | Prices always fetched from DB (never trust client amounts); atomic stock decrement prevents oversell; idempotency keys on Mercado Pago; Stripe webhook idempotency check |
| A05 | Security Misconfiguration | ✅ | Full CSP covering all external domains; `X-Frame-Options: SAMEORIGIN`; `X-Content-Type-Options: nosniff`; `Referrer-Policy: origin-when-cross-origin`; `Permissions-Policy` restricting camera/mic/geolocation |
| A06 | Vulnerable Components | ⚠️ | `next-auth` updated beta.28 → beta.31; Dependabot active for future updates; 2 transitive vulns remain pending upstream fixes (UploadThing, Sentry) |
| A07 | Authentication Failures | ✅ | Sliding-window rate limiting on login and register; `bcrypt(12)`; NextAuth v5 session management; no plaintext credentials anywhere |
| A08 | Software & Data Integrity | ✅ | Stripe webhook signature verified via `stripe.webhooks.constructEvent`; idempotency keys on every Mercado Pago request; existing-order check before creating from webhook |
| A09 | Logging & Monitoring | ✅ | No PII in server logs; no `console.log` in any production code path; Sentry DSN configured for runtime error monitoring |
| A10 | SSRF | ✅ | ViaCEP proxied server-side; no user-controlled URLs used in server-side fetches; `callbackUrl` validated to relative paths only |

---

## Dependency Monitoring

Dependabot is configured at `.github/dependabot.yml` with:

- **Schedule:** every Monday at 09:00 BRT
- **Open PRs limit:** 10
- **Groups:** `eslint`, `tailwind`, `radix`, `prisma` (related deps updated together)
- **Ignore:** `next-auth v4.x` (project intentionally uses v5 beta)

### Current pinned versions (2026-05-14)

| Package | Version | Notes |
|---------|---------|-------|
| `next` | 15.x | App Router |
| `next-auth` | 5.0.0-beta.31 | v5 beta required for App Router |
| `prisma` | latest | ORM |
| `@upstash/ratelimit` | latest | Rate limiting |
| `@upstash/redis` | latest | Redis client |
| `stripe` | latest | Stripe SDK |
| `mercadopago` | latest | Mercado Pago SDK |
| `zod` | latest | Input validation |
| `bcryptjs` | latest | Password hashing |

---

## Recommendations for Future Improvement

| Priority | Item | Effort |
|----------|------|--------|
| Medium | Replace `unsafe-inline` + `unsafe-eval` in `script-src` with a **nonce-based CSP** — requires Next.js nonce middleware generating a fresh nonce per request | High |
| Medium | Add a `Content-Security-Policy-Report-Only` header pointing to a `/api/csp-report` endpoint to monitor real-world CSP violations in production before enforcing stricter rules | Low |
| Medium | Add **signed coupon codes** or HMAC validation to prevent brute-force enumeration of active discount codes | Medium |
| Low | Add `Permissions-Policy: payment=()` and `usb=()` directives to restrict browser API surface | Trivial |
| Low | Implement **refresh token rotation** when next-auth v5 stable ships | Medium |
| Low | Add `X-Request-ID` header to all API responses to correlate Sentry errors with specific requests | Low |
| Future | Set up **automated security scanning** in CI (e.g., `pnpm audit --audit-level=high` as a required check in GitHub Actions) | Low |
| Future | Evaluate **Arcjet** or **Vercel WAF** for edge-level bot protection and anomaly detection on payment routes | Medium |

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` branch (latest) | Yes — security fixes applied immediately |
| Tagged releases (e.g., `v1.0.0`) | No — upgrade to `main` |
