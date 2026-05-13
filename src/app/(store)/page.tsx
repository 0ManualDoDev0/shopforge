import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import ProductCard from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ShopForge — A Melhor Loja Online",
  description:
    "Encontre os melhores produtos com qualidade garantida e os melhores preços do mercado.",
};

async function getCategories() {
  return db.category.findMany({ orderBy: { name: "asc" } });
}

async function getFeaturedProducts() {
  return db.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 8,
  });
}

export default async function StorePage() {
  const [categories, featured] = await Promise.all([
    getCategories(),
    getFeaturedProducts(),
  ]);

  return (
    <main>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            Tudo que você precisa,{" "}
            <span className="text-primary">num só lugar</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Descubra milhares de produtos com qualidade garantida, entrega
            rápida e os melhores preços do mercado.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="px-8" render={<Link href="/products" />}>
              Ver Produtos
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8"
              render={<Link href="/products?isFeatured=true" />}
            >
              Ver Ofertas
              <Tag className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
            Explore por Categoria
          </h2>
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground">
              Nenhuma categoria disponível.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-muted">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Tag className="size-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <span className="text-center text-sm font-medium leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold md:text-3xl">
              Produtos em Destaque
            </h2>
            <Button variant="ghost" render={<Link href="/products" />}>
              Ver todos <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
          {featured.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">
              Nenhum produto em destaque no momento.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold md:text-4xl">
            Frete grátis em compras acima de R$&nbsp;200
          </h2>
          <p className="mt-3 text-primary-foreground/80 md:text-lg">
            Aproveite nossas ofertas exclusivas e economize ainda mais. Novas
            promoções toda semana.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 px-10"
            render={<Link href="/products" />}
          >
            Aproveitar Agora
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </section>
    </main>
  );
}
