import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const itemsJson = session.metadata?.items;

      if (!userId || !itemsJson) break;

      // Idempotency: skip if order already exists for this session
      const existing = await db.order.findFirst({
        where: { stripeSessionId: session.id },
      });
      if (existing) break;

      const items = JSON.parse(itemsJson) as { productId: string; quantity: number }[];

      // Re-fetch prices from DB to store accurate values
      const products = await db.product.findMany({
        where: { id: { in: items.map((i) => i.productId) } },
      });

      const total = products.reduce((sum, p) => {
        const qty = items.find((i) => i.productId === p.id)?.quantity ?? 1;
        return sum + Number(p.price) * qty;
      }, 0);

      const paymentIntentId =
        typeof session.payment_intent === "string" ? session.payment_intent : null;

      await db.order.create({
        data: {
          userId,
          total,
          status: "PROCESSING",
          isPaid: true,
          paidAt: new Date(),
          stripeSessionId: session.id,
          ...(paymentIntentId && { paymentIntentId }),
          items: {
            create: products.map((p) => ({
              productId: p.id,
              quantity: items.find((i) => i.productId === p.id)?.quantity ?? 1,
              price: p.price,
            })),
          },
        },
      });
      break;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : null;
      if (paymentIntentId) {
        await db.order.updateMany({
          where: { paymentIntentId },
          data: { status: "REFUNDED" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
