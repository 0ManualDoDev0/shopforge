import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";
import FilterSidebar from "@/components/store/FilterSidebar";
import ProductsSearchBar from "@/components/store/ProductsSearchBar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Produtos — ShopForge" };

const PER_PAGE = 12;

interface Props {
  searchParams: Promise<{
    q?: string;
    category?: string | string[];
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const currentPage = Math.max(1, Number(params.page ?? 1));
  const query = params.q ?? "";
  const selectedCategories = Array.isArray(params.category)
    ? params.category
    : params.category
    ? [params.category]
    : [];
  const minPrice = params.minPrice ? Number(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;

  const where = {
    isArchived: false,
    ...(query && { name: { contains: query, mode: "insensitive" as const } }),
    ...(selectedCategories.length > 0 && {
      category: { slug: { in: selectedCategories } },
    }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const [products, total, allCategories] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: true,
        _count: { select: { orderItems: true } },
        reviews: { select: { rating: true } },
      },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    db.product.count({ where }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function buildPageUrl(page: number) {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    selectedCategories.forEach((c) => p.append("category", c));
    if (minPrice !== undefined) p.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) p.set("maxPrice", String(maxPrice));
    p.set("page", String(page));
    return `/products?${p.toString()}`;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Produtos</h1>

      <ProductsSearchBar defaultValue={query} />

      <div className="mt-6 flex gap-8">
        <div className="hidden w-60 shrink-0 lg:block">
          <FilterSidebar categories={allCategories} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-4 text-sm text-muted-foreground">
            {total === 0
              ? "Nenhum produto encontrado"
              : `${total} produto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
          </p>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/20 py-24 text-center">
              <p className="text-lg font-medium">Nenhum produto encontrado</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tente ajustar os filtros ou o termo de busca.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                render={<Link href="/products" />}
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
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

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              {currentPage > 1 ? (
                <Button
                  variant="outline"
                  render={<Link href={buildPageUrl(currentPage - 1)} />}
                >
                  <ChevronLeft className="mr-1 size-4" />
                  Anterior
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  <ChevronLeft className="mr-1 size-4" />
                  Anterior
                </Button>
              )}

              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Button
                  variant="outline"
                  render={<Link href={buildPageUrl(currentPage + 1)} />}
                >
                  Próximo
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Próximo
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
