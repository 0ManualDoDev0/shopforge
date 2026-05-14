"use client";

import { useState } from "react";
import { Truck, Zap, AlertCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShippingOption {
  name: string;
  days: string;
  price: number;
  icon: React.ElementType;
  color: string;
}

const OPTIONS: ShippingOption[] = [
  {
    name: "PAC",
    days: "5 a 8 dias úteis",
    price: 15.9,
    icon: Truck,
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "SEDEX",
    days: "2 a 3 dias úteis",
    price: 28.5,
    icon: Zap,
    color: "text-violet-600 dark:text-violet-400",
  },
];

function formatCEP(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`;
  return digits;
}

function formatPrice(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ShippingCalculator() {
  const [cep, setCep] = useState("");
  const [city, setCity] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculated, setCalculated] = useState(false);

  function handleCEPChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCep(formatCEP(e.target.value));
    setError(null);
    setCalculated(false);
    setCity(null);
  }

  async function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setError("CEP deve ter 8 dígitos");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cep?cep=${digits}`);
      const data = await res.json();

      if (data.erro) {
        setError("CEP não encontrado. Verifique e tente novamente.");
        setCalculated(false);
        setCity(null);
      } else {
        setCity(`${data.localidade} — ${data.uf}`);
        setCalculated(true);
      }
    } catch {
      setError("Erro ao consultar o CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-muted/20 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Truck className="size-4" />
        Calcular Frete
      </h3>

      <form onSubmit={handleCalculate} className="flex gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={cep}
          onChange={handleCEPChange}
          placeholder="00000-000"
          className="h-9 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          aria-label="CEP"
        />
        <Button type="submit" size="sm" disabled={loading || cep.replace(/\D/g, "").length !== 8}>
          {loading ? "..." : "Calcular"}
        </Button>
      </form>

      <a
        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1.5 block text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
      >
        Não sei meu CEP
      </a>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/40 dark:bg-red-900/20">
          <AlertCircle className="size-4 shrink-0 text-red-500" />
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {calculated && city && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5" />
            <span>{city}</span>
          </div>
          {OPTIONS.map((opt) => (
            <div
              key={opt.name}
              className="flex items-center justify-between rounded-lg border bg-background px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <opt.icon className={`size-4 ${opt.color}`} />
                <div>
                  <p className="text-sm font-medium">{opt.name}</p>
                  <p className="text-xs text-muted-foreground">{opt.days}</p>
                </div>
              </div>
              <p className="text-sm font-semibold">{formatPrice(opt.price)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
