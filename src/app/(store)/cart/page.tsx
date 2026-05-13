import type { Metadata } from "next";
import CartContent from "./CartContent";

export const metadata: Metadata = { title: "Carrinho — ShopForge" };

export default function CartPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-2xl font-bold">Carrinho de Compras</h1>
      <CartContent />
    </main>
  );
}
