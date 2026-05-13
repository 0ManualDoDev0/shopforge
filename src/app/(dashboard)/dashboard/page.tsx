import type { Metadata } from "next";
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react";
import { db } from "@/lib/db";
import StatsCard from "@/components/dashboard/StatsCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import TopProductsChart from "@/components/dashboard/TopProductsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Dashboard — Admin" };

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-400",
};

function calcTrend(current: number, prev: number): number {
  if (prev === 0) return current > 0 ? 100 : 0;
  return ((current - prev) / prev) * 100;
}

export default async function DashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalRevenue,
    revenueThisMonth,
    revenueLastMonth,
    ordersThisMonth,
    ordersLastMonth,
    totalProducts,
    totalCustomers,
    newCustomersThisMonth,
    newCustomersLastMonth,
    recentOrders,
  ] = await Promise.all([
    db.order.aggregate({ _sum: { total: true }, where: { isPaid: true } }),
    db.order.aggregate({
      _sum: { total: true },
      where: { isPaid: true, createdAt: { gte: startOfMonth } },
    }),
    db.order.aggregate({
      _sum: { total: true },
      where: {
        isPaid: true,
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
    }),
    db.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.order.count({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } },
    }),
    db.product.count({ where: { isArchived: false } }),
    db.user.count({ where: { role: "USER" } }),
    db.user.count({ where: { role: "USER", createdAt: { gte: startOfMonth } } }),
    db.user.count({
      where: {
        role: "USER",
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
      },
    }),
    db.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const revenueCurrent = Number(revenueThisMonth._sum.total ?? 0);
  const revenuePrev = Number(revenueLastMonth._sum.total ?? 0);

  // Revenue chart — últimos 6 meses
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const paidOrders = await db.order.findMany({
    where: { isPaid: true, createdAt: { gte: sixMonthsAgo } },
    select: { total: true, createdAt: true },
  });

  const monthlyMap: Record<string, number> = {};
  for (const o of paidOrders) {
    const key = `${o.createdAt.getFullYear()}-${String(
      o.createdAt.getMonth() + 1
    ).padStart(2, "0")}`;
    monthlyMap[key] = (monthlyMap[key] ?? 0) + Number(o.total);
  }

  const revenueChartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const raw = d.toLocaleDateString("pt-BR", { month: "short" });
    const label = raw.charAt(0).toUpperCase() + raw.slice(1).replace(".", "");
    return { month: label, revenue: monthlyMap[key] ?? 0 };
  });

  // Top 5 produtos
  const topRaw = await db.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 5,
  });

  const topIds = topRaw.map((p) => p.productId);
  const topDetails = await db.product.findMany({
    where: { id: { in: topIds } },
    select: { id: true, name: true },
  });

  const topProductsData = topRaw.map((p) => ({
    name: topDetails.find((d) => d.id === p.productId)?.name ?? "Produto",
    quantity: p._sum.quantity ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* StatsCards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Receita Total"
          value={formatPrice(Number(totalRevenue._sum.total ?? 0))}
          icon={DollarSign}
          trend={calcTrend(revenueCurrent, revenuePrev)}
        />
        <StatsCard
          title="Pedidos (mês)"
          value={ordersThisMonth}
          icon={ShoppingBag}
          trend={calcTrend(ordersThisMonth, ordersLastMonth)}
        />
        <StatsCard
          title="Produtos Ativos"
          value={totalProducts}
          icon={Package}
          description="Total disponível na loja"
        />
        <StatsCard
          title="Clientes"
          value={totalCustomers}
          icon={Users}
          trend={calcTrend(newCustomersThisMonth, newCustomersLastMonth)}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">
              Receita — Últimos 6 Meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueChartData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Top 5 Produtos Vendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsChart data={topProductsData} />
          </CardContent>
        </Card>
      </div>

      {/* Recent orders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pedidos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">
                    Pedido
                  </th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground hidden sm:table-cell">
                    Cliente
                  </th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground hidden md:table-cell">
                    Data
                  </th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">
                    Total
                  </th>
                  <th className="pb-3 font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Nenhum pedido ainda
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="py-3 pr-4 font-mono text-xs font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <p className="font-medium truncate max-w-[140px]">
                          {order.user?.name ?? "—"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">
                          {order.user?.email}
                        </p>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap hidden md:table-cell">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3 pr-4 font-medium whitespace-nowrap">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[order.status]}`}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
