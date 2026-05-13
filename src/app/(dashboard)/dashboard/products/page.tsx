import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProductsTable from "@/components/dashboard/ProductsTable";

export const metadata: Metadata = { title: "Produtos — Admin" };

const PER_PAGE = 10;

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { q = "", page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page));

  const where = q
    ? { name: { contains: q, mode: "insensitive" as const } }
    : {};

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function buildUrl(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    params.set("page", String(p));
    return `/dashboard/products?${params.toString()}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {total} produto{total !== 1 ? "s" : ""}
        </p>
        <Button render={<Link href="/dashboard/products/new" />}>
          <Plus className="mr-1 size-4" />
          Novo Produto
        </Button>
      </div>

      {/* Search */}
      <form method="GET">
        <Input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome..."
          className="max-w-sm"
        />
      </form>

      <ProductsTable products={products} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          {currentPage > 1 ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={buildUrl(currentPage - 1)} />}
            >
              <ChevronLeft className="mr-1 size-4" />
              Anterior
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="mr-1 size-4" />
              Anterior
            </Button>
          )}

          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={buildUrl(currentPage + 1)} />}
            >
              Próximo
              <ChevronRight className="ml-1 size-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Próximo
              <ChevronRight className="ml-1 size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
