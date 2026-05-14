"use client";

import { useState } from "react";
import { Tag, CheckCircle, XCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CouponInputProps {
  cartTotal: number;
  onCouponApplied: (discountAmount: number, code: string) => void;
}

export default function CouponInput({ cartTotal, onCouponApplied }: CouponInputProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState<{ code: string; discount: number; discountAmount: number } | null>(null);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), cartTotal }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Cupom inválido");
        return;
      }

      setApplied(data);
      onCouponApplied(data.discountAmount, data.code);
    } catch {
      setError("Erro ao validar cupom. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function handleRemove() {
    setApplied(null);
    setCode("");
    setError(null);
    onCouponApplied(0, "");
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900/40 dark:bg-green-900/20">
        <div className="flex items-center gap-2">
          <CheckCircle className="size-4 shrink-0 text-green-600 dark:text-green-400" />
          <div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300">
              Cupom <span className="font-mono">{applied.code}</span> aplicado!
            </p>
            <p className="text-xs text-green-600 dark:text-green-400">
              {applied.discount}% de desconto — {formatPrice(applied.discountAmount)} de economia
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="ml-2 rounded-full p-1 text-green-600 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/50"
          aria-label="Remover cupom"
        >
          <X className="size-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleApply} className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Código do cupom"
            className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm uppercase tracking-wide placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Código do cupom"
          />
        </div>
        <Button type="submit" variant="outline" size="sm" disabled={loading || !code.trim()}>
          {loading ? "..." : "Aplicar"}
        </Button>
      </form>

      {error && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <XCircle className="size-3.5 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
