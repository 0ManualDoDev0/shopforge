import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Meus Pedidos" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id! },
    include: { items: { include: { product: true } }, address: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Meus Pedidos</h1>
      {/* TODO: OrderList */}
      <p className="text-gray-600">{orders.length} pedido(s)</p>
    </main>
  );
}
