"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface TopProductItem {
  name: string;
  quantity: number;
}

const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#d946ef"];

export default function TopProductsChart({
  data,
}: {
  data: TopProductItem[];
}) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Nenhum dado disponível
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="quantity"
          nameKey="name"
          cx="50%"
          cy="45%"
          outerRadius={80}
          label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: unknown) => [Number(value ?? 0), "Vendidos"]}
          contentStyle={{
            borderRadius: "8px",
            border: "1px solid hsl(var(--border))",
            backgroundColor: "hsl(var(--card))",
            color: "hsl(var(--card-foreground))",
            fontSize: "13px",
          }}
        />
        <Legend
          formatter={(value) =>
            value.length > 18 ? value.slice(0, 18) + "…" : value
          }
          wrapperStyle={{ fontSize: "12px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
