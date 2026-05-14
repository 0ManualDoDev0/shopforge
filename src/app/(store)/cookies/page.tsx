import type { Metadata } from "next";
import Link from "next/link";
import { Cookie, Shield, Settings } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de Cookies — ShopForge",
  description:
    "Saiba como a ShopForge utiliza cookies e tecnologias similares para garantir o funcionamento e melhorar sua experiência na plataforma.",
};

const lastUpdate = "14 de maio de 2025";

const cookies = {
  essenciais: [
    {
      nome: "next-auth.session-token",
      finalidade: "Autenticação — mantém a sessão do usuário logado",
      duração: "30 dias",
      terceiro: "Não",
    },
    {
      nome: "next-auth.csrf-token",
      finalidade: "Segurança — previne ataques CSRF (Cross-Site Request Forgery)",
      duração: "Sessão",
      terceiro: "Não",
    },
    {
      nome: "next-auth.callback-url",
      finalidade: "Autenticação — armazena URL de redirecionamento após login",
      duração: "Sessão",
      terceiro: "Não",
    },
    {
      nome: "__Host-next-auth.csrf-token",
      finalidade: "Segurança adicional em ambientes HTTPS",
      duração: "Sessão",
      terceiro: "Não",
    },
  ],
  funcionais: [
    {
      nome: "shopforge-cart",
      finalidade: "Persistência do carrinho de compras (localStorage)",
      duração: "Indefinida",
      terceiro: "Não",
    },
    {
      nome: "theme",
      finalidade: "Preferência de tema claro ou escuro da interface",
      duração: "1 ano",
      terceiro: "Não",
    },
  ],
};

