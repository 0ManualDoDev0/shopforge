"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevância" },
  { value: "price_asc", label: "Menor Preço" },
  { value: "price_desc", label: "Maior Preço" },
  { value: "best_sellers", label: "Mais Vendidos" },
  { value: "newest", label: "Mais Recentes" },
] as const;

interface ProductsToolbarProps {
  sort: string;
  view: string;
}

export default function ProductsToolbar({ sort, view }: ProductsToolbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set(key, value);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <Select value={sort} onValueChange={(v) => v && updateParam("sort", v)}>
        <SelectTrigger className="w-44 h-9">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-1">
        <Button
          variant={view === "grid" ? "default" : "outline"}
          size="icon"
          className="h-9 w-9"
          onClick={() => updateParam("view", "grid")}
          aria-label="Visualização em grade"
        >
          <LayoutGrid className="size-4" />
        </Button>
        <Button
          variant={view === "list" ? "default" : "outline"}
          size="icon"
          className="h-9 w-9"
          onClick={() => updateParam("view", "list")}
          aria-label="Visualização em lista"
        >
          <List className="size-4" />
        </Button>
      </div>
    </div>
  );
}
