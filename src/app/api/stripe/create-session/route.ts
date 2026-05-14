import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const bodySchema = z.object({
  items: z.array(cartItemSchema).min(1, "Carrinho vazio"),
  couponCode: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rawBody = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { items, couponCode } = parsed.data;

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

  // Resolve coupon discount
  let stripeDiscounts: { coupon: string }[] | undefined;

  if (couponCode) {
    const coupon = await db.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });

    if (coupon && coupon.isActive && coupon.usedCount < coupon.maxUses) {
      const stripeCoupon = await stripe.coupons.create({
        percent_off: coupon.discount,
        duration: "once",
        name: `Cupom ${coupon.code}`,
        currency: "brl",
      });

      stripeDiscounts = [{ coupon: stripeCoupon.id }];

      // Increment usage count
      await db.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    ...(stripeDiscounts ? { discounts: stripeDiscounts } : {}),
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
