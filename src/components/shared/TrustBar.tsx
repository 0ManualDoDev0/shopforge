import { Truck, Shield, RotateCcw, Star } from "lucide-react";

const items = [
  { icon: Truck, title: "Frete Grátis", desc: "acima de R$200" },
  { icon: Shield, title: "Compra Segura", desc: "SSL criptografado" },
  { icon: RotateCcw, title: "Troca em 30 dias", desc: "sem burocracia" },
  { icon: Star, title: "4.9/5", desc: "de avaliação" },
];

interface TrustBarProps {
  compact?: boolean;
}

export default function TrustBar({ compact = false }: TrustBarProps) {
  if (compact) {
    return (
      <div className="grid grid-cols-2 gap-3 rounded-xl border bg-muted/30 p-4">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-2">
            <Icon className="size-4 shrink-0 text-violet-600" />
            <div>
              <p className="text-xs font-semibold leading-tight">{title}</p>
              <p className="text-[11px] text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="border-y bg-muted/30 py-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                <Icon className="size-4 text-violet-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
