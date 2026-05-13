import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Novo Produto" };

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Novo Produto</h1>
      {/* TODO: ProductForm with UploadThing image upload */}
      <p className="text-gray-600">{categories.length} categorias disponíveis</p>
    </div>
  );
}
