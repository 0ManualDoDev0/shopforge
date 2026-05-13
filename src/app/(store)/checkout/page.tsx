"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_COST = 20;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [items.length, router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  async function handleCheckout() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(
          (err as { error?: string }).error ?? "Erro ao criar sessão de pagamento"
        );
      }

      const { url } = (await res.json()) as { sessionId: string; url: string };
      if (url) {
        clearCart();
        window.location.href = url;
      }
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao iniciar pagamento");
      setIsLoading(false);
    }
  }

  if (items.length === 0) return null;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Finalizar Compra</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Order items */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
          <div className="divide-y rounded-lg border">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatPrice(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment panel */}
        <div className="space-y-4">
          <div className="rounded-lg border p-6">
            <h2 className="mb-4 text-lg font-semibold">Total</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frete</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Grátis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-muted-foreground">
                  Frete grátis acima de {formatPrice(FREE_SHIPPING_THRESHOLD)}
                </p>
              )}
            </div>

            <div className="mt-4 border-t pt-4 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <Button
              className="mt-6 w-full"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Redirecionando...
                </>
              ) : (
                "Finalizar com Cartão"
              )}
            </Button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              <span>Pagamento seguro via Stripe</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            render={<Link href="/cart" />}
          >
            Voltar ao Carrinho
          </Button>
        </div>
      </div>
    </main>
  );
}
