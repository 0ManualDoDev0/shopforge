import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
});

const bodySchema = z.object({
  items: z.array(cartItemSchema).min(1, "Carrinho vazio"),
  couponCode: z.string().optional(),
});

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

const paymentClient = new Payment(client);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  const subtotal = products.reduce((sum, p) => {
    const qty = items.find((i) => i.productId === p.id)?.quantity ?? 1;
    return sum + Number(p.price) * qty;
  }, 0);

  let discountAmount = 0;
  if (couponCode) {
    const coupon = await db.coupon.findUnique({
      where: { code: couponCode.toUpperCase() },
    });
    if (
      coupon &&
      coupon.isActive &&
      coupon.usedCount < coupon.maxUses &&
      subtotal >= Number(coupon.minValue)
    ) {
      discountAmount = subtotal * (coupon.discount / 100);
      await db.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      });
    }
  }

  const transactionAmount = Math.max(0.01, Math.round((subtotal - discountAmount) * 100) / 100);

  const response = await paymentClient.create({
    body: {
      transaction_amount: transactionAmount,
      payment_method_id: "pix",
      payer: {
        email: session.user.email!,
      },
    },
    requestOptions: { idempotencyKey: crypto.randomUUID() },
  });

  const qrCode = response.point_of_interaction?.transaction_data?.qr_code;
  const qrCodeBase64 = response.point_of_interaction?.transaction_data?.qr_code_base64;
  const paymentId = response.id;

  if (!qrCode || !qrCodeBase64 || !paymentId) {
    return NextResponse.json({ error: "Falha ao gerar Pix" }, { status: 502 });
  }

  return NextResponse.json({ qrCode, qrCodeBase64, paymentId });
}
