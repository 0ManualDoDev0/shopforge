import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import OrderStatusSelect from "@/components/dashboard/OrderStatusSelect";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Pedidos — Admin" };

const PER_PAGE = 15;

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status, page = "1" } = await searchParams;
  const currentPage = Math.max(1, Number(page));

  const validStatus = ALL_STATUSES.includes(status as OrderStatus)
    ? (status as OrderStatus)
    : undefined;

  const where = validStatus ? { status: validStatus } : {};

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true,
      },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
      orderBy: { createdAt: "desc" },
    }),
    db.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function buildUrl(p: number) {
    const params = new URLSearchParams();
    if (validStatus) params.set("status", validStatus);
    params.set("page", String(p));
    return `/dashboard/orders?${params.toString()}`;
  }

  return (
    <div className="space-y-4">
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/dashboard/orders"
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            !validStatus
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          Todos
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/dashboard/orders?status=${s}`}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              validStatus === s
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {total} pedido{total !== 1 ? "s" : ""}
      </p>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Cliente
              </th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">
                Data
              </th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-card">
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Nenhum pedido encontrado
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-medium">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </p>
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <p className="max-w-[160px] truncate font-medium">
                      {order.user?.name ?? "—"}
                    </p>
                    <p className="max-w-[160px] truncate text-xs text-muted-foreground">
                      {order.user?.email}
                    </p>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          {currentPage > 1 ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={buildUrl(currentPage - 1)} />}
            >
              <ChevronLeft className="mr-1 size-4" />
              Anterior
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="mr-1 size-4" />
              Anterior
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={buildUrl(currentPage + 1)} />}
            >
              Próximo
              <ChevronRight className="ml-1 size-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Próximo
              <ChevronRight className="ml-1 size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
