"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    stock: number;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] ?? "/placeholder.png",
      slug: product.slug,
      stock: product.stock,
    });
    toast.success("Adicionado ao carrinho", { description: product.name });
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleAddToCart}
      disabled={product.stock === 0}
    >
      <ShoppingCart className="size-5 mr-2" />
      {product.stock === 0 ? "Produto Esgotado" : "Adicionar ao Carrinho"}
    </Button>
  );
}
