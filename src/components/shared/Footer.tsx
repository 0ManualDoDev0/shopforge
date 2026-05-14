import Link from "next/link";
import { Package, Mail, Phone, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const links = {
  Loja: [
    { href: "/products", label: "Produtos" },
    { href: "/cart", label: "Carrinho" },
    { href: "/orders", label: "Meus Pedidos" },
    { href: "/search", label: "Buscar Produtos" },
  ],
  Empresa: [
    { href: "/sobre", label: "Sobre Nós" },
    { href: "/blog", label: "Blog" },
    { href: "/contato", label: "Contato" },
  ],
  Legal: [
    { href: "/termos", label: "Termos de Uso" },
    { href: "/privacidade", label: "Privacidade" },
    { href: "/cookies", label: "Cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <Package className="size-5" />
              ShopForge
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-5">
              A plataforma de e-commerce moderna para você comprar com segurança,
              transparência e os melhores preços. Uberaba — MG.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:contato@shopforge.com.br"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-3.5 shrink-0" />
                contato@shopforge.com.br
              </a>
              <a
                href="tel:+553433334444"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="size-3.5 shrink-0" />
                (34) 3333-4444
              </a>
              <span className="flex items-start gap-2 text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0 mt-0.5" />
                Av. Leopoldino de Oliveira, 1000 — Uberaba, MG
              </span>
            </div>
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
            © {new Date().getFullYear()} ShopForge Ltda — CNPJ 00.000.000/0001-00.
            Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/termos" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Termos
            </Link>
            <Link href="/privacidade" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
