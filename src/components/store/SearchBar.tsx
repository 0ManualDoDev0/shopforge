"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Buscar produtos...",
  defaultValue = "",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, 300);

  const stableOnSearch = useCallback(onSearch, []);

  useEffect(() => {
    stableOnSearch(debouncedQuery);
  }, [debouncedQuery, stableOnSearch]);

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
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
