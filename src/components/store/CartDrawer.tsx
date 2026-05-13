"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, total, isEmpty, removeItem, updateQuantity } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>
            Carrinho{" "}
            {!isEmpty && (
              <span className="text-muted-foreground font-normal">
                ({items.length} {items.length === 1 ? "item" : "itens"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <ShoppingBag className="size-16 text-muted-foreground/50" />
            <div className="text-center">
              <p className="font-medium">Carrinho vazio</p>
              <p className="text-sm text-muted-foreground mt-1">
                Explore nossos produtos e adicione ao carrinho
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              render={<Link href="/products" />}
            >
              Ver produtos
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="flex flex-col gap-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative size-16 rounded-lg overflow-hidden bg-muted shrink-0 border">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatPrice(item.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Diminuir quantidade"
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="text-sm w-5 text-center tabular-nums">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Aumentar quantidade"
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                        aria-label={`Remover ${item.name}`}
                      >
                        <X className="size-3.5" />
                      </button>
                      <p className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="px-6 py-4 border-t space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Frete e impostos calculados no checkout
              </p>
              <Separator />
            </div>

            <SheetFooter className="px-6 pb-6 pt-0">
              <Button
                className="w-full"
                size="lg"
                onClick={() => onOpenChange(false)}
                render={<Link href="/checkout" />}
              >
                Finalizar compra — {formatPrice(total)}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
