import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [totalOrders, totalRevenue, totalProducts, totalUsers] = await Promise.all([
    db.order.count(),
    db.order.aggregate({ _sum: { total: true }, where: { isPaid: true } }),
    db.product.count({ where: { isArchived: false } }),
    db.user.count(),
  ]);

  const stats = [
    { label: "Pedidos", value: totalOrders },
    { label: "Receita", value: `R$ ${Number(totalRevenue._sum.total ?? 0).toFixed(2)}` },
    { label: "Produtos", value: totalProducts },
    { label: "Clientes", value: totalUsers },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Visão Geral</h1>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      {/* TODO: RevenueChart (Recharts), RecentOrders */}
    </div>
  );
}
