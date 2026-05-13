import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "ShopForge — Loja" };

export default async function StorePage() {
  const featured = await db.product.findMany({
    where: { isFeatured: true, isArchived: false },
    include: { category: true },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main>
      {/* TODO: Hero, FeaturedProducts, Categories */}
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold">Bem-vindo ao ShopForge</h1>
        <p className="mt-2 text-gray-600">{featured.length} produtos em destaque</p>
      </section>
    </main>
  );
}
