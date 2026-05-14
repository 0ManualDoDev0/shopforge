import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — ShopForge",
  description:
    "Política de Privacidade da ShopForge conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).",
};

const lastUpdate = "14 de maio de 2025";

export default function PrivacidadePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Política de Privacidade
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última atualização: {lastUpdate} — Em conformidade com a{" "}
            <strong>Lei nº 13.709/2018 (LGPD)</strong>
          </p>
        </div>

        <div className="space-y-10 text-sm leading-relaxed">

          <p className="text-base text-muted-foreground">
            A <strong>ShopForge Ltda</strong>, empresa com sede em Uberaba — MG,
            inscrita no CNPJ sob o nº <strong>00.000.000/0001-00</strong>, é
            comprometida com a proteção dos dados pessoais de seus clientes,
            colaboradores e visitantes. Esta Política de Privacidade descreve como
            coletamos, usamos, armazenamos e protegemos seus dados, em conformidade
            com a Lei Geral de Proteção de Dados Pessoais (LGPD).
          </p>

          {/* Controlador e DPO */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              1. Identificação do Controlador e do DPO
            </h2>
            <div className="rounded-xl border bg-muted/30 p-5 space-y-3">
              <div>
                <p className="font-semibold">Controlador de Dados</p>
                <p className="text-muted-foreground">
                  ShopForge Ltda — CNPJ 00.000.000/0001-00
                  <br />
                  Av. Leopoldino de Oliveira, 1000 — Uberaba, MG — CEP 38400-000
                  <br />
                  E-mail:{" "}
                  <a
                    href="mailto:contato@shopforge.com.br"
                    className="text-violet-600 hover:underline dark:text-violet-400"
                  >
                    contato@shopforge.com.br
                  </a>
                </p>
              </div>
              <div>
                <p className="font-semibold">
                  Encarregado de Proteção de Dados (DPO)
                </p>
                <p className="text-muted-foreground">
                  E-mail:{" "}
                  <a
                    href="mailto:dpo@shopforge.com.br"
                    className="text-violet-600 hover:underline dark:text-violet-400"
                  >
                    dpo@shopforge.com.br
                  </a>
                  <br />
                  Horário de atendimento: Segunda a Sexta, 9h às 18h
                </p>
              </div>
            </div>
          </section>

          {/* Dados coletados */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              2. Dados Pessoais Coletados
            </h2>
            <p>Coletamos os seguintes dados pessoais ao longo da sua interação com a plataforma:</p>

            <div className="mt-4 overflow-hidden rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Dado</th>
                    <th className="px-4 py-3 text-left font-semibold">Como é coletado</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Nome completo", "Formulário de cadastro"],
                    ["Endereço de e-mail", "Formulário de cadastro e login"],
                    ["Senha (hash bcrypt)", "Formulário de cadastro"],
                    ["Endereço de entrega", "Formulário de checkout"],
                    ["Dados de pagamento", "Processados exclusivamente pela Stripe — não armazenados por nós"],
                    ["Histórico de pedidos", "Gerado automaticamente ao realizar compras"],
                    ["Endereço IP e dados de navegação", "Coletados automaticamente via cookies e logs de servidor"],
                    ["Foto de perfil (opcional)", "Login social via Google OAuth"],
                  ].map(([dado, como], i) => (
                    <tr key={dado} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="px-4 py-2.5 font-medium">{dado}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{como}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Finalidade */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              3. Finalidade do Tratamento
            </h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Execução do contrato de compra e venda:</strong> processar
                pedidos, gerir pagamentos, organizar entregas e emitir notas fiscais;
              </li>
              <li>
                <strong>Autenticação e segurança:</strong> verificar a identidade
                do usuário, proteger a conta e prevenir fraudes;
              </li>
              <li>
                <strong>Comunicações transacionais:</strong> enviar confirmações de
                pedido, atualizações de entrega e respostas a solicitações;
              </li>
              <li>
                <strong>Marketing (com consentimento):</strong> enviar newsletters,
                promoções e novidades — somente para quem optar por receber;
              </li>
              <li>
                <strong>Melhoria da plataforma:</strong> analisar métricas de uso
                para aprimorar funcionalidades e desempenho;
              </li>
              <li>
                <strong>Cumprimento de obrigações legais:</strong> atender
                requisições de autoridades competentes conforme a legislação.
              </li>
            </ul>
          </section>

          {/* Base Legal */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              4. Base Legal para o Tratamento (art. 7º da LGPD)
            </h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Execução de contrato</strong> (art. 7º, V): dados
                necessários para processar pedidos e entregas;
              </li>
              <li>
                <strong>Consentimento</strong> (art. 7º, I): para envio de
                comunicações de marketing e uso de cookies não essenciais — o
                consentimento pode ser revogado a qualquer momento;
              </li>
              <li>
                <strong>Legítimo interesse</strong> (art. 7º, IX): para prevenção
                de fraudes, segurança da plataforma e melhorias no serviço,
                respeitando os direitos e expectativas do titular;
              </li>
              <li>
                <strong>Cumprimento de obrigação legal</strong> (art. 7º, II):
                para atender exigências fiscais, tributárias e regulatórias.
              </li>
            </ul>
          </section>

          {/* Compartilhamento */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              5. Compartilhamento de Dados
            </h2>
            <p>
              A ShopForge não vende nem aluga seus dados pessoais a terceiros.
              O compartilhamento ocorre apenas com os parceiros estritamente
              necessários para a operação do serviço:
            </p>

            <div className="mt-4 overflow-hidden rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-muted/60">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Parceiro</th>
                    <th className="px-4 py-3 text-left font-semibold">Finalidade</th>
                    <th className="px-4 py-3 text-left font-semibold">País</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Stripe Inc.", "Processamento seguro de pagamentos (PCI-DSS Nível 1)", "EUA"],
                    ["Vercel Inc.", "Hospedagem e entrega da aplicação web (CDN)", "EUA"],
                    ["Neon (Neondatabase)", "Armazenamento do banco de dados PostgreSQL em nuvem", "EUA"],
                    ["Google LLC", "Autenticação social via Google OAuth", "EUA"],
                    ["Resend Inc.", "Envio de e-mails transacionais (confirmação, boas-vindas)", "EUA"],
                  ].map(([parceiro, finalidade, pais], i) => (
                    <tr key={parceiro} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="px-4 py-2.5 font-medium">{parceiro}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{finalidade}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{pais}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Transferência Internacional */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              6. Transferência Internacional de Dados
            </h2>
            <p>
              Como indicado na tabela acima, alguns parceiros estão localizados
              nos Estados Unidos. Realizamos essas transferências com base nas
              seguintes salvaguardas, conforme art. 33 da LGPD:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>
                Os parceiros são certificados em frameworks internacionais de
                segurança (SOC 2, ISO 27001, PCI-DSS);
              </li>
              <li>
                Adotamos contratos com cláusulas específicas de proteção de dados;
              </li>
              <li>
                Apenas dados estritamente necessários são transferidos, observando
                o princípio da minimização.
              </li>
            </ul>
          </section>

          {/* Segurança */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              7. Medidas de Segurança
            </h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados
              contra acesso não autorizado, alteração, divulgação ou destruição:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>
                <strong>Senhas criptografadas com bcrypt</strong> — as senhas
                nunca são armazenadas em texto puro;
              </li>
              <li>
                <strong>HTTPS / TLS</strong> — toda comunicação entre o navegador
                e nossos servidores é cifrada;
              </li>
              <li>
                <strong>Tokens JWT com expiração</strong> — sessões autenticadas
                com expiração automática;
              </li>
              <li>
                <strong>Rate limiting</strong> — proteção contra ataques de força
                bruta nas rotas de autenticação;
              </li>
              <li>
                <strong>Dados de pagamento não armazenados</strong> — toda
                transação financeira é processada diretamente pela Stripe.
              </li>
            </ul>
            <p className="mt-3">
              Em caso de incidente de segurança que possa afetar seus dados,
              notificaremos a Autoridade Nacional de Proteção de Dados (ANPD) e
              os titulares afetados dentro dos prazos previstos na LGPD.
            </p>
          </section>

          {/* Direitos do titular */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              8. Direitos do Titular (art. 18 da LGPD)
            </h2>
            <p>
              Como titular de dados pessoais, você possui os seguintes direitos,
              que podem ser exercidos a qualquer momento:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-2">
              <li>
                <strong>Acesso:</strong> confirmar se tratamos seus dados e
                solicitar cópia;
              </li>
              <li>
                <strong>Correção:</strong> solicitar a atualização de dados
                incompletos, inexatos ou desatualizados;
              </li>
              <li>
                <strong>Exclusão:</strong> solicitar a eliminação de dados
                tratados com base no consentimento;
              </li>
              <li>
                <strong>Portabilidade:</strong> solicitar a transferência dos seus
                dados a outro fornecedor;
              </li>
              <li>
                <strong>Revogação do consentimento:</strong> retirar o
                consentimento para tratamentos baseados nessa base legal;
              </li>
              <li>
                <strong>Oposição:</strong> opor-se a tratamentos realizados com
                base em legítimo interesse;
              </li>
              <li>
                <strong>Informação:</strong> obter informações sobre entidades
                públicas e privadas com as quais compartilhamos dados.
              </li>
            </ul>
          </section>

          {/* Prazo de retenção */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              9. Prazo de Retenção de Dados
            </h2>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Dados de conta ativa:</strong> mantidos enquanto a conta
                estiver ativa;
              </li>
              <li>
                <strong>Dados de pedidos:</strong> mantidos por 5 anos após a
                compra, conforme exigência fiscal;
              </li>
              <li>
                <strong>Dados para fins de marketing:</strong> mantidos até a
                revogação do consentimento;
              </li>
              <li>
                <strong>Logs de segurança:</strong> mantidos por até 6 meses,
                conforme o Marco Civil da Internet (Lei 12.965/2014).
              </li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              10. Cookies
            </h2>
            <p>
              Utilizamos cookies e tecnologias similares para garantir o
              funcionamento da plataforma, personalizar sua experiência e analisar
              o tráfego. Você pode consultar os detalhes completos em nossa{" "}
              <Link href="/cookies" className="text-violet-600 hover:underline dark:text-violet-400">
                Política de Cookies
              </Link>
              .
            </p>
          </section>

          {/* Como exercer direitos */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              11. Como Exercer Seus Direitos
            </h2>
            <p>
              Para exercer qualquer um dos direitos listados acima, entre em contato
              com nosso DPO:
            </p>
            <div className="mt-4 rounded-xl border bg-muted/30 p-5">
              <p className="font-semibold mb-1">Encarregado de Proteção de Dados (DPO)</p>
              <p className="text-muted-foreground">
                E-mail:{" "}
                <a
                  href="mailto:dpo@shopforge.com.br"
                  className="text-violet-600 hover:underline dark:text-violet-400"
                >
                  dpo@shopforge.com.br
                </a>
                <br />
                Prazo de resposta: até <strong>15 dias úteis</strong> a partir
                do recebimento da solicitação, conforme art. 19 da LGPD.
              </p>
            </div>
            <p className="mt-3">
              Se não estiver satisfeito com nossa resposta, você tem o direito de
              reclamar junto à{" "}
              <a
                href="https://www.gov.br/anpd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-600 hover:underline dark:text-violet-400"
              >
                Autoridade Nacional de Proteção de Dados (ANPD)
              </a>
              .
            </p>
          </section>

          {/* Footer note */}
          <div className="rounded-xl border bg-muted/30 p-5">
            <p className="text-xs text-muted-foreground">
              Esta Política de Privacidade foi elaborada em conformidade com a{" "}
              <strong>Lei nº 13.709/2018 (LGPD)</strong>, o{" "}
              <strong>Decreto nº 8.771/2016</strong> e as orientações da ANPD.
              Em caso de conflito, prevalece a legislação vigente. Última
              atualização: {lastUpdate}.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
