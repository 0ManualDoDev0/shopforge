"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Archive, ArchiveRestore, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { ProductWithCategory } from "@/types";

interface ProductsTableProps {
  products: ProductWithCategory[];
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleArchive(product: ProductWithCategory) {
    setLoadingId(product.id);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !product.isArchived }),
      });
      if (!res.ok) throw new Error();
      toast.success(
        product.isArchived ? "Produto reativado" : "Produto arquivado"
      );
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar produto");
    } finally {
      setLoadingId(null);
    }
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border bg-muted/20 py-16">
        <p className="text-sm text-muted-foreground">Nenhum produto encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr className="text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Produto</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">
              Categoria
            </th>
            <th className="hidden px-4 py-3 font-medium sm:table-cell">
              Preço
            </th>
            <th className="hidden px-4 py-3 font-medium lg:table-cell">
              Estoque
            </th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y bg-card">
          {products.map((p) => (
            <tr
              key={p.id}
              className="transition-colors hover:bg-muted/20"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={p.images[0] ?? "/placeholder.png"}
                      alt={p.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <span className="line-clamp-1 font-medium">{p.name}</span>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                {p.category.name}
              </td>
              <td className="hidden px-4 py-3 font-medium sm:table-cell">
                {formatPrice(p.price)}
              </td>
              <td className="hidden px-4 py-3 lg:table-cell">
                <span
                  className={
                    p.stock === 0 ? "text-red-500" : "text-muted-foreground"
                  }
                >
                  {p.stock}
                </span>
              </td>
              <td className="px-4 py-3">
                {p.isArchived ? (
                  <Badge variant="secondary" className="text-xs">
                    Arquivado
                  </Badge>
                ) : (
                  <Badge className="bg-green-500/10 text-xs text-green-700 hover:bg-green-500/10 dark:text-green-400">
                    Ativo
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={<Link href={`/dashboard/products/${p.id}`} />}
                    aria-label="Editar produto"
                  >
                    <Edit2 className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleArchive(p)}
                    disabled={loadingId === p.id}
                    aria-label={p.isArchived ? "Reativar produto" : "Arquivar produto"}
                  >
                    {p.isArchived ? (
                      <ArchiveRestore className="size-4" />
                    ) : (
                      <Archive className="size-4" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
