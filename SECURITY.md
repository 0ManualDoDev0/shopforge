# Security Policy

## Reporting a Vulnerability

To report a security vulnerability, please e-mail **security@shopforge.com.br** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or proof-of-concept
- Affected component(s) and version(s)

We aim to acknowledge reports within **48 hours** and provide a fix timeline within **7 days** for critical issues.

**Please do not open public GitHub issues for security vulnerabilities.**

---

## Security Score: A

> Audit performed on 2026-05-14. Zero TypeScript errors. No raw SQL. No exposed secrets. All mutable API endpoints protected.

---

## Final Audit — 2026-05-14

### Route Protection Matrix

| Route | Methods | Protection | Status |
|-------|---------|-----------|--------|
| `/api/auth/register` | POST | Public (registration) | ✅ |
| `/api/coupons/validate` | POST | `auth()` session | ✅ |
| `/api/mercadopago/create-pix` | POST | `auth()` + Zod validation | ✅ |
| `/api/orders` | GET, POST | `auth()` + rate limit 20/min | ✅ |
| `/api/orders/[id]` | PATCH | `auth()` + ADMIN role | ✅ |
| `/api/products` | GET | Public | ✅ |
| `/api/products` | POST | `getToken` + ADMIN role | ✅ |
| `/api/products/[id]` | GET | Public | ✅ |
| `/api/products/[id]` | PATCH, DELETE | `getToken` + ADMIN role | ✅ |
| `/api/reviews` | POST | `auth()` + rate limit 20/min | ✅ |
| `/api/stripe/create-session` | POST | `auth()` + Zod validation | ✅ |
| `/api/stripe/webhook` | POST | Stripe signature + idempotency | ✅ |
| `/api/wishlist` | GET, POST | `auth()` + rate limit 30/min | ✅ |

### Rate Limiting Summary

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/register` | 5 req | 60 s |
| `/api/auth/callback/credentials` | 5 req | 60 s |
| `/api/mercadopago/*` | 10 req | 60 s |
| `/api/stripe/*` | 10 req | 60 s |
| `/api/orders` | 20 req | 60 s |
| `/api/reviews` | 20 req | 60 s |
| `/api/wishlist` | 30 req | 60 s |

All limiters use Upstash Redis sliding window and fail open (Redis outage does not block users).

### pnpm audit — remaining vulnerabilities

| Severity | Package | Reason not fixed | Workaround |
|----------|---------|-----------------|-----------|
| HIGH | `effect` (via `@uploadthing`) | Waiting for UploadThing upstream fix | No user-controlled input reaches Effect fibers |
| MODERATE | `postcss` (via `@sentry/nextjs`) | Waiting for Sentry upstream fix | PostCSS only runs at build time, not at runtime |

`next-auth` MODERATE advisory: **fixed** (beta.28 → beta.31).

### OWASP Top 10 — 2021

| # | Category | Score | Control applied |
|---|----------|-------|----------------|
| A01 | Broken Access Control | ✅ | Role-based ADMIN guard on all write routes; `userId` scoping on order/wishlist reads |
| A02 | Cryptographic Failures | ✅ | HSTS; bcrypt(12) for passwords; no secrets in client bundles; `AUTH_SECRET` in env |
| A03 | Injection | ✅ | Prisma ORM (parameterised queries); Zod input validation on all mutable routes; no raw SQL |
| A04 | Insecure Design | ✅ | Rate limiting on 7 endpoint groups; prices always fetched from DB (never trust client) |
| A05 | Security Misconfiguration | ✅ | Full CSP header suite; `X-Frame-Options SAMEORIGIN`; `X-Content-Type-Options nosniff`; `Referrer-Policy` |
| A06 | Vulnerable Components | ⚠️ | next-auth updated; 2 transitive vulns remain (build-time / third-party) |
| A07 | Authentication Failures | ✅ | Sliding-window rate limiting on login/register; bcrypt; NextAuth session management |
| A08 | Software & Data Integrity | ✅ | Stripe webhook signature verified; idempotency keys on Mercado Pago; idempotency check before order creation |
| A09 | Logging & Monitoring | ✅ | No PII logged; Sentry DSN for runtime error monitoring; no `console.log` in production paths |
| A10 | SSRF | ✅ | ViaCEP proxied server-side; no user-controlled URLs in server fetches; `callbackUrl` restricted to relative paths |

### Fixes applied in this audit (2026-05-14)

| File | Issue | Fix |
|------|-------|-----|
| `src/app/api/stripe/webhook/route.ts` | `JSON.parse` without try/catch — uncaught exception returns 500, causing Stripe to retry indefinitely | Wrapped in try/catch; breaks cleanly on malformed metadata |
| `src/app/api/stripe/create-session/route.ts` | Type assertion (`as`) instead of runtime validation | Added Zod schema; `quantity` must be a positive integer |
| `src/app/api/mercadopago/create-pix/route.ts` | Type assertion (`as`) instead of runtime validation | Added Zod schema; `quantity` must be a positive integer |
| `src/middleware.ts` | `/api/orders` had no rate limiting | Added 20 req/60 s sliding window |
| `src/components/store/ContactForm.tsx` | `console.log` leaking form submission data | Removed |
| `next.config.ts` | CSP missing Google avatar, ViaCEP, Mercado Pago, worker-src | Updated |
| `src/middleware.ts` | `callbackUrl` accepted external URLs | Restricted to paths starting with `/` |
| `src/middleware.ts` | `/forgot-password` not in auth-page redirect list | Added |

### What can be improved in the future

| Priority | Item |
|----------|------|
| Medium | Add `Content-Security-Policy-Report-Only` + report endpoint to monitor CSP violations in production |
| Medium | Replace `unsafe-inline` + `unsafe-eval` in `script-src` with nonce-based CSP (requires Next.js nonce middleware) |
| Medium | Add stock decrement on order creation to prevent overselling under concurrent load |
| Low | Remove `role` field from `/api/auth/register` response (minor info disclosure) |
| Low | Replace `getToken` (JWT) with `auth()` in product routes for consistency |
| Low | Add `Permissions-Policy` entries for `payment` and `usb` APIs |
| Low | Consider signed `couponCode` to prevent brute-force coupon enumeration |
| Future | Add automated dependency update PRs (Renovate or Dependabot) to catch transitive vulns earlier |

---

## Dependency Versions (2026-05-14)

| Package | Version |
|---------|---------|
| next | 15.x |
| next-auth | 5.0.0-beta.31 |
| prisma | latest |
| @upstash/ratelimit | latest |
| stripe | latest |
| mercadopago | latest |
| zod | latest |
| bcryptjs | latest |

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest (`main` branch) | Yes |
| older tags | No — upgrade to latest |
