import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import OrderCard from "@/components/store/OrderCard";
import type { OrderStatus } from "@/types";

export const metadata: Metadata = { title: "Meus Pedidos — ShopForge" };

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

  // Serialize Decimal/Date fields for client components
  const serializedOrders = orders.map((order) => ({
    id: order.id,
    status: order.status as OrderStatus,
    total: Number(order.total),
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: Number(item.price),
      product: {
        id: item.product.id,
        name: item.product.name,
        images: item.product.images,
        slug: item.product.slug,
      },
    })),
  }));

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Meus Pedidos</h1>

      {serializedOrders.length === 0 ? (
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
          {serializedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </main>
  );
}
