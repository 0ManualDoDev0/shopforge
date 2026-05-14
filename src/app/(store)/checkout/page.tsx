"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ShieldCheck, CreditCard, QrCode } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";
import CouponInput from "@/components/store/CouponInput";
import PixPayment from "@/components/store/PixPayment";

const FREE_SHIPPING_THRESHOLD = 200;
const SHIPPING_COST = 20;

type PaymentMethod = "card" | "pix";

interface PixData {
  qrCode: string;
  qrCodeBase64: string;
  paymentId: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [pixData, setPixData] = useState<PixData | null>(null);

  useEffect(() => {
    if (items.length === 0 && !pixData) router.replace("/cart");
  }, [items.length, pixData, router]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = Math.max(0, subtotal + shipping - couponDiscount);

  function handleCouponApplied(discount: number, code: string) {
    setCouponDiscount(discount);
    setCouponCode(code);
  }

  async function handleCardCheckout() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          couponCode: couponCode || undefined,
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

  async function handlePixCheckout() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/mercadopago/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
          couponCode: couponCode || undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { error?: string }).error ?? "Erro ao gerar Pix");
      }

      const data = (await res.json()) as PixData;
      clearCart();
      setPixData(data);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro ao gerar Pix");
      setIsLoading(false);
    }
  }

  function handleCheckout() {
    if (paymentMethod === "pix") return handlePixCheckout();
    return handleCardCheckout();
  }

  if (items.length === 0 && !pixData) return null;

  if (pixData) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">Pagar com Pix</h1>
        <PixPayment
          qrCode={pixData.qrCode}
          qrCodeBase64={pixData.qrCodeBase64}
          paymentId={pixData.paymentId}
        />
      </main>
    );
  }

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
          {/* Coupon */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-semibold">Cupom de Desconto</h3>
            <CouponInput cartTotal={subtotal} onCouponApplied={handleCouponApplied} />
          </div>

          {/* Payment method selector */}
          <div className="rounded-lg border p-4">
            <h3 className="mb-3 text-sm font-semibold">Forma de Pagamento</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("card")}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-colors",
                  paymentMethod === "card"
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:bg-muted/50"
                )}
              >
                <CreditCard className="size-5" />
                Cartão de Crédito
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("pix")}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs font-medium transition-colors",
                  paymentMethod === "pix"
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:bg-muted/50"
                )}
              >
                <QrCode className="size-5" />
                Pix
              </button>
            </div>
          </div>

          {/* Total */}
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
                    <span className="font-medium text-green-600">Grátis</span>
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
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Desconto ({couponCode})</span>
                  <span>− {formatPrice(couponDiscount)}</span>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between text-base font-bold">
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
                  {paymentMethod === "pix" ? "Gerando Pix..." : "Redirecionando..."}
                </>
              ) : paymentMethod === "pix" ? (
                <>
                  <QrCode className="mr-2 size-4" />
                  Gerar QR Code Pix
                </>
              ) : (
                "Finalizar com Cartão"
              )}
            </Button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              <span>
                {paymentMethod === "pix"
                  ? "Pagamento instantâneo via Pix"
                  : "Pagamento seguro via Stripe"}
              </span>
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
