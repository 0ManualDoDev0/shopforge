import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso — ShopForge",
  description:
    "Termos de Uso da ShopForge. Leia atentamente antes de utilizar nossa plataforma.",
};

const lastUpdate = "14 de maio de 2025";

export default function TermosPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">Termos de Uso</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Última atualização: {lastUpdate}
          </p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-10 text-sm leading-relaxed">

          <p className="text-base text-muted-foreground">
            Bem-vindo à ShopForge. Ao acessar ou utilizar nossa plataforma em{" "}
            <strong>shopforge.com.br</strong>, você concorda com os presentes
            Termos de Uso. Se você não concordar com qualquer disposição, por
            favor, não utilize nossos serviços.
          </p>

          {/* 1 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              1. Aceitação dos Termos
            </h2>
            <p>
              Ao criar uma conta, realizar uma compra ou simplesmente navegar pela
              plataforma ShopForge, o usuário declara ter lido, compreendido e
              aceito integralmente estes Termos de Uso, bem como nossa{" "}
              <Link href="/privacidade" className="text-violet-600 hover:underline dark:text-violet-400">
                Política de Privacidade
              </Link>{" "}
              e{" "}
              <Link href="/cookies" className="text-violet-600 hover:underline dark:text-violet-400">
                Política de Cookies
              </Link>
              .
            </p>
            <p className="mt-3">
              A ShopForge reserva-se o direito de alterar estes termos a qualquer
              momento, sendo que as modificações entrarão em vigor imediatamente
              após sua publicação no site. O uso continuado da plataforma após tais
              alterações constituirá aceitação dos novos termos.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              2. Cadastro e Conta do Usuário
            </h2>
            <p>
              Para realizar compras na ShopForge, é necessário criar uma conta
              informando nome completo, endereço de e-mail válido e senha. O usuário
              é responsável por:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>Manter a confidencialidade de suas credenciais de acesso;</li>
              <li>
                Todas as atividades realizadas em sua conta, autorizadas ou não;
              </li>
              <li>
                Notificar imediatamente a ShopForge em caso de uso não autorizado de
                sua conta, pelo e-mail{" "}
                <a href="mailto:contato@shopforge.com.br" className="text-violet-600 hover:underline dark:text-violet-400">
                  contato@shopforge.com.br
                </a>
                ;
              </li>
              <li>Fornecer informações verdadeiras, precisas e atualizadas.</li>
            </ul>
            <p className="mt-3">
              É vedado o cadastro de menores de 18 anos sem autorização expressa dos
              pais ou responsáveis legais. A ShopForge não se responsabiliza por
              danos decorrentes do descumprimento desta regra.
            </p>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              3. Produtos e Preços
            </h2>
            <p>
              A ShopForge atua como vendedora direta dos produtos listados em sua
              plataforma. Todos os preços são expressos em Reais (BRL) e incluem os
              impostos aplicáveis, exceto quando expressamente indicado em contrário.
            </p>
            <p className="mt-3">
              Nos reservamos o direito de modificar preços a qualquer momento, sem
              aviso prévio. O preço cobrado será sempre aquele vigente no momento da
              confirmação do pedido. Eventuais erros de precificação não geram
              obrigação de venda pelo preço incorreto, sendo o cliente imediatamente
              notificado para concordar com o preço correto ou cancelar o pedido.
            </p>
            <p className="mt-3">
              As imagens dos produtos são meramente ilustrativas. A ShopForge
              empenha-se para que as fotos representem fielmente os produtos, mas
              pequenas variações de cor podem ocorrer em razão das configurações de
              monitores.
            </p>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              4. Formas de Pagamento
            </h2>
            <p>
              A ShopForge aceita as seguintes formas de pagamento, todas processadas
              com segurança pela plataforma{" "}
              <strong>Stripe</strong> (PCI-DSS Level 1 compliant):
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>Cartão de crédito (Visa, Mastercard, Elo, American Express);</li>
              <li>Cartão de débito;</li>
              <li>Pix (disponível em checkout selecionado).</li>
            </ul>
            <p className="mt-3">
              Os dados de pagamento são transmitidos diretamente à Stripe e não são
              armazenados em nossos servidores. O pedido será confirmado somente
              após a aprovação do pagamento pelo processador. Em caso de recusa,
              o cliente será notificado para tentar outro método de pagamento.
            </p>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              5. Prazo de Entrega
            </h2>
            <p>
              Os prazos de entrega são estimados e variam conforme a região de
              destino e a disponibilidade do produto em estoque:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>
                <strong>Regiões Sul e Sudeste:</strong> 3 a 7 dias úteis;
              </li>
              <li>
                <strong>Regiões Centro-Oeste e Nordeste:</strong> 5 a 10 dias
                úteis;
              </li>
              <li>
                <strong>Regiões Norte:</strong> 7 a 15 dias úteis.
              </li>
            </ul>
            <p className="mt-3">
              Os prazos começam a contar a partir da confirmação do pagamento.
              Eventualidades como greves, fenômenos climáticos e períodos de
              alta demanda (Black Friday, Natal) podem impactar os prazos, sem que
              isso implique responsabilidade da ShopForge além do previsto em lei.
            </p>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              6. Direito de Arrependimento
            </h2>
            <p>
              Em conformidade com o{" "}
              <strong>artigo 49 do Código de Defesa do Consumidor (Lei nº 8.078/1990)</strong>
              , o consumidor que realizar compras à distância (internet) tem o direito
              de desistir da compra no prazo de <strong>7 (sete) dias corridos</strong>
              , contados a partir da data de recebimento do produto, sem necessidade
              de justificativa.
            </p>
            <p className="mt-3">
              Para exercer o direito de arrependimento:
            </p>
            <ol className="mt-3 ml-5 list-decimal space-y-1">
              <li>
                Entre em contato pelo e-mail{" "}
                <a href="mailto:contato@shopforge.com.br" className="text-violet-600 hover:underline dark:text-violet-400">
                  contato@shopforge.com.br
                </a>{" "}
                dentro do prazo;
              </li>
              <li>
                Informe o número do pedido e o motivo do arrependimento;
              </li>
              <li>
                O produto deve ser devolvido em sua embalagem original, sem sinais
                de uso, com todos os acessórios e nota fiscal;
              </li>
              <li>
                A ShopForge providenciará a coleta do produto e reembolsará o valor
                pago integralmente, incluindo frete, em até 10 dias úteis após o
                recebimento do produto devolvido.
              </li>
            </ol>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              7. Política de Trocas e Devoluções
            </h2>
            <p>
              Além do direito de arrependimento, aceitamos trocas e devoluções nos
              seguintes casos:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>
                <strong>Produto com defeito de fabricação:</strong> prazo de 30
                dias para produtos não duráveis e 90 dias para produtos duráveis,
                conforme artigo 26 do CDC;
              </li>
              <li>
                <strong>Produto diferente do anunciado:</strong> em qualquer
                hipótese, basta entrar em contato conosco;
              </li>
              <li>
                <strong>Produto avariado no transporte:</strong> recuse a entrega
                e nos comunique imediatamente.
              </li>
            </ul>
            <p className="mt-3">
              As trocas por tamanho ou cor estão sujeitas à disponibilidade em
              estoque. Caso o item desejado não esteja disponível, o cliente poderá
              optar por crédito na plataforma ou reembolso integral.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              8. Responsabilidades
            </h2>
            <p>
              A ShopForge compromete-se a manter a plataforma disponível e funcional,
              mas não garante acesso ininterrupto, isento de erros ou livre de vírus.
              Realizamos manutenções periódicas e nos esforçamos para minimizar
              impactos ao usuário.
            </p>
            <p className="mt-3">
              O usuário concorda em não utilizar a plataforma para:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>Praticar atos ilícitos ou contrários à moral e aos bons costumes;</li>
              <li>Inserir dados falsos ou fraudulentos;</li>
              <li>Tentar acessar sistemas internos sem autorização;</li>
              <li>Utilizar scripts, bots ou qualquer automação não autorizada.</li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              9. Propriedade Intelectual
            </h2>
            <p>
              Todo o conteúdo da plataforma ShopForge — incluindo, mas não se
              limitando a, logotipo, marca, textos, imagens, layout, código-fonte e
              base de dados — é de propriedade exclusiva da ShopForge Ltda ou de
              seus licenciantes, sendo protegido pela legislação brasileira de
              direitos autorais (Lei nº 9.610/1998) e de marcas (Lei nº 9.279/1996).
            </p>
            <p className="mt-3">
              É vedada qualquer reprodução, distribuição, modificação ou uso comercial
              sem autorização prévia e por escrito da ShopForge.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              10. Suspensão e Cancelamento de Conta
            </h2>
            <p>
              A ShopForge reserva-se o direito de suspender ou cancelar,
              temporária ou permanentemente, a conta de qualquer usuário que:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>Viole estes Termos de Uso;</li>
              <li>Forneça informações falsas no cadastro;</li>
              <li>Pratique fraudes ou chargebacks indevidos;</li>
              <li>Utilize a plataforma de forma que prejudique outros usuários.</li>
            </ul>
            <p className="mt-3">
              O usuário também pode solicitar o cancelamento de sua conta a qualquer
              momento, mediante solicitação pelo e-mail{" "}
              <a href="mailto:contato@shopforge.com.br" className="text-violet-600 hover:underline dark:text-violet-400">
                contato@shopforge.com.br
              </a>
              , sem prejuízo dos pedidos já realizados e em andamento.
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              11. Lei Aplicável e Legislação
            </h2>
            <p>
              Estes Termos de Uso são regidos pela legislação brasileira,
              especialmente:
            </p>
            <ul className="mt-3 ml-5 list-disc space-y-1">
              <li>
                <strong>Lei nº 8.078/1990</strong> — Código de Defesa do Consumidor
                (CDC);
              </li>
              <li>
                <strong>Lei nº 12.965/2014</strong> — Marco Civil da Internet;
              </li>
              <li>
                <strong>Lei nº 13.709/2018</strong> — Lei Geral de Proteção de
                Dados Pessoais (LGPD);
              </li>
              <li>
                <strong>Lei nº 9.610/1998</strong> — Lei de Direitos Autorais;
              </li>
              <li>
                <strong>Decreto nº 7.962/2013</strong> — Regulamenta o comércio
                eletrônico no Brasil.
              </li>
            </ul>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              12. Foro Competente
            </h2>
            <p>
              Para dirimir quaisquer controvérsias decorrentes destes Termos de Uso,
              fica eleito o foro da <strong>Comarca de Uberaba, Estado de Minas
              Gerais</strong>, com renúncia expressa a qualquer outro, por mais
              privilegiado que seja, ressalvados os casos em que a legislação
              consumerista determine foro diverso em benefício do consumidor.
            </p>
          </section>

          {/* Footer note */}
          <div className="rounded-xl border bg-muted/30 p-5">
            <p className="text-xs text-muted-foreground">
              Em caso de dúvidas sobre estes Termos de Uso, entre em contato pelo
              e-mail{" "}
              <a href="mailto:contato@shopforge.com.br" className="text-violet-600 hover:underline dark:text-violet-400">
                contato@shopforge.com.br
              </a>{" "}
              ou acesse nossa{" "}
              <Link href="/contato" className="text-violet-600 hover:underline dark:text-violet-400">
                página de contato
              </Link>
              . Última atualização: {lastUpdate}.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
