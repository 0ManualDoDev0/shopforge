import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Blog — ShopForge",
  description:
    "Dicas, tendências e novidades do universo do e-commerce, moda, tecnologia e estilo de vida. Conteúdo pensado para ajudar você a comprar melhor.",
};

const articles = [
  {
    slug: "tendencias-moda-2025",
    category: "Moda",
    categoryColor: "bg-rose-500",
    date: "10 de maio de 2025",
    readTime: "5 min de leitura",
    title: "Tendências de Moda 2025: O que vai bombar nas próximas estações",
    excerpt:
      "Das paletas terrosas ao minimalismo colorido, descubra as principais tendências que vão dominar os guarda-roupas neste ano e como incorporá-las ao seu estilo sem gastar muito.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=380&fit=crop&auto=format&q=80",
  },
  {
    slug: "guia-completo-eletronicos",
    category: "Eletrônicos",
    categoryColor: "bg-blue-500",
    date: "28 de abril de 2025",
    readTime: "8 min de leitura",
    title: "Guia Completo para Escolher Eletrônicos: Não caia em armadilhas",
    excerpt:
      "Processador, memória RAM, resolução de tela... com tantas especificações técnicas, escolher um eletrônico pode ser difícil. Nosso guia simplifica tudo para você tomar a melhor decisão.",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=380&fit=crop&auto=format&q=80",
  },
  {
    slug: "como-escolher-acessorios",
    category: "Acessórios",
    categoryColor: "bg-amber-500",
    date: "15 de abril de 2025",
    readTime: "4 min de leitura",
    title: "Como Escolher Acessórios que Valorizam seu Look",
    excerpt:
      "Um bom acessório pode transformar um visual simples em algo memorável. Aprenda a harmonizar cores, materiais e estilos para criar combinações impecáveis no dia a dia.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=380&fit=crop&auto=format&q=80",
  },
  {
    slug: "dicas-compra-online-segura",
    category: "Compras",
    categoryColor: "bg-emerald-500",
    date: "3 de abril de 2025",
    readTime: "6 min de leitura",
    title: "10 Dicas para Comprar Online com Segurança e Economia",
    excerpt:
      "Saiba como identificar lojas confiáveis, evitar golpes, aproveitar cupons de desconto e proteger seus dados pessoais em cada compra que você fizer pela internet.",
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=380&fit=crop&auto=format&q=80",
  },
  {
    slug: "sustentabilidade-no-ecommerce",
    category: "Sustentabilidade",
    categoryColor: "bg-teal-500",
    date: "20 de março de 2025",
    readTime: "7 min de leitura",
    title: "Sustentabilidade no E-commerce: O Consumo Consciente em Alta",
    excerpt:
      "O consumidor brasileiro está cada vez mais atento ao impacto ambiental de suas compras. Veja como pequenas escolhas na hora de comprar online podem fazer uma grande diferença para o planeta.",
    image:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=380&fit=crop&auto=format&q=80",
  },
  {
    slug: "tecnologia-e-estilo-de-vida",
    category: "Tecnologia",
    categoryColor: "bg-purple-500",
    date: "8 de março de 2025",
    readTime: "5 min de leitura",
    title: "Tecnologia e Estilo de Vida: Como os Gadgets Estão Mudando nossa Rotina",
    excerpt:
      "Smartwatches, fones sem fio, carregadores portáteis... a tecnologia invadiu nosso dia a dia de um jeito que não dá para mais imaginar sem. Conheça os dispositivos que estão redefinindo o bem-estar.",
    image:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=380&fit=crop&auto=format&q=80",
  },
];

export default function BlogPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 max-w-2xl">
        <Badge variant="secondary" className="mb-3">
          Blog ShopForge
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          Dicas, tendências e novidades
        </h1>
        <p className="mt-4 text-muted-foreground text-base">
          Conteúdo pensado para ajudar você a comprar melhor, se vestir bem e
          viver com mais qualidade.
        </p>
      </div>

      <Separator className="mb-12" />

      {/* Article grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article.slug}
            className="group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[16/10]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                className={`absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white ${article.categoryColor}`}
              >
                {article.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {article.readTime}
                </span>
              </div>

              <h2 className="mb-2 text-base font-bold leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                {article.title}
              </h2>

              <p className="flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {article.excerpt}
              </p>

              <Link
                href={`/blog/${article.slug}`}
                className="mt-4 text-sm font-medium text-violet-600 dark:text-violet-400 hover:underline underline-offset-2"
              >
                Ler artigo completo →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div className="mt-20 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-12 text-center text-white">
        <Tag className="mx-auto mb-4 size-8 opacity-80" />
        <h2 className="text-xl font-bold md:text-2xl">
          Receba novidades no seu e-mail
        </h2>
        <p className="mt-2 text-sm text-white/70 max-w-md mx-auto">
          Assine nossa newsletter e fique por dentro das melhores ofertas e
          conteúdos do blog ShopForge.
        </p>
        <Link
          href="/#newsletter"
          className="mt-6 inline-block rounded-lg bg-white px-6 py-2.5 text-sm font-semibold text-violet-700 hover:bg-white/90 transition-colors"
        >
          Assinar newsletter
        </Link>
      </div>
    </main>
  );
}
