import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Hr,
  Section,
  Row,
  Column,
  Img,
  Button,
  Preview,
  Font,
} from "@react-email/components";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderConfirmationProps {
  customerName: string;
  orderNumber: string;
  items: OrderItem[];
  total: number;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}

const FREE_SHIPPING_THRESHOLD = 200;

function fmtBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value
  );
}

export default function OrderConfirmation({
  customerName = "Cliente",
  orderNumber = "000001",
  items = [],
  total = 0,
  shippingAddress,
}: OrderConfirmationProps) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 20;
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
        Pedido #{orderNumber} confirmado! Obrigado por comprar no ShopForge.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>ShopForge</Text>
            <Text style={headerTagline}>Sua loja favorita</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heroTitle}>Pedido Confirmado!</Heading>
            <Text style={heroText}>
              Olá, <strong>{customerName}</strong>! Recebemos seu pedido e já estamos
              preparando tudo com cuidado para você.
            </Text>
            <Text style={orderBadge}>Pedido #{orderNumber}</Text>
          </Section>

          <Hr style={divider} />

          {/* Items */}
          <Section style={section}>
            <Heading as="h2" style={sectionTitle}>
              Itens do Pedido
            </Heading>

            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                {item.image && (
                  <Column style={imageCol}>
                    <Img
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      style={itemImg}
                    />
                  </Column>
                )}
                <Column style={itemDetailsCol}>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemQty}>Quantidade: {item.quantity}</Text>
                </Column>
                <Column style={priceCol}>
                  <Text style={itemPrice}>{fmtBRL(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          <Hr style={divider} />

          {/* Totals */}
          <Section style={section}>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Subtotal</Text>
              </Column>
              <Column style={valueCol}>
                <Text style={totalValue}>{fmtBRL(subtotal)}</Text>
              </Column>
            </Row>
            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Frete</Text>
              </Column>
              <Column style={valueCol}>
                <Text style={totalValue}>
                  {shipping === 0 ? "Grátis" : fmtBRL(shipping)}
                </Text>
              </Column>
            </Row>
            <Hr style={thinDivider} />
            <Row style={totalRow}>
              <Column>
                <Text style={grandLabel}>Total</Text>
              </Column>
              <Column style={valueCol}>
                <Text style={grandValue}>{fmtBRL(total)}</Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping address */}
          {shippingAddress && (
            <>
              <Hr style={divider} />
              <Section style={section}>
                <Heading as="h2" style={sectionTitle}>
                  Endereço de Entrega
                </Heading>
                <Text style={addressText}>
                  {shippingAddress.street}
                  <br />
                  {shippingAddress.city} — {shippingAddress.state}
                  <br />
                  CEP {shippingAddress.postalCode}
                </Text>
              </Section>
            </>
          )}

          <Hr style={divider} />

          {/* CTA */}
          <Section style={ctaSection}>
            <Button href={`${storeUrl}/orders`} style={ctaButton}>
              Ver meu pedido
            </Button>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Dúvidas? Responda este e-mail e nossa equipe terá prazer em ajudar.
            </Text>
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
const heroSection: React.CSSProperties = { padding: "32px 32px 24px" };
const heroTitle: React.CSSProperties = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: 700,
  margin: "0 0 12px",
};
const heroText: React.CSSProperties = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 16px",
};
const orderBadge: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: "#f3f0ff",
  color: "#7c3aed",
  fontSize: "13px",
  fontWeight: 600,
  padding: "6px 14px",
  borderRadius: "20px",
  margin: 0,
};
const divider: React.CSSProperties = { borderColor: "#e5e7eb", margin: 0 };
const thinDivider: React.CSSProperties = { borderColor: "#f3f4f6", margin: "8px 0" };
const section: React.CSSProperties = { padding: "24px 32px" };
const sectionTitle: React.CSSProperties = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: 600,
  margin: "0 0 16px",
};
const itemRow: React.CSSProperties = { marginBottom: "12px" };
const imageCol: React.CSSProperties = { width: "72px", verticalAlign: "top" };
const itemImg: React.CSSProperties = {
  borderRadius: "8px",
  objectFit: "cover",
  border: "1px solid #e5e7eb",
};
const itemDetailsCol: React.CSSProperties = { paddingLeft: "12px", verticalAlign: "top" };
const itemName: React.CSSProperties = {
  color: "#111827",
  fontSize: "14px",
  fontWeight: 500,
  margin: "0 0 4px",
};
const itemQty: React.CSSProperties = { color: "#6b7280", fontSize: "13px", margin: 0 };
const priceCol: React.CSSProperties = {
  textAlign: "right",
  verticalAlign: "top",
  width: "100px",
};
const itemPrice: React.CSSProperties = {
  color: "#111827",
  fontSize: "14px",
  fontWeight: 600,
  margin: 0,
};
const totalRow: React.CSSProperties = { marginBottom: "4px" };
const totalLabel: React.CSSProperties = { color: "#6b7280", fontSize: "14px", margin: 0 };
const valueCol: React.CSSProperties = { textAlign: "right" };
const totalValue: React.CSSProperties = { color: "#374151", fontSize: "14px", margin: 0 };
const grandLabel: React.CSSProperties = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: 700,
  margin: 0,
};
const grandValue: React.CSSProperties = {
  color: "#7c3aed",
  fontSize: "16px",
  fontWeight: 700,
  margin: 0,
  textAlign: "right",
};
const addressText: React.CSSProperties = {
  color: "#374151",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: 0,
};
const ctaSection: React.CSSProperties = { padding: "24px 32px", textAlign: "center" };
const ctaButton: React.CSSProperties = {
  backgroundColor: "#7c3aed",
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: 600,
  padding: "14px 32px",
  borderRadius: "8px",
  textDecoration: "none",
  display: "inline-block",
};
const footer: React.CSSProperties = {
  backgroundColor: "#f9fafb",
  padding: "24px 32px",
  textAlign: "center",
};
const footerText: React.CSSProperties = {
  color: "#6b7280",
  fontSize: "13px",
  margin: "0 0 8px",
};
const footerCopy: React.CSSProperties = { color: "#9ca3af", fontSize: "12px", margin: 0 };
