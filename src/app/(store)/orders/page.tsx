import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Meus Pedidos — ShopForge" };

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_CLASSES: Record<OrderStatus, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id! },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true, images: true, slug: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Meus Pedidos</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/20 py-24 text-center">
          <PackageSearch className="mb-4 size-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Nenhum pedido ainda</h2>
          <p className="mt-2 text-muted-foreground">
            Explore nossos produtos e faça seu primeiro pedido.
          </p>
          <Button className="mt-6" render={<Link href="/products" />}>
            Ver Produtos
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="overflow-hidden rounded-xl border bg-card"
            >
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 px-5 py-4">
                <div className="space-y-0.5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Pedido
                  </p>
                  <p className="font-mono text-sm font-medium">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Data
                  </p>
                  <p className="text-sm">{formatDate(order.createdAt)}</p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Total
                  </p>
                  <p className="text-sm font-semibold">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASSES[order.status]}`}
                >
                  {STATUS_LABELS[order.status]}
                </span>
              </div>

              {/* Products */}
              <div className="divide-y px-5">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.product.images[0] ?? "/placeholder.png"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="block truncate text-sm font-medium underline-offset-2 hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        Qtd: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="shrink-0 text-sm font-medium">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />
              <div className="flex justify-end px-5 py-3">
                <p className="text-sm text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                  {" · "}
                  <span className="font-medium text-foreground">
                    {formatPrice(order.total)}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
