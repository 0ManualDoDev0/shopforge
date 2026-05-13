import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatPrice, formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Clientes — Admin" };

export default async function CustomersPage() {
  const customers = await db.user.findMany({
    where: { role: "USER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      orders: {
        where: { isPaid: true },
        select: { total: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows = customers.map((c) => ({
    ...c,
    orderCount: c.orders.length,
    totalSpent: c.orders.reduce((sum, o) => sum + Number(o.total), 0),
  }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {rows.length} cliente{rows.length !== 1 ? "s" : ""} cadastrado
        {rows.length !== 1 ? "s" : ""}
      </p>

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">
                E-mail
              </th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">
                Cadastro
              </th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">
                Pedidos
              </th>
              <th className="px-4 py-3 text-right font-medium">Total Gasto</th>
            </tr>
          </thead>
          <tbody className="divide-y bg-card">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  Nenhum cliente cadastrado
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr
                  key={c.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase">
                        {(c.name ?? c.email ?? "U").charAt(0)}
                      </div>
                      <span className="max-w-[140px] truncate font-medium">
                        {c.name ?? "—"}
                      </span>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    <span className="max-w-[200px] truncate block">
                      {c.email}
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-muted-foreground md:table-cell">
                    {formatDate(c.createdAt)}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">
                    {c.orderCount}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatPrice(c.totalSpent)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
