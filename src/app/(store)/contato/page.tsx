import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import ContactForm from "@/components/store/ContactForm";

export const metadata: Metadata = {
  title: "Contato — ShopForge",
  description:
    "Entre em contato com a ShopForge. Estamos prontos para ajudar com dúvidas sobre pedidos, produtos, devoluções e muito mais.",
};

const contactInfo = [
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@shopforge.com.br",
    href: "mailto:contato@shopforge.com.br",
  },
  {
    icon: Phone,
    label: "Telefone",
    value: "(34) 3333-4444",
    href: "tel:+553433334444",
  },
  {
    icon: MapPin,
    label: "Endereço",
    value: "Av. Leopoldino de Oliveira, 1000\nUberaba — MG, CEP 38400-000",
    href: null,
  },
  {
    icon: Clock,
    label: "Horário de Atendimento",
    value: "Segunda a Sexta\n9h às 18h (exceto feriados)",
    href: null,
  },
];

export default function ContatoPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight">Fale Conosco</h1>
        <p className="mt-3 text-muted-foreground">
          Tem alguma dúvida, sugestão ou precisa de suporte? Nossa equipe está
          pronta para ajudar. Preencha o formulário ou use um de nossos canais
          de atendimento.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div>
          <h2 className="mb-6 text-lg font-semibold">Envie uma mensagem</h2>
          <ContactForm />
          <p className="mt-4 text-xs text-muted-foreground">
            Ao enviar este formulário, você concorda com nossa{" "}
            <a href="/privacidade" className="underline hover:text-foreground">
              Política de Privacidade
            </a>
            .
          </p>
        </div>

        {/* Contact info sidebar */}
        <aside>
          <div className="rounded-2xl border bg-card p-6 shadow-sm sticky top-24">
            <h2 className="mb-6 text-base font-semibold">Informações de Contato</h2>

            <div className="space-y-5">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-0.5">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium whitespace-pre-line">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <Separator className="my-6" />

            <div className="rounded-xl bg-violet-50 dark:bg-violet-900/20 p-4">
              <p className="text-xs font-semibold text-violet-700 dark:text-violet-300 mb-1">
                Tempo de resposta
              </p>
              <p className="text-xs text-muted-foreground">
                Respondemos e-mails e formulários em até{" "}
                <strong>1 dia útil</strong>. Para questões urgentes relacionadas
                a pedidos, ligue diretamente para nosso telefone.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
