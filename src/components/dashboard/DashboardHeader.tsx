"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PAGE_NAMES: Record<string, string> = {
  "/dashboard": "Visão Geral",
  "/dashboard/products": "Produtos",
  "/dashboard/products/new": "Novo Produto",
  "/dashboard/orders": "Pedidos",
  "/dashboard/customers": "Clientes",
  "/dashboard/settings": "Configurações",
};

function resolvePageName(pathname: string): string {
  if (PAGE_NAMES[pathname]) return PAGE_NAMES[pathname];
  if (
    pathname.startsWith("/dashboard/products/") &&
    pathname !== "/dashboard/products/new"
  ) {
    return "Editar Produto";
  }
  return "Dashboard";
}

export default function DashboardHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-6">
      <h1 className="text-lg font-semibold">{resolvePageName(pathname)}</h1>

      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
          <Avatar className="size-8">
            <AvatarImage
              src={session?.user?.image ?? ""}
              alt={session?.user?.name ?? "Admin"}
            />
            <AvatarFallback className="text-xs">
              {session?.user?.name?.slice(0, 2).toUpperCase() ?? "AD"}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>
            <p className="font-medium truncate">{session?.user?.name ?? "Admin"}</p>
            <p className="text-xs font-normal text-muted-foreground truncate">
              {session?.user?.email}
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-2 size-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
