"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import QuantitySelector from "./QuantitySelector";

interface ProductPurchaseProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
    slug: string;
    stock: number;
  };
}

export default function ProductPurchase({ product }: ProductPurchaseProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0] ?? "/placeholder.png",
      slug: product.slug,
      stock: product.stock,
    });
    toast.success("Adicionado ao carrinho", { description: product.name });
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Quantidade:</span>
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          max={product.stock}
        />
      </div>
      <Button
        size="lg"
        className="w-full"
        onClick={handleAddToCart}
        disabled={product.stock === 0}
      >
        <ShoppingCart className="size-5 mr-2" />
        {product.stock === 0 ? "Produto Esgotado" : "Adicionar ao Carrinho"}
      </Button>
    </div>
  );
}
