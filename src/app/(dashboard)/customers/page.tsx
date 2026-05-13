import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Clientes — Admin" };

export default async function CustomersPage() {
  const customers = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Clientes</h1>
      {/* TODO: CustomersTable */}
      <p className="text-gray-600">{customers.length} cliente(s) cadastrado(s)</p>
    </div>
  );
}
