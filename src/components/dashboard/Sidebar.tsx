"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  Package2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navLinks = [
  { href: "/dashboard", label: "Visão Geral", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/products", label: "Produtos", icon: Package },
  { href: "/dashboard/orders", label: "Pedidos", icon: ShoppingBag },
  { href: "/dashboard/customers", label: "Clientes", icon: Users },
  { href: "/dashboard/settings", label: "Configurações", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <aside
      className={cn(
        "relative flex flex-col border-r bg-card transition-all duration-300 shrink-0",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b h-16 px-4 gap-2",
          collapsed && "justify-center"
        )}
      >
        <Package2 className="size-5 shrink-0 text-primary" />
        {!collapsed && (
          <span className="font-bold text-sm truncate">ShopForge Admin</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                collapsed && "justify-center px-2"
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 border-t">
        <Button
          variant="ghost"
          size="icon-sm"
          className="w-full"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="size-4" />
          ) : (
            <ChevronLeft className="size-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
