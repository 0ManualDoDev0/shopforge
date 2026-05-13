# Security Policy

This document describes how ShopForge addresses each item of the [OWASP Top 10](https://owasp.org/www-project-top-ten/) (2021 edition).

---

## OWASP Top 10 Coverage

### A01 — Broken Access Control

| Control | Implementation |
|---|---|
| Dashboard protection | `src/middleware.ts` — every request to `/dashboard/*` is intercepted; `getToken()` (next-auth/jwt) validates the JWT and verifies `role === "ADMIN"` before forwarding. Non-authenticated users are redirected to `/login`; authenticated non-admins to `/`. |
| API route authorization | All mutating product endpoints (`POST /api/products`, `PATCH /api/products/[id]`, `DELETE /api/products/[id]`) repeat the ADMIN check independently of the middleware. |
| User-scoped data | `GET /api/orders` returns only the authenticated user's orders (`where: { userId: session.user.id }`). ADMIN accounts may query all orders via a role check. |
| Order status changes | `PATCH /api/orders/[id]` validates `role === "ADMIN"` before allowing any status update. |

---

### A02 — Cryptographic Failures

| Control | Implementation |
|---|---|
| Password hashing | `bcryptjs` with **cost factor 12** (`bcrypt.hash(password, 12)`). Plain-text passwords are never stored or logged. |
| Secret management | `AUTH_SECRET` / `NEXTAUTH_SECRET` loaded exclusively from environment variables; no hardcoded secrets anywhere in the codebase. |
| HTTPS enforcement | `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` header applied to all routes via `next.config.ts`. |
| No sensitive logging | Prisma log level is set to `["error"]` in production; no user credentials, tokens, or payment data are written to logs. |
| Stripe data | Card data never touches the server — Stripe Checkout handles PCI compliance on their infrastructure. |

---

### A03 — Injection

| Control | Implementation |
|---|---|
| ORM-level protection | 100% of database queries go through **Prisma**, which uses parameterized prepared statements. Raw SQL (`$queryRaw`, `$executeRaw`) is never used. |
| Input validation | Every API endpoint validates its request body with **Zod** before the data reaches the database layer (e.g. `productSchema`, `createOrderSchema`, `updateSchema`). |
| Type-safe queries | TypeScript strict mode (`"strict": true`) ensures query arguments are typed at compile time, preventing accidental string interpolation. |

---

### A04 — Insecure Design

| Control | Implementation |
|---|---|
| Rate limiting | `src/middleware.ts` applies **Upstash Redis Ratelimit** (sliding window, 5 req / 60 s per IP) to `/api/auth/register` and `/api/auth/callback/credentials`. Returns HTTP 429 when exceeded. |
| Inventory validation | `POST /api/orders` fetches the current stock from the database for each product and rejects the request if any item exceeds available inventory. |
| Server-side pricing | `POST /api/stripe/create-session` always re-fetches prices from the database — client-sent prices are completely ignored. The same applies inside the Stripe webhook when computing the order total. |
| Slug uniqueness | Product slugs are generated server-side with collision detection; the system appends an incrementing suffix if a slug already exists. |

---

### A05 — Security Misconfiguration

| Control | Implementation |
|---|---|
| Security headers | `next.config.ts` sets the following headers on every response: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: origin-when-cross-origin`, `Permissions-Policy`. |
| CSP scope | `script-src` explicitly lists Stripe domains; `img-src` limits external images to utfs.io and images.unsplash.com; `frame-src` limits iframes to Stripe Checkout domains. |
| Safe defaults | `.env.example` contains only placeholder values and is committed to source control. Actual secrets (`.env.local`, `.env`) are listed in `.gitignore` and never committed. |
| Dependency hygiene | Managed via `pnpm` with a locked `pnpm-lock.yaml`. The CI pipeline runs `pnpm install --frozen-lockfile`, preventing unexpected dependency changes during builds. |

---

### A07 — Identification and Authentication Failures

| Control | Implementation |
|---|---|
| Session management | **NextAuth v5** (beta.28) with JWT strategy; tokens are signed with `AUTH_SECRET`. |
| Token rotation | JWT is re-issued on every sign-in; old tokens become invalid on sign-out via `signOut({ callbackUrl: "/login" })`. |
| Google OAuth | Alternative authentication via Google provider reduces reliance on password-only flows. |
| Credential validation | `loginSchema` (Zod) validates email format and non-empty password before the credentials provider queries the database. |
| Rate-limited logins | The credentials callback endpoint (`/api/auth/callback/credentials`) is rate-limited by the middleware (5 req / 60 s per IP), mitigating brute-force attacks. |

---

### A08 — Software and Data Integrity Failures

| Control | Implementation |
|---|---|
| Webhook signature verification | `src/app/api/stripe/webhook/route.ts` calls `stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET)`. Any request with an invalid or missing signature is rejected with HTTP 400 before any business logic runs. |
| Idempotency | Before creating an order in the webhook handler, the system checks for an existing order with the same `stripeSessionId`. Duplicate webhook deliveries are silently ignored. |
| Raw body integrity | The webhook reads the request as raw text (`req.text()`) before Stripe signature verification, ensuring the payload is not mutated by middleware parsing. |

---

### A09 — Security Logging and Monitoring Failures

| Control | Implementation |
|---|---|
| Error monitoring | **Sentry** (`@sentry/nextjs`) is configured for both client and server; unhandled exceptions and rejected promises are captured automatically with request context. |
| Production-only noise reduction | Prisma query logging is disabled in production; only errors are reported, preventing PII leakage through verbose logs. |
| Alerting | Sentry can be configured with alert rules to notify on error spikes, new issues, or performance regressions (configured in the Sentry dashboard). |

---

### A10 — Server-Side Request Forgery (SSRF)

| Control | Implementation |
|---|---|
| Image domain allowlist | `next.config.ts` `images.remotePatterns` explicitly allows only `utfs.io`, `images.unsplash.com`, and `ufs.sh`. Requests to any other hostname are rejected by Next.js at runtime. |
| No user-controlled URLs | No API route accepts a URL from the client and performs a server-side HTTP request to it. Product images are uploaded through UploadThing (which enforces its own allowlist) and stored as `utfs.io` URLs. |

---

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public GitHub issue.

Send a private report to: **pedro.rafael090301@gmail.com**

Include:
- A clear description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- (Optional) a suggested fix

You can expect an acknowledgement within **48 hours** and a resolution timeline within **7 days** for critical issues.
