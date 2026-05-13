import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Hr,
  Section,
} from "@react-email/components";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface OrderConfirmationProps {
  orderId: string;
  customerName: string;
  total: number;
  items: OrderItem[];
}

export default function OrderConfirmation({
  orderId,
  customerName,
  total,
  items,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f4f4f5" }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", padding: "24px", backgroundColor: "#fff", borderRadius: "8px" }}>
          <Heading style={{ color: "#111" }}>Pedido Confirmado!</Heading>
          <Text>Olá, {customerName}!</Text>
          <Text>
            Seu pedido <strong>#{orderId}</strong> foi confirmado e está sendo processado.
          </Text>
          <Hr />
          <Section>
            <Heading as="h2" style={{ fontSize: "16px" }}>Itens do pedido</Heading>
            {items.map((item) => (
              <Text key={item.name} style={{ margin: "4px 0" }}>
                {item.name} × {item.quantity} —{" "}
                R$ {(item.price * item.quantity).toFixed(2)}
              </Text>
            ))}
          </Section>
          <Hr />
          <Text style={{ fontWeight: "bold", fontSize: "18px" }}>
            Total: R$ {total.toFixed(2)}
          </Text>
          <Text style={{ color: "#666", fontSize: "12px" }}>
            Obrigado por comprar no ShopForge!
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
