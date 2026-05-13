"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductsSearchBar({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, 300);
  const isFirst = useRef(true);
  const latestSearchParams = useRef(searchParams);

  useEffect(() => {
    latestSearchParams.current = searchParams;
  });

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    const params = new URLSearchParams(latestSearchParams.current.toString());
    params.delete("page");
    if (debouncedQuery) {
      params.set("q", debouncedQuery);
    } else {
      params.delete("q");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedQuery, pathname, router]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar produtos..."
        className="pl-9 pr-9"
        aria-label="Buscar produtos"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded"
          aria-label="Limpar busca"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
