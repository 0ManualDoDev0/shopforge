import type { Metadata } from "next";
import Link from "next/link";
import {
  Target,
  Eye,
  Heart,
  Lightbulb,
  ShieldCheck,
  Package,
  Tag,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Sobre Nós — ShopForge",
  description:
    "Conheça a história da ShopForge, nossa missão de democratizar o acesso a produtos de qualidade e os valores que guiam nossa equipe em Uberaba, MG.",
};

const stats = [
  { value: "12+", label: "Produtos", icon: Package },
  { value: "3", label: "Categorias", icon: Tag },
  { value: "100%", label: "Satisfação", icon: Star },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Transparência",
    description:
      "Acreditamos que a confiança se constrói com honestidade. Preços claros, sem taxas escondidas e comunicação direta com nossos clientes.",
  },
  {
    icon: Lightbulb,
    title: "Inovação",
    description:
      "Buscamos constantemente novas tecnologias e soluções para oferecer a melhor experiência de compra online possível.",
  },
  {
    icon: Heart,
    title: "Confiança",
    description:
      "Cada produto é selecionado com cuidado. Garantimos qualidade, segurança nas transações e suporte pós-venda dedicado.",
  },
];

const team = [
  {
    name: "Mariana Oliveira",
    role: "CEO & Fundadora",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format&q=80",
    bio: "Com 10 anos de experiência em varejo digital, Mariana fundou a ShopForge para aproximar consumidores brasileiros de produtos de qualidade.",
  },
  {
    name: "Rafael Mendes",
    role: "CTO",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format&q=80",
    bio: "Engenheiro de software apaixonado por e-commerce. Lidera o desenvolvimento da plataforma com foco em performance e segurança.",
  },
  {
    name: "Camila Santos",
    role: "Diretora de Marketing",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format&q=80",
    bio: "Especialista em marketing digital e comportamento do consumidor. Responsável por conectar a ShopForge ao seu público.",
  },
];

export default function SobrePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 py-24">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium tracking-widest text-white/80 uppercase mb-6">
            Nossa história
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            Construindo o futuro do{" "}
            <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
              e-commerce brasileiro
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/60 md:text-lg">
            Nascemos em Uberaba, MG, com uma missão simples: democratizar o acesso
            a produtos de qualidade para todo o Brasil.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto text-center">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex size-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                  <Icon className="size-5 text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-3xl font-extrabold">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* História */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-6">Nossa História</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A ShopForge nasceu em 2024 na cidade de Uberaba, Minas Gerais, com uma
                visão clara: tornar o e-commerce mais acessível, seguro e humano para
                consumidores brasileiros. Fundada por Mariana Oliveira após anos
                trabalhando em grandes varejistas do país, a empresa surgiu da percepção
                de que o mercado precisava de uma alternativa que colocasse o cliente
                genuinamente no centro.
              </p>
              <p>
                Começamos com um catálogo enxuto e uma equipe pequena, mas com uma
                proposta de valor sólida: curadoria cuidadosa de produtos, preços
                transparentes e uma experiência de compra fluida do início ao fim.
                Em pouco tempo, conquistamos a confiança dos nossos primeiros clientes
                no Triângulo Mineiro e, gradativamente, expandimos nossa presença para
                todo o Brasil.
              </p>
              <p>
                Hoje, a ShopForge é uma plataforma moderna construída com as mais
                recentes tecnologias — Next.js, Stripe e banco de dados em nuvem —
                pronta para crescer junto com seus clientes e parceiros. Continuamos
                sendo a mesma empresa com os mesmos valores, agora com mais
                capacidade e alcance.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Missão, Visão e Valores */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl mb-14 text-center">
            <h2 className="text-2xl font-bold">Missão, Visão e Valores</h2>
            <p className="mt-3 text-muted-foreground">
              Os pilares que orientam cada decisão e cada produto que colocamos
              à venda.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2 mb-14">
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30 mb-4">
                <Target className="size-6 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">Missão</h3>
              <p className="text-muted-foreground leading-relaxed">
                Democratizar o acesso a produtos de qualidade, oferecendo uma
                experiência de compra online segura, transparente e acessível para
                todos os brasileiros, independentemente de onde estejam.
              </p>
            </div>
            <div className="rounded-2xl border bg-card p-8 shadow-sm">
              <div className="flex size-12 items-center justify-center rounded-xl bg-pink-100 dark:bg-pink-900/30 mb-4">
                <Eye className="size-6 text-pink-600 dark:text-pink-400" />
              </div>
              <h3 className="text-lg font-bold mb-3">Visão</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ser reconhecida como a plataforma de e-commerce mais confiável e
                inovadora do Brasil, referência em experiência do cliente e
                responsabilidade com o consumidor.
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted mb-4">
                  <Icon className="size-5 text-foreground" />
                </div>
                <h3 className="font-bold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Equipe */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl mb-14 text-center">
            <h2 className="text-2xl font-bold">Nossa Equipe</h2>
            <p className="mt-3 text-muted-foreground">
              Pessoas apaixonadas por tecnologia e pelo cliente, trabalhando
              juntas para construir algo especial.
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-8 sm:grid-cols-3">
            {team.map(({ name, role, photo, bio }) => (
              <div key={name} className="flex flex-col items-center text-center">
                <img
                  src={photo}
                  alt={name}
                  className="mb-4 size-28 rounded-full object-cover ring-4 ring-muted"
                />
                <h3 className="font-bold">{name}</h3>
                <p className="text-sm text-violet-600 dark:text-violet-400 font-medium mb-2">
                  {role}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted/30 border-t">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Vamos crescer juntos?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Conheça nosso catálogo e descubra por que milhares de clientes confiam
            na ShopForge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" render={<Link href="/products" />}>
              Ver Produtos
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/contato" />}>
              Fale Conosco
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
