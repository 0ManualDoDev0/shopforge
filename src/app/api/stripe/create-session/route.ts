import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

interface CartItemInput {
  productId: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { items } = (await req.json()) as { items: CartItemInput[] };

  if (!items?.length) {
    return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
  }

  // Fetch real prices from DB — never trust client-sent prices
  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isArchived: false },
  });

  if (products.length !== items.length) {
    return NextResponse.json(
      { error: "Um ou mais produtos não foram encontrados" },
      { status: 400 }
    );
  }

  const lineItems = products.map((p) => {
    const qty = items.find((i) => i.productId === p.id)?.quantity ?? 1;
    return {
      price_data: {
        currency: "brl",
        product_data: { name: p.name, images: p.images.slice(0, 1) },
        unit_amount: Math.round(Number(p.price) * 100),
      },
      quantity: qty,
    };
  });

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${process.env.NEXTAUTH_URL}/orders?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/cart`,
    metadata: {
      userId: session.user.id!,
      items: JSON.stringify(items),
    },
    customer_email: session.user.email ?? undefined,
  });

  return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
}
