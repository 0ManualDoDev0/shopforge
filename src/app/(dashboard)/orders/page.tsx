import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Pedidos — Admin" };

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Pedidos</h1>
      {/* TODO: OrdersTable with status filters */}
      <p className="text-gray-600">{orders.length} pedido(s) recentes</p>
    </div>
  );
}