export default function CookiesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Política de Cookies
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última atualização: {lastUpdate}
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">

          {/* Intro */}
          <p className="text-base text-muted-foreground">
            A ShopForge utiliza cookies e tecnologias similares (como localStorage)
            para garantir o funcionamento adequado da plataforma, personalizar
            sua experiência e melhorar continuamente nossos serviços. Esta política
            explica quais cookies utilizamos, para quê e como você pode gerenciá-los.
          </p>

          {/* O que são cookies */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              1. O que são Cookies?
            </h2>
            <p>
              Cookies são pequenos arquivos de texto que os sites armazenam no
              seu navegador. Eles permitem que a plataforma reconheça seu dispositivo
              em visitas subsequentes, mantenha você logado e lembre suas
              preferências.
            </p>
            <p className="mt-3">
              Além de cookies no navegador, utilizamos o <strong>localStorage</strong>{" "}
              — uma tecnologia similar que permite armazenar dados localmente no
              dispositivo, como o conteúdo do seu carrinho de compras.
            </p>
          </section>

          {/* Categorias */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              2. Categorias de Cookies Utilizados
            </h2>

            {/* Essenciais */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                  <Shield className="size-4 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-bold">Cookies Essenciais</h3>
                  <p className="text-xs text-muted-foreground">
                    Necessários para o funcionamento básico — não podem ser desativados
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-xs min-w-[500px]">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Cookie</th>
                      <th className="px-4 py-3 text-left font-semibold">Finalidade</th>
                      <th className="px-4 py-3 text-left font-semibold">Duração</th>
                      <th className="px-4 py-3 text-left font-semibold">Terceiro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookies.essenciais.map((c, i) => (
                      <tr key={c.nome} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="px-4 py-2.5 font-mono font-medium text-[11px] break-all">{c.nome}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{c.finalidade}</td>
                        <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{c.duração}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{c.terceiro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Funcionais */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Settings className="size-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold">Cookies Funcionais</h3>
                  <p className="text-xs text-muted-foreground">
                    Melhoram a experiência, mas não são estritamente necessários
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full text-xs min-w-[500px]">
                  <thead className="bg-muted/60">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Cookie / Storage</th>
                      <th className="px-4 py-3 text-left font-semibold">Finalidade</th>
                      <th className="px-4 py-3 text-left font-semibold">Duração</th>
                      <th className="px-4 py-3 text-left font-semibold">Terceiro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookies.funcionais.map((c, i) => (
                      <tr key={c.nome} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                        <td className="px-4 py-2.5 font-mono font-medium text-[11px] break-all">{c.nome}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{c.finalidade}</td>
                        <td className="px-4 py-2.5 text-muted-foreground whitespace-nowrap">{c.duração}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{c.terceiro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Cookies de terceiros */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              3. Cookies de Terceiros
            </h2>
            <p>
              Atualmente, <strong>não utilizamos cookies de rastreamento</strong>{" "}
              de terceiros para fins publicitários ou de analytics. Não há pixels
              do Facebook, Google Analytics ou quaisquer scripts de rastreamento
              comportamental em nossa plataforma.
            </p>
            <p className="mt-3">
              Caso venha a implementar ferramentas de analytics no futuro, esta
              política será atualizada e você será notificado com antecedência,
              conforme a LGPD.
            </p>
          </section>

          {/* Como gerenciar */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              4. Como Gerenciar seus Cookies
            </h2>
            <p>
              Você pode gerenciar e excluir cookies diretamente pelo seu navegador.
              Veja como fazer isso nos principais navegadores:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1.5">
              <li>
                <strong>Google Chrome:</strong> Configurações → Privacidade e
                segurança → Cookies e outros dados do site
              </li>
              <li>
                <strong>Mozilla Firefox:</strong> Configurações → Privacidade e
                segurança → Cookies e dados de sites
              </li>
              <li>
                <strong>Safari:</strong> Preferências → Privacidade → Gerenciar
                dados de sites
              </li>
              <li>
                <strong>Microsoft Edge:</strong> Configurações → Privacidade,
                pesquisa e serviços → Cookies
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/20 p-4">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                <strong>Atenção:</strong> A desativação dos cookies essenciais
                pode impedir o funcionamento correto da plataforma — você pode
                perder o acesso à sua conta e ao carrinho de compras.
              </p>
            </div>
          </section>

          {/* localStorage */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              5. LocalStorage
            </h2>
            <p>
              O carrinho de compras (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">shopforge-cart</code>)
              é armazenado no <strong>localStorage</strong> do seu navegador,
              não em cookies. Para limpar esses dados:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>No Chrome/Edge: F12 → Application → Local Storage → Limpar</li>
              <li>No Firefox: F12 → Storage → Local Storage → Limpar</li>
              <li>
                Ou limpe todo o histórico de navegação (isso removerá todos os
                dados locais de todos os sites)
              </li>
            </ul>
          </section>

          {/* Links */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              6. Mais Informações
            </h2>
            <p>
              Para saber mais sobre como tratamos seus dados pessoais, consulte
              nossa{" "}
              <Link
                href="/privacidade"
                className="text-violet-600 hover:underline dark:text-violet-400"
              >
                Política de Privacidade
              </Link>
              . Em caso de dúvidas, entre em contato com nosso DPO pelo e-mail{" "}
              <a
                href="mailto:dpo@shopforge.com.br"
                className="text-violet-600 hover:underline dark:text-violet-400"
              >
                dpo@shopforge.com.br
              </a>
              .
            </p>
          </section>

          {/* Footer note */}
          <div className="flex gap-3 rounded-xl border bg-muted/30 p-5">
            <Cookie className="size-5 shrink-0 text-muted-foreground mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Esta Política de Cookies é parte integrante da{" "}
              <Link href="/privacidade" className="text-violet-600 hover:underline dark:text-violet-400">
                Política de Privacidade
              </Link>{" "}
              da ShopForge e foi elaborada em conformidade com a{" "}
              <strong>Lei nº 13.709/2018 (LGPD)</strong> e as diretrizes da
              Autoridade Nacional de Proteção de Dados (ANPD). Última atualização:{" "}
              {lastUpdate}.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
