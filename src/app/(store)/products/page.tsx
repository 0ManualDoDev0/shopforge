import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Produtos" };

interface Props {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { page = "1", category, search } = await searchParams;

  const where = {
    isArchived: false,
    ...(category && { category: { slug: category } }),
    ...(search && { name: { contains: search, mode: "insensitive" as const } }),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      skip: (Number(page) - 1) * 12,
      take: 12,
      orderBy: { createdAt: "desc" },
    }),
    db.product.count({ where }),
  ]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Produtos</h1>
      {/* TODO: ProductGrid, Filters, Pagination */}
      <p className="text-gray-600">{total} produtos encontrados</p>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="rounded-lg border p-4">
            <p className="font-medium">{p.name}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
