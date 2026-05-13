"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";

const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_COST = 19.9;

export default function CartContent() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <ShoppingBag className="mb-4 size-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Seu carrinho está vazio</h2>
        <p className="mt-2 text-muted-foreground">
          Adicione produtos para continuar.
        </p>
        <Button className="mt-6" render={<Link href="/products" />}>
          Ver Produtos
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Items table */}
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Produto</th>
                <th className="hidden px-4 py-3 text-center font-medium sm:table-cell">
                  Preço
                </th>
                <th className="px-4 py-3 text-center font-medium">Qtd.</th>
                <th className="px-4 py-3 text-right font-medium">Total</th>
                <th className="px-4 py-3" aria-hidden="true" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((item) => (
                <tr key={item.id} className="bg-card">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="line-clamp-2 font-medium underline-offset-2 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="hidden px-4 py-4 text-center text-muted-foreground sm:table-cell">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-6 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                  <td className="px-4 py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Remover ${item.name}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Button variant="outline" render={<Link href="/products" />}>
            ← Continuar Comprando
          </Button>
        </div>
      </div>

      {/* Order summary */}
      <div className="h-fit space-y-4 rounded-xl border bg-card p-6">
        <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Frete</span>
            {shipping === 0 ? (
              <span className="font-medium text-green-600 dark:text-green-400">
                Grátis
              </span>
            ) : (
              <span>{formatPrice(shipping)}</span>
            )}
          </div>
          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              Frete grátis em compras acima de{" "}
              {formatPrice(FREE_SHIPPING_THRESHOLD)}
            </p>
          )}
        </div>

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-lg">{formatPrice(total)}</span>
        </div>

        <Button
          className="w-full"
          size="lg"
          render={<Link href="/checkout" />}
        >
          Finalizar Compra
        </Button>
      </div>
    </div>
  );
}
