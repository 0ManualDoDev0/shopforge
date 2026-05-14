# Security Policy

## Reporting a Vulnerability

To report a security vulnerability, please e-mail **security@shopforge.com.br** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or proof-of-concept
- Affected component(s) and version(s)

We aim to acknowledge reports within **48 hours** and provide a fix timeline within **7 days** for critical issues.

**Please do not open public GitHub issues for security vulnerabilities.**

---

## Audit — 2026-05-14

### pnpm audit findings

| Severity | Package | Installed | Fixed in | Status |
|----------|---------|-----------|----------|--------|
| HIGH | `effect` (transitive via `@uploadthing`) | < 3.20.0 | 3.20.0 | Waiting for UploadThing to update |
| MODERATE | `next-auth` | 5.0.0-beta.28 | beta.30 | **Fixed** — updated to beta.31 |
| MODERATE | `postcss` (transitive via `@sentry/nextjs`) | < 8.5.10 | 8.5.10 | Waiting for Sentry to update |

### OWASP Top 10 Controls

| # | Category | Control applied |
|---|----------|----------------|
| A01 | Broken Access Control | Role-based middleware (ADMIN guard on /dashboard); auth guard on all payment/user APIs |
| A02 | Cryptographic Failures | HTTPS-only (HSTS header); no secrets in client bundles; AUTH_SECRET / NEXTAUTH_SECRET env vars |
| A03 | Injection | Prisma ORM (parameterised queries); Zod input validation on all API routes |
| A04 | Insecure Design | Rate limiting on auth, payment, and interaction endpoints via Upstash Redis |
| A05 | Security Misconfiguration | CSP headers covering all external domains; X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| A06 | Vulnerable Components | next-auth updated to beta.31; transitive deps tracked via pnpm audit |
| A07 | Auth Failures | Sliding-window rate limiting (5 req/60 s) on login/register; bcrypt password hashing |
| A08 | Software & Data Integrity | STRIPE_WEBHOOK_SECRET verified on every webhook; idempotency keys on Mercado Pago |
| A09 | Logging & Monitoring | No PII in server logs; Sentry DSN configured for error monitoring |
| A10 | Server-Side Request Forgery | ViaCEP proxied server-side; no user-controlled URLs used in server fetches |

### Additional findings fixed

- Removed console.log leaking form data in ContactForm.tsx
- CSP updated: added lh3.googleusercontent.com (Google avatars), viacep.com.br, api.mercadopago.com, Mercado Pago checkout domains, worker-src 'self' blob:
- callbackUrl validation: only relative paths (/...) accepted as redirect destinations — prevents open redirect
- /forgot-password added to auth-page list so logged-in users are redirected away
- Rate limits added: /api/mercadopago/* 10/min, /api/stripe/* 10/min, /api/reviews 20/min, /api/wishlist 30/min

### Dependency versions (2026-05-14)

| Package | Version |
|---------|---------|
| next | 15.x |
| next-auth | 5.0.0-beta.31 |
| prisma | latest |
| @upstash/ratelimit | latest |
| stripe | latest |
| mercadopago | latest |
| zod | latest |

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| latest (main branch) | Yes |
| older tags | No |
