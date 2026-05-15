import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Zap, Shirt, Headphones, Watch, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import ProductCard from "@/components/store/ProductCard";
import TrustBar from "@/components/shared/TrustBar";
import NewsletterSection from "@/components/store/NewsletterSection";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "ShopForge — A Melhor Loja Online" },
  description:
    "Encontre os melhores produtos com qualidade garantida e os melhores preços do mercado.",
};

const categoryIcons: Record<string, React.ReactNode> = {
  roupas: <Shirt className="size-6" />,
  eletronicos: <Zap className="size-6" />,
  acessorios: <Watch className="size-6" />,
  fones: <Headphones className="size-6" />,
};

const categoryColors: Record<string, string> = {
  roupas: "bg-rose-500",
  eletronicos: "bg-blue-500",
  acessorios: "bg-amber-500",
  fones: "bg-purple-500",
};

const fallbackColors = [
  "bg-emerald-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
];

async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: {
      category: true,
      _count: { select: { orderItems: true } },
      reviews: { select: { rating: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

const SITE_URL = "https://shopforge-three.vercel.app";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ShopForge",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/products?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default async function StorePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <main>
      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-24 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-widest text-white/80 uppercase mb-6">
            Nova Coleção Disponível
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            Descubra sua{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              Próxima Peça
            </span>{" "}
            Favorita
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-white/60 md:text-lg">
            Curadoria de produtos premium com entrega rápida e os melhores
            preços do mercado.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white px-8 gap-2"
              render={<Link href="/products" />}
            >
              <ShoppingBag className="size-4" />
              Ver Coleção
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 px-8 gap-2"
              render={<Link href="/products?isFeatured=true" />}
            >
              Ver Ofertas
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Stats strip */}
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-3 gap-8 border-t border-white/10 pt-10">
            {[
              { value: "12+", label: "Produtos" },
              { value: "3", label: "Categorias" },
              { value: "100%", label: "Garantia" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <TrustBar />

      {/* ── Categories ── */}
      <section className="py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold md:text-2xl">Categorias</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Navegue por departamento
              </p>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/products" />}>
              Ver todos <ArrowRight className="ml-1 size-3.5" />
            </Button>
          </div>

          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma categoria disponível.
            </p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {categories.map((cat, i) => {
                const slug = cat.slug ?? cat.name.toLowerCase();
                const color =
                  categoryColors[slug] ??
                  fallbackColors[i % fallbackColors.length];
                const icon = categoryIcons[slug] ?? (
                  <Tag className="size-6" />
                );
                return (
                  <Link
                    key={cat.id}
                    href={`/products?category=${slug}`}
                    className="group flex items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div
                      className={`${color} flex size-9 shrink-0 items-center justify-center rounded-lg text-white`}
                    >
                      {icon}
                    </div>
                    <span className="text-sm font-medium">{cat.name}</span>
                    <ArrowRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold md:text-2xl">
                Produtos em Destaque
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Seleção especial para você
              </p>
            </div>
            <Button variant="ghost" size="sm" render={<Link href="/products" />}>
              Ver todos <ArrowRight className="ml-1 size-3.5" />
            </Button>
          </div>

          {featured.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/20 py-20 text-center">
              <ShoppingBag className="mb-3 size-10 text-muted-foreground" />
              <p className="text-base font-medium">Nenhum produto em destaque</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Volte em breve para novidades.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {featured.map((product) => {
                const avgRating =
                  product.reviews.length > 0
                    ? product.reviews.reduce((s, r) => s + r.rating, 0) /
                      product.reviews.length
                    : 0;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    avgRating={avgRating}
                    reviewCount={product.reviews.length}
                    totalSold={product._count.orderItems}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Newsletter ── */}
      <NewsletterSection />

      {/* ── Promotional Banner ── */}
      <section className="mx-4 my-16 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 md:mx-auto md:max-w-5xl">
        <div className="flex flex-col items-center gap-4 px-8 py-14 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Promoção
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Frete grátis acima de R$&nbsp;200
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Em todos os produtos selecionados. Sem código necessário.
            </p>
          </div>
          <Button
            size="lg"
            className="shrink-0 bg-white text-violet-700 hover:bg-white/90 px-8"
            render={<Link href="/products" />}
          >
            Aproveitar Agora
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </main>
    </>
  );
}
