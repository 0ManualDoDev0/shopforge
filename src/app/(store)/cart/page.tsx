import type { Metadata } from "next";

export const metadata: Metadata = { title: "Carrinho" };

export default function CartPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Carrinho</h1>
      {/* TODO: CartItems (client component), OrderSummary */}
    </main>
  );
}
