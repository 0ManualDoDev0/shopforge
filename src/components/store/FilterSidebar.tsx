"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: Category[];
}

export default function FilterSidebar({ categories }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.getAll("category")
  );
  const [selectedRating, setSelectedRating] = useState<number | null>(
    searchParams.get("rating") ? Number(searchParams.get("rating")) : null
  );

  const updateParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");

      for (const [key, value] of Object.entries(updates)) {
        params.delete(key);
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else if (value !== null && value !== "") {
          params.set(key, value);
        }
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  function toggleCategory(slug: string) {
    const next = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];
    setSelectedCategories(next);
    updateParams({ category: next });
  }

  function applyPriceFilter() {
    updateParams({ minPrice, maxPrice });
  }

  function setRating(rating: number) {
    const next = selectedRating === rating ? null : rating;
    setSelectedRating(next);
    updateParams({ rating: next !== null ? String(next) : null });
  }

  function clearFilters() {
    setMinPrice("");
    setMaxPrice("");
    setSelectedCategories([]);
    setSelectedRating(null);
    router.push(pathname);
  }

  const hasFilters =
    minPrice || maxPrice || selectedCategories.length > 0 || selectedRating !== null;

  return (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Filtros</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            <X className="size-3 mr-1" />
            Limpar
          </Button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h3 className="text-sm font-medium mb-3">Categorias</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.slug}`}
                checked={selectedCategories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <Label
                htmlFor={`cat-${cat.slug}`}
                className="text-sm cursor-pointer font-normal"
              >
                {cat.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-medium mb-3">Faixa de Preço (R$)</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-8 text-sm"
            min={0}
          />
          <span className="text-muted-foreground text-sm">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-8 text-sm"
            min={0}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-2"
          onClick={applyPriceFilter}
        >
          Aplicar
        </Button>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h3 className="text-sm font-medium mb-3">Avaliação Mínima</h3>
        <div className="space-y-1.5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setRating(rating)}
              className={cn(
                "flex items-center gap-1.5 w-full px-2 py-1 rounded-md text-sm transition-colors",
                selectedRating === rating
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-accent"
              )}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-3.5",
                    i < rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-muted text-muted"
                  )}
                />
              ))}
              <span className="text-xs text-muted-foreground">& acima</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
