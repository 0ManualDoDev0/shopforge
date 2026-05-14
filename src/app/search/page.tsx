import type { Metadata } from "next";
import Link from "next/link";
import { SearchX, Tag } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Resultados para "${q}" — ShopForge` : "Busca — ShopForge",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [products, categories] = await Promise.all([
    query
      ? db.product.findMany({
          where: {
            isArchived: false,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          },
          include: {
            category: true,
            _count: { select: { orderItems: true } },
            reviews: { select: { rating: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 48,
        })
      : Promise.resolve([]),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      {query ? (
        <>
          <h1 className="mb-6 text-xl font-semibold">
            <span className="text-muted-foreground font-normal">
              {products.length} resultado{products.length !== 1 ? "s" : ""} para{" "}
            </span>
            &ldquo;{query}&rdquo;
          </h1>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/20 py-24 text-center">
              <SearchX className="mb-4 size-12 text-muted-foreground" />
              <p className="text-lg font-medium">Nenhum resultado encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente usar termos diferentes ou navegue pelas categorias abaixo.
              </p>

              {categories.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant="outline"
                      size="sm"
                      render={
                        <Link href={`/products?category=${cat.slug ?? cat.name.toLowerCase()}`} />
                      }
                    >
                      <Tag className="mr-1.5 size-3.5" />
                      {cat.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {products.map((product) => {
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
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <SearchX className="mb-4 size-12 text-muted-foreground" />
          <p className="text-lg font-medium">Digite algo para buscar</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Use a barra de busca para encontrar produtos.
          </p>

          {categories.length > 0 && (
            <>
              <p className="mt-6 text-sm font-medium">Navegar por categoria</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant="outline"
                    size="sm"
                    render={
                      <Link href={`/products?category=${cat.slug ?? cat.name.toLowerCase()}`} />
                    }
                  >
                    <Tag className="mr-1.5 size-3.5" />
                    {cat.name}
                  </Button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  );
}
