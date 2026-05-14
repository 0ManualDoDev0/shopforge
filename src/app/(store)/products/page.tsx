import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";
import FilterSidebar from "@/components/store/FilterSidebar";
import ProductsSearchBar from "@/components/store/ProductsSearchBar";
import ProductsToolbar from "@/components/store/ProductsToolbar";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Produtos — ShopForge" };

const PER_PAGE = 12;

type SortKey = "relevance" | "price_asc" | "price_desc" | "best_sellers" | "newest";

function getSortOrder(sort: SortKey) {
  switch (sort) {
    case "price_asc":
      return { price: "asc" as const };
    case "price_desc":
      return { price: "desc" as const };
    case "best_sellers":
      return { orderItems: { _count: "desc" as const } };
    case "newest":
    case "relevance":
    default:
      return { createdAt: "desc" as const };
  }
}

interface SearchParams {
  q?: string;
  category?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  sort?: string;
  view?: string;
}

interface ProductsListProps {
  query: string;
  selectedCategories: string[];
  minPrice: number | undefined;
  maxPrice: number | undefined;
  currentPage: number;
  sort: SortKey;
  view: string;
}

async function ProductsList({
  query,
  selectedCategories,
  minPrice,
  maxPrice,
  currentPage,
  sort,
  view,
}: ProductsListProps) {
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

  const orderBy = getSortOrder(sort);

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        category: true,
        _count: { select: { orderItems: true } },
        reviews: { select: { rating: true } },
      },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
      orderBy,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function buildPageUrl(page: number) {
    const p = new URLSearchParams();
    if (query) p.set("q", query);
    selectedCategories.forEach((c) => p.append("category", c));
    if (minPrice !== undefined) p.set("minPrice", String(minPrice));
    if (maxPrice !== undefined) p.set("maxPrice", String(maxPrice));
    if (sort !== "relevance") p.set("sort", sort);
    p.set("page", String(page));
    return `/products?${p.toString()}`;
  }

  const isList = view === "list";

  return (
    <>
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
      ) : isList ? (
        <div className="flex flex-col gap-3">
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
    </>
  );
}

function ProductsSkeleton({ view }: { view: string }) {
  const isList = view === "list";
  return (
    <>
      <div className="mb-4 h-4 w-40 animate-pulse rounded bg-muted" />
      {isList ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex gap-4 rounded-xl border bg-card p-3"
            >
              <div className="h-24 w-24 shrink-0 rounded-lg bg-muted" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 w-1/3 rounded bg-muted" />
                <div className="h-4 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-xl border bg-card"
            >
              <div className="aspect-square bg-muted" />
              <div className="space-y-2 p-3">
                <div className="h-3 w-1/2 rounded bg-muted" />
                <div className="h-4 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="h-8 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

interface Props {
  searchParams: Promise<SearchParams>;
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
  const sort = (params.sort ?? "relevance") as SortKey;
  const view = params.view ?? "grid";

  const allCategories = await db.category.findMany({ orderBy: { name: "asc" } });

  const suspenseKey = [query, sort, view, currentPage, selectedCategories.join(","), minPrice, maxPrice].join("|");

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Produtos</h1>

      <Suspense fallback={<div className="animate-pulse h-10 bg-muted rounded" />}>
        <ProductsSearchBar defaultValue={query} />
      </Suspense>

      <div className="mt-6 flex gap-8">
        <div className="hidden w-60 shrink-0 lg:block">
          <Suspense fallback={<div className="animate-pulse h-96 bg-muted rounded" />}>
            <FilterSidebar categories={allCategories} />
          </Suspense>
        </div>

        <div className="min-w-0 flex-1">
          <Suspense fallback={<div className="animate-pulse h-10 bg-muted rounded mb-4" />}>
            <ProductsToolbar sort={sort} view={view} />
          </Suspense>
          <Suspense key={suspenseKey} fallback={<ProductsSkeleton view={view} />}>
            <ProductsList
              query={query}
              selectedCategories={selectedCategories}
              minPrice={minPrice}
              maxPrice={maxPrice}
              currentPage={currentPage}
              sort={sort}
              view={view}
            />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
