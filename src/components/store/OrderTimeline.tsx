import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  PackageCheck,
} from "lucide-react";
import type { OrderStatus } from "@/types";

interface Step {
  label: string;
  description: string;
  icon: React.ElementType;
  daysOffset: number;
  isComplete: (status: OrderStatus) => boolean;
}

const STEPS: Step[] = [
  {
    label: "Pedido Confirmado",
    description: "Recebemos seu pedido e o pagamento foi aprovado.",
    icon: CheckCircle2,
    daysOffset: 0,
    isComplete: () => true,
  },
  {
    label: "Em Separação",
    description: "Seu pedido está sendo preparado pela equipe.",
    icon: Package,
    daysOffset: 1,
    isComplete: (s) => ["PROCESSING", "SHIPPED", "DELIVERED"].includes(s),
  },
  {
    label: "Enviado",
    description: "Seu pedido foi despachado e está a caminho.",
    icon: Truck,
    daysOffset: 3,
    isComplete: (s) => ["SHIPPED", "DELIVERED"].includes(s),
  },
  {
    label: "Saiu para Entrega",
    description: "Seu pedido chegou à sua cidade e está com o entregador.",
    icon: MapPin,
    daysOffset: 5,
    isComplete: (s) => s === "DELIVERED",
  },
  {
    label: "Entregue",
    description: "Seu pedido foi entregue com sucesso. Aproveite!",
    icon: PackageCheck,
    daysOffset: 7,
    isComplete: (s) => s === "DELIVERED",
  },
];

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface OrderTimelineProps {
  status: OrderStatus;
  createdAt: string; // ISO string
}

export default function OrderTimeline({ status, createdAt }: OrderTimelineProps) {
  if (status === "CANCELLED" || status === "REFUNDED") {
    return (
      <div className="rounded-lg border bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
        {status === "CANCELLED"
          ? "Este pedido foi cancelado."
          : "O reembolso deste pedido foi processado."}
      </div>
    );
  }

  return (
    <div className="py-2">
      {STEPS.map((step, index) => {
        const complete = step.isComplete(status);
        const isLast = index === STEPS.length - 1;
        const nextComplete = index < STEPS.length - 1 ? STEPS[index + 1].isComplete(status) : false;
        const Icon = step.icon;

        return (
          <div key={step.label} className="flex gap-4">
            {/* Left: icon + connector line */}
            <div className="flex flex-col items-center">
              <div
                className={`relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  complete
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-muted-foreground/30 bg-background text-muted-foreground/30"
                }`}
              >
                <Icon className="size-3.5" />
              </div>
              {!isLast && (
                <div
                  className={`mt-0.5 w-0.5 flex-1 min-h-[40px] transition-colors ${
                    complete && nextComplete ? "bg-violet-500" : "bg-muted"
                  }`}
                />
              )}
            </div>

            {/* Right: content */}
            <div className={`pb-8 ${isLast ? "pb-0" : ""}`}>
              <p
                className={`text-sm font-semibold ${
                  complete ? "text-foreground" : "text-muted-foreground/50"
                }`}
              >
                {step.label}
              </p>
              {complete && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {addDays(createdAt, step.daysOffset)}
                </p>
              )}
              <p
                className={`text-xs mt-0.5 ${
                  complete ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
