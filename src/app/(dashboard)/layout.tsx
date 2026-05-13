import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const navLinks = [
  { href: "/dashboard", label: "Visão Geral" },
  { href: "/dashboard/products", label: "Produtos" },
  { href: "/dashboard/orders", label: "Pedidos" },
  { href: "/dashboard/customers", label: "Clientes" },
  { href: "/dashboard/settings", label: "Configurações" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 shrink-0 border-r bg-gray-50 p-4">
        <p className="mb-6 text-sm font-semibold text-gray-900">ShopForge Admin</p>
        <nav className="space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
