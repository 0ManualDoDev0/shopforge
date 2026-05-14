"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ShoppingCart,
  Menu,
  Package,
  LogOut,
  ShoppingBag,
  User,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import CartDrawer from "@/components/store/CartDrawer";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/products", label: "Produtos" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const userRole = (session?.user as { role?: string } | undefined)?.role;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
      setSearchQuery("");
      searchRef.current?.blur();
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-lg shrink-0"
          >
            <Package className="size-5" />
            <span>ShopForge</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-sm items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5 transition-colors focus-within:border-primary focus-within:bg-background"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={searchRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar produtos..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />

            {/* Cart button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
              aria-label={`Carrinho (${itemCount} itens)`}
            >
              <ShoppingCart className="size-4" />
              {itemCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 rounded-full px-1 py-0 text-[10px] leading-none flex items-center justify-center">
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
            </Button>

            {/* Auth section */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "relative rounded-full outline-none",
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  )}
                  aria-label="Menu do usuário"
                >
                  <Avatar className="size-8">
                    <AvatarImage
                      src={session.user.image ?? ""}
                      alt={session.user.name ?? "Usuário"}
                    />
                    <AvatarFallback className="text-xs">
                      {session.user.name?.slice(0, 2).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-medium truncate">{session.user.name}</p>
                    <p className="text-xs font-normal text-muted-foreground truncate">
                      {session.user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/orders" className="flex items-center gap-2 w-full">
                      <ShoppingBag className="size-4" />
                      Meus Pedidos
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "ADMIN" && (
                    <DropdownMenuItem>
                      <Link href="/dashboard" className="flex items-center gap-2 w-full">
                        <User className="size-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="size-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                render={<Link href="/login" />}
                className="hidden sm:inline-flex"
              >
                Entrar
              </Button>
            )}

            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="size-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="p-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Package className="size-5" />
              ShopForge
            </SheetTitle>
          </SheetHeader>

          {/* Mobile search */}
          <div className="px-4 pb-4">
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </form>
          </div>

          <nav className="flex flex-col px-4 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!session?.user && (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-accent transition-colors"
              >
                Entrar
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
