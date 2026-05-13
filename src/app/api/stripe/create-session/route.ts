import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

interface CartItemInput {
  id: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items, addressId } = (await req.json()) as {
    items: CartItemInput[];
    addressId?: string;
  };

  if (!items?.length) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.id) }, isArchived: false },
  });

  if (products.length !== items.length) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 400 });
  }

  const lineItems = products.map((p) => {
    const qty = items.find((i) => i.id === p.id)?.quantity ?? 1;
    return {
      price_data: {
        currency: "brl",
        product_data: { name: p.name, images: p.images.slice(0, 1) },
        unit_amount: Math.round(Number(p.price) * 100),
      },
      quantity: qty,
    };
  });

  const total =
    lineItems.reduce((s, i) => s + i.price_data.unit_amount * i.quantity, 0) / 100;

  const order = await db.order.create({
    data: {
      userId: session.user.id!,
      total,
      items: {
        create: products.map((p) => ({
          productId: p.id,
          quantity: items.find((i) => i.id === p.id)?.quantity ?? 1,
          price: p.price,
        })),
      },
      ...(addressId && { address: { connect: { id: addressId } } }),
    },
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.NEXTAUTH_URL}/orders?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    metadata: { orderId: order.id },
    customer_email: session.user.email ?? undefined,
  });

  await db.order.update({
    where: { id: order.id },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
