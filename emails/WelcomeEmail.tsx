import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Hr,
  Section,
  Button,
  Preview,
  Font,
  Row,
  Column,
} from "@react-email/components";

export interface WelcomeEmailProps {
  customerName: string;
}

const benefits = [
  {
    icon: "🚀",
    title: "Entrega Rápida",
    desc: "Frete grátis em compras acima de R$ 200 e entrega expressa disponível.",
  },
  {
    icon: "🔒",
    title: "Compra Segura",
    desc: "Pagamento criptografado com Stripe. Seus dados estão sempre protegidos.",
  },
  {
    icon: "↩️",
    title: "Troca Fácil",
    desc: "Não ficou satisfeito? Troca gratuita em até 30 dias sem burocracia.",
  },
];

export default function WelcomeEmail({ customerName = "Cliente" }: WelcomeEmailProps) {
  const storeUrl = process.env.NEXTAUTH_URL ?? "https://shopforge.com";

  return (
    <Html lang="pt-BR">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Bem-vindo ao ShopForge, {customerName}! Sua conta está pronta.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ShopForge</Text>
            <Text style={headerTagline}>Sua loja favorita</Text>
          </Section>

          {/* Welcome */}
          <Section style={welcomeSection}>
            <Text style={waveEmoji}>👋</Text>
            <Heading style={welcomeTitle}>Bem-vindo, {customerName}!</Heading>
            <Text style={welcomeText}>
              Sua conta foi criada com sucesso. Estamos felizes em ter você conosco!
              Explore nossa seleção cuidadosa de produtos e aproveite a melhor
              experiência de compra online.
            </Text>
            <Button href={storeUrl} style={ctaButton}>
              Começar a comprar
            </Button>
          </Section>

          <Hr style={divider} />

          {/* Benefits */}
          <Section style={benefitsSection}>
            <Heading as="h2" style={benefitsTitle}>
              Por que comprar no ShopForge?
            </Heading>

            {benefits.map((b) => (
              <Row key={b.title} style={benefitRow}>
                <Column style={iconCol}>
                  <Text style={benefitIcon}>{b.icon}</Text>
                </Column>
                <Column style={benefitContent}>
                  <Text style={benefitName}>{b.title}</Text>
                  <Text style={benefitDesc}>{b.desc}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Se você não criou esta conta, ignore este e-mail com segurança.
            </Text>
            <Hr style={footerDivider} />
            <Text style={footerCopy}>
              © {new Date().getFullYear()} ShopForge. Todos os direitos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const body: React.CSSProperties = {
  backgroundColor: "#f4f4f8",
  fontFamily: "Inter, Arial, sans-serif",
  margin: 0,
  padding: "24px 0",
};
const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,.08)",
};
const header: React.CSSProperties = {
  backgroundColor: "#7c3aed",
  padding: "28px 32px",
  textAlign: "center",
};
const logo: React.CSSProperties = {
  color: "#ffffff",
  fontSize: "26px",
  fontWeight: 700,
  margin: 0,
  letterSpacing: "-0.5px",
};
const headerTagline: React.CSSProperties = {
  color: "#ddd6fe",
  fontSize: "13px",
  margin: "4px 0 0",
};
const welcomeSection: React.CSSProperties = {
  padding: "40px 32px 32px",
  textAlign: "center",
};
const waveEmoji: React.CSSProperties = { fontSize: "40px", margin: "0 0 12px" };
const welcomeTitle: React.CSSProperties = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: 700,
  margin: "0 0 16px",
};
const welcomeText: React.CSSProperties = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.7",
  margin: "0 0 28px",
};
const ctaButton: React.CSSProperties = {
  backgroundColor: "#7c3aed",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 600,
  padding: "14px 36px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};
const divider: React.CSSProperties = { borderColor: "#e5e7eb", margin: 0 };
const benefitsSection: React.CSSProperties = {
  padding: "32px 32px",
  backgroundColor: "#faf9ff",
};
const benefitsTitle: React.CSSProperties = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: 600,
  margin: "0 0 20px",
  textAlign: "center",
};
const benefitRow: React.CSSProperties = { marginBottom: "16px" };
const iconCol: React.CSSProperties = { width: "44px", verticalAlign: "top" };
const benefitIcon: React.CSSProperties = { fontSize: "22px", margin: "2px 0 0" };
const benefitContent: React.CSSProperties = { paddingLeft: "8px", verticalAlign: "top" };
const benefitName: React.CSSProperties = {
  color: "#111827",
  fontSize: "14px",
  fontWeight: 600,
  margin: "0 0 2px",
};
const benefitDesc: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "1.5",
  margin: 0,
};
const footer: React.CSSProperties = {
  padding: "24px 32px",
  backgroundColor: "#f9fafb",
  textAlign: "center",
};
const footerDivider: React.CSSProperties = { borderColor: "#e5e7eb", margin: "12px 0" };
const footerText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0 0 8px",
};
const footerCopy: React.CSSProperties = { color: "#9ca3af", fontSize: "12px", margin: 0 };
