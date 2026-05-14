"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import type { ProductWithCategory } from "@/types";

interface ProductCardProps {
  product: ProductWithCategory;
  avgRating?: number;
  reviewCount?: number;
  totalSold?: number;
}

export default function ProductCard({
  product,
  avgRating = 0,
  reviewCount = 0,
  totalSold = 0,
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const discount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price)
      ? Math.round(
          (1 - Number(product.price) / Number(product.comparePrice)) * 100
        )
      : null;

  const isBestSeller = totalSold > 10;
  const isLowStock = product.stock > 0 && product.stock < 5;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image: product.images[0] ?? "/placeholder.png",
      slug: product.slug,
      stock: product.stock,
    });
    toast.success("Adicionado ao carrinho", {
      description: product.name,
    });
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="group relative rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <Link href={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0] ?? "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount && (
              <Badge className="bg-red-500 hover:bg-red-500 text-white text-xs px-1.5 py-0.5">
                -{discount}%
              </Badge>
            )}
            {isBestSeller && (
              <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs px-1.5 py-0.5">
                Mais Vendido
              </Badge>
            )}
            {product.isFeatured && !isBestSeller && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                Destaque
              </Badge>
            )}
          </div>

          {/* Low stock badge */}
          {isLowStock && (
            <div className="absolute bottom-2 left-2 right-2">
              <span className="block w-full rounded-md bg-red-500/90 px-2 py-0.5 text-center text-[10px] font-medium text-white">
                Poucas unidades
              </span>
            </div>
          )}

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
              <span className="text-sm font-medium bg-background/90 px-3 py-1 rounded-full border">
                Esgotado
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs text-muted-foreground mb-1 truncate">
          {product.category.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium leading-tight line-clamp-2 hover:underline underline-offset-2 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        {/* Rating stars */}
        {reviewCount > 0 && (
          <div className="mb-2 flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-3 ${
                    i < Math.round(avgRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted-foreground">
              {avgRating.toFixed(1)} ({reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="font-bold">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>

        <Button
          className="w-full"
          size="sm"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <ShoppingCart className="size-3.5 mr-1.5" />
          {product.stock === 0 ? "Esgotado" : "Adicionar"}
        </Button>
      </div>
    </motion.article>
  );
}
