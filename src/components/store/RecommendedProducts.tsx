"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/store/ProductCard";
import type { ProductWithCategory } from "@/types";

interface Props {
  productId: string;
  categorySlug: string;
}

export default function RecommendedProducts({ productId, categorySlug }: Props) {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);

  useEffect(() => {
    fetch(`/api/products?category=${encodeURIComponent(categorySlug)}&page=1`)
      .then((r) => r.json())
      .then((data: { products?: ProductWithCategory[] }) => {
        const filtered = (data.products ?? [])
          .filter((p) => p.id !== productId)
          .slice(0, 4);
        setProducts(filtered);
      })
      .catch(() => {});
  }, [productId, categorySlug]);

  if (products.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-xl font-bold">Você também pode gostar</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
