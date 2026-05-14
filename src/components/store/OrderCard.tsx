"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";
import OrderTimeline from "./OrderTimeline";
import type { OrderStatus } from "@/types";

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
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
    slug: string;
  };
}

interface OrderCardProps {
  order: {
    id: string;
    status: OrderStatus;
    total: number;
    createdAt: string;
    items: OrderItem[];
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/30 px-5 py-4">
        <div className="space-y-0.5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Pedido</p>
          <p className="font-mono text-sm font-medium">
            #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Data</p>
          <p className="text-sm">{formatDate(new Date(order.createdAt))}</p>
        </div>
        <div className="space-y-0.5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Total</p>
          <p className="text-sm font-semibold">{formatPrice(order.total)}</p>
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
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <Separator />

      {/* Footer with toggle */}
      <div className="flex items-center justify-between px-5 py-3">
        <p className="text-sm text-muted-foreground">
          {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          {" · "}
          <span className="font-medium text-foreground">{formatPrice(order.total)}</span>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <>
              Ocultar detalhes <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Ver detalhes <ChevronDown className="size-3.5" />
            </>
          )}
        </Button>
      </div>

      {/* Timeline */}
      {expanded && (
        <div className="border-t bg-muted/10 px-5 pt-5">
          <p className="mb-4 text-sm font-semibold">Rastreamento do Pedido</p>
          <OrderTimeline status={order.status} createdAt={order.createdAt} />
        </div>
      )}
    </div>
  );
}
