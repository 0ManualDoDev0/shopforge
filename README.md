# ShopForge

**Plataforma de e-commerce fullstack moderna para portfólio**

[![CI](https://github.com/0ManualDoDev0/shopforge/actions/workflows/ci.yml/badge.svg)](https://github.com/0ManualDoDev0/shopforge/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

> Demo: [shopforge.vercel.app](https://shopforge.vercel.app)

---

## Features

### Loja Pública
- **Homepage** com hero, categorias dinâmicas e produtos em destaque
- **Catálogo** com busca full-text, filtro por categoria, preço mínimo/máximo e paginação
- **Página de produto** com galeria de imagens, avaliações e botão de adicionar ao carrinho
- **Carrinho** persistido no `localStorage` via Zustand com atualização de quantidade
- **Checkout** com resumo de pedido e redirecionamento para Stripe Checkout
- **Pedidos** do usuário com histórico e status colorido
- **Frete grátis** automático em compras acima de R$ 200

### Admin Dashboard
- **Visão geral** com cards de estatísticas (receita, pedidos, produtos, clientes) e tendência % vs mês anterior
- **Gráfico de receita** dos últimos 6 meses (Recharts BarChart)
- **Top 5 produtos** por quantidade vendida (Recharts PieChart)
- **Tabela de pedidos recentes** na página inicial
- **Gestão de produtos**: listagem com miniatura, busca, paginação e arquivar/restaurar
- **Criação de produto** com formulário react-hook-form + Zod + upload de imagens (UploadThing)
- **Gestão de pedidos**: filtro por status e dropdown inline para atualizar status
- **Gestão de clientes**: lista com total gasto (soma de pedidos pagos)
- **Configurações** da loja

### Autenticação & Segurança
- Login com e-mail/senha e Google OAuth (NextAuth v5)
- Senhas com bcrypt cost 12
- Rate limiting no login e registro (Upstash Redis, 5 req/min por IP)
- Middleware protegendo todas as rotas `/dashboard/*`
- OWASP Top 10 endereçado (ver [SECURITY.md](./SECURITY.md))

### Pagamentos
- Stripe Checkout com `mode: payment`
- Preço sempre buscado no banco — nunca confiado no cliente
- Webhook com verificação de assinatura e idempotência por `stripeSessionId`
- Evento `charge.refunded` atualiza status automaticamente

### E-mails Transacionais
- **Boas-vindas** enviado após cadastro (React Email + Resend)
- **Confirmação de pedido** com tabela de itens, totais e endereço

---

## Tech Stack

| Categoria | Tecnologias |
|---|---|
| **Frontend** | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Framer Motion |
| **Backend** | Next.js Route Handlers · NextAuth v5 · Zod v4 · react-hook-form |
| **Banco de Dados** | PostgreSQL · Prisma ORM 5 |
| **Pagamento** | Stripe Checkout · Stripe Webhooks |
| **Autenticação** | NextAuth v5 (JWT) · Google OAuth · bcryptjs |
| **Upload** | UploadThing 7 |
| **E-mail** | Resend · React Email |
| **Gráficos** | Recharts |
| **Estado** | Zustand 5 (persist) |
| **Observabilidade** | Sentry |
| **Rate Limiting** | Upstash Redis (Ratelimit) |
| **DevOps** | GitHub Actions · pnpm · Husky · ESLint · Prettier |

---

## Security

ShopForge endereça todos os itens relevantes do **OWASP Top 10** (2021):

| Item | Controle principal |
|---|---|
| A01 Broken Access Control | Middleware com `getToken` + ADMIN check em cada rota |
| A02 Cryptographic Failures | bcrypt cost 12 · HSTS · sem segredos no código |
| A03 Injection | Prisma ORM parametrizado + Zod em 100% dos inputs |
| A04 Insecure Design | Rate limiting · validação de estoque · preço server-side |
| A05 Security Misconfiguration | CSP · HSTS · X-Frame-Options · `.env` no `.gitignore` |
| A07 Auth Failures | NextAuth JWT · rate limit no login · Google OAuth |
| A08 Data Integrity Failures | Stripe webhook signature · idempotência por `stripeSessionId` |
| A09 Logging & Monitoring | Sentry configurado para produção |
| A10 SSRF | `remotePatterns` restrito no `next.config.ts` |

Detalhes completos: [SECURITY.md](./SECURITY.md)

---

## Architecture

```
shopforge/
├── prisma/
│   ├── schema.prisma          # Modelos: User, Product, Order, Category, Review…
│   └── seed.ts                # 3 categorias · 12 produtos · 2 usuários · pedidos
│
├── emails/                    # Templates React Email
│   ├── OrderConfirmation.tsx
│   └── WelcomeEmail.tsx
│
├── src/
│   ├── app/
│   │   ├── (auth)/            # /login  /register
│   │   ├── (store)/           # /  /products  /products/[slug]  /cart  /checkout  /orders
│   │   ├── (dashboard)/       # /dashboard  /products  /orders  /customers  /settings
│   │   └── api/
│   │       ├── auth/          # NextAuth + /register
│   │       ├── products/      # GET (público) · POST · PATCH · DELETE (ADMIN)
│   │       ├── orders/        # GET (user) · POST · PATCH (ADMIN)
│   │       ├── stripe/        # /create-session  /webhook
│   │       └── upload/        # UploadThing router
│   │
│   ├── components/
│   │   ├── ui/                # Button, Input, Select, Card… (Base UI / shadcn)
│   │   ├── store/             # ProductCard, FilterSidebar, AddToCartButton…
│   │   └── dashboard/         # RevenueChart, TopProductsChart, ProductForm…
│   │
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── db.ts              # Prisma singleton
│   │   ├── stripe.ts          # Stripe client
│   │   ├── resend.ts          # Resend client
│   │   ├── uploadthing.ts     # UploadButton tipado
│   │   ├── ratelimit.ts       # Upstash Ratelimit
│   │   └── validations/       # Zod schemas (product, order, user)
│   │
│   ├── store/
│   │   └── cartStore.ts       # Zustand + persist
│   │
│   └── middleware.ts          # Auth guard + rate limiting
│
└── .github/workflows/
    └── ci.yml                 # Typecheck · Lint · Build
```

---

## Getting Started

### Pré-requisitos

- Node.js 20+
- pnpm 11+
- PostgreSQL (local ou [Neon](https://neon.tech))
- Conta [Stripe](https://stripe.com) (modo test)
- Conta [UploadThing](https://uploadthing.com)
- Conta [Resend](https://resend.com)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/0ManualDoDev0/shopforge.git
cd shopforge

# 2. Configure as variáveis de ambiente
cp .env.example .env.local
```

Edite `.env.local` com os valores reais:

| Variável | Como obter |
|---|---|
| `DATABASE_URL` | String de conexão PostgreSQL (ex: Neon → Connection String) |
| `NEXTAUTH_URL` | `http://localhost:3000` em dev |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` / `SECRET` | [console.cloud.google.com](https://console.cloud.google.com) → OAuth 2.0 |
| `STRIPE_SECRET_KEY` | Dashboard Stripe → Developers → API Keys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Dashboard Stripe → Publishable key |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/stripe/webhook` |
| `UPLOADTHING_TOKEN` | [uploadthing.com](https://uploadthing.com) → App → API Keys |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `UPSTASH_REDIS_REST_URL` / `TOKEN` | [console.upstash.com](https://console.upstash.com) → Redis → REST API |

```bash
# 3. Instale as dependências
pnpm install

# 4. Execute as migrations e gere o cliente Prisma
pnpm db:migrate

# 5. Popule o banco com dados de exemplo
pnpm db:seed
# Cria: admin@shopforge.com / Admin@123
#       user@shopforge.com  / User@123

# 6. Inicie o servidor de desenvolvimento
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Scripts disponíveis

| Script | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm typecheck` | Verificação TypeScript |
| `pnpm lint` | ESLint |
| `pnpm db:migrate` | Executa migrations Prisma |
| `pnpm db:seed` | Popula o banco com dados de exemplo |
| `pnpm db:studio` | Abre Prisma Studio |

---

## Deploy

### Vercel (App)

1. Importe o repositório no [Vercel](https://vercel.com)
2. Adicione todas as variáveis de ambiente listadas acima em **Settings → Environment Variables**
3. Framework preset: **Next.js** (detectado automaticamente)
4. Clique em **Deploy**

### Neon (PostgreSQL)

1. Crie um projeto em [neon.tech](https://neon.tech)
2. Copie a **Connection String** para `DATABASE_URL`
3. O Vercel executa `prisma migrate deploy` via build command ou via script pós-deploy

### Upstash (Redis)

1. Crie um banco Redis em [console.upstash.com](https://console.upstash.com)
2. Copie **REST URL** e **REST Token** para as variáveis `UPSTASH_REDIS_REST_*`

### Stripe (Pagamentos)

1. Ative sua conta Stripe e obtenha as chaves de API
2. Configure um **Webhook Endpoint** apontando para `https://seu-dominio.vercel.app/api/stripe/webhook`
3. Selecione o evento `checkout.session.completed` e `charge.refunded`
4. Copie o **Signing Secret** para `STRIPE_WEBHOOK_SECRET`

---

## License

[MIT](./LICENSE) © 2025 Pedro Rafael Marchiori
