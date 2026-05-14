"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max: number;
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
}: QuantitySelectorProps) {
  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const n = Number(e.target.value);
    if (!isNaN(n)) onChange(Math.min(max, Math.max(min, n)));
  }

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-r-none border-r-0"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Diminuir quantidade"
      >
        <Minus className="size-3.5" />
      </Button>
      <input
        type="number"
        value={value}
        onChange={handleInput}
        min={min}
        max={max}
        className="h-10 w-14 border border-input bg-background text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Quantidade"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-l-none border-l-0"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  );
}
