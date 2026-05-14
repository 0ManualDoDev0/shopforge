import Link from "next/link";
import { PackageSearch, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-muted">
        <PackageSearch className="size-12 text-muted-foreground" />
      </div>

      <h1 className="text-4xl font-bold tracking-tight">Página não encontrada</h1>
      <p className="mt-3 max-w-sm text-muted-foreground">
        A página que você está procurando não existe ou foi movida para outro
        endereço.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" render={<Link href="/" />}>
          <Home className="mr-2 size-4" />
          Voltar para Loja
        </Button>
        <Button render={<Link href="/products" />}>
          <ShoppingBag className="mr-2 size-4" />
          Ver Produtos
        </Button>
      </div>
    </main>
  );
}
