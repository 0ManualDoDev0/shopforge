import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: number;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  const isPositive = trend !== undefined && trend >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="size-4 text-muted-foreground shrink-0" />}
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold tabular-nums">{value}</p>

        {trend !== undefined && (
          <p
            className={cn(
              "flex items-center gap-1 text-xs mt-1.5 font-medium",
              isPositive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-red-600 dark:text-red-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {isPositive ? "+" : ""}
            {trend.toFixed(1)}% vs mês anterior
          </p>
        )}

        {description && trend === undefined && (
          <p className="text-xs text-muted-foreground mt-1.5">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
