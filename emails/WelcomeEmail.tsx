import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Button,
} from "@react-email/components";

interface WelcomeEmailProps {
  name: string;
  loginUrl?: string;
}

export default function WelcomeEmail({
  name,
  loginUrl = "http://localhost:3000",
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f4f4f5" }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            padding: "24px",
            backgroundColor: "#fff",
            borderRadius: "8px",
          }}
        >
          <Heading style={{ color: "#111" }}>Bem-vindo ao ShopForge!</Heading>
          <Text>Olá, {name}!</Text>
          <Text>
            Sua conta foi criada com sucesso. Explore nossos produtos e aproveite a
            melhor experiência de compra.
          </Text>
          <Button
            href={loginUrl}
            style={{
              backgroundColor: "#111",
              color: "#fff",
              padding: "12px 24px",
              borderRadius: "6px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Explorar produtos
          </Button>
          <Text style={{ color: "#666", fontSize: "12px", marginTop: "24px" }}>
            Se você não criou esta conta, ignore este e-mail.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
