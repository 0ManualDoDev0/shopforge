import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { db } from "@/lib/db";
import ProductForm from "@/components/dashboard/ProductForm";

export const metadata: Metadata = { title: "Novo Produto — Admin" };

export default async function NewProductPage() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/products"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Voltar para Produtos
      </Link>
      <ProductForm categories={categories} />
    </div>
  );
}
