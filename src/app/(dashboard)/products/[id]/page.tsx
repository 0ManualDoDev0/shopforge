import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = { title: "Editar Produto" };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { category: true } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Editar: {product.name}</h1>
      {/* TODO: ProductForm (pre-filled) */}
      <p className="text-gray-600">{categories.length} categorias disponíveis</p>
    </div>
  );
}
