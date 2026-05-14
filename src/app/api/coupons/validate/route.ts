import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const schema = z.object({
  code: z.string().min(1).toUpperCase(),
  cartTotal: z.number().positive(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });
  }

  const { code, cartTotal } = parsed.data;

  const coupon = await db.coupon.findUnique({ where: { code } });

  if (!coupon) {
    return NextResponse.json({ error: "Cupom não encontrado" }, { status: 404 });
  }
  if (!coupon.isActive) {
    return NextResponse.json({ error: "Cupom inativo" }, { status: 422 });
  }
  if (coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Cupom esgotado" }, { status: 422 });
  }
  if (cartTotal < Number(coupon.minValue)) {
    const minFormatted = Number(coupon.minValue).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return NextResponse.json(
      { error: `Valor mínimo de ${minFormatted} não atingido` },
      { status: 422 }
    );
  }

  const discountAmount = Math.round(cartTotal * (coupon.discount / 100) * 100) / 100;

  return NextResponse.json({
    code: coupon.code,
    discount: coupon.discount,
    discountAmount,
  });
}
