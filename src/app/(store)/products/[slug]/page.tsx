import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return { title: "Produto não encontrado" };
  return { title: product.name, description: product.description.slice(0, 160) };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, isArchived: false },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  return (
    <main className="container mx-auto px-4 py-8">
      {/* TODO: ProductImages, ProductInfo, AddToCart, Reviews */}
      <h1 className="text-3xl font-bold">{product.name}</h1>
      <p className="mt-2 text-gray-600">{product.category.name}</p>
      <p className="mt-4 text-xl font-semibold">
        R$ {Number(product.price).toFixed(2)}
      </p>
      <p className="mt-4 text-gray-700">{product.description}</p>
    </main>
  );
}
