import Link from "next/link";
import { Package } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const links = {
  Loja: [
    { href: "/products", label: "Produtos" },
    { href: "/cart", label: "Carrinho" },
    { href: "/orders", label: "Meus Pedidos" },
  ],
  Empresa: [
    { href: "#", label: "Sobre nós" },
    { href: "#", label: "Blog" },
    { href: "#", label: "Contato" },
  ],
  Legal: [
    { href: "#", label: "Termos de Uso" },
    { href: "#", label: "Privacidade" },
    { href: "#", label: "Cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <Package className="size-5" />
              ShopForge
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              A melhor plataforma de e-commerce para o seu negócio crescer.
            </p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-semibold text-sm mb-3">{title}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} ShopForge. Todos os direitos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Feito com Next.js, Tailwind CSS e Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}
