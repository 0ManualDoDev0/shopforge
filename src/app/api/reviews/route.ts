import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
  productId: z.string().min(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos", details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { rating, comment, productId } = parsed.data;
  const userId = session.user.id;

  const product = await db.product.findUnique({
    where: { id: productId, isArchived: false },
    select: { id: true },
  });
  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  const existing = await db.review.findFirst({
    where: { userId, productId },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "Você já avaliou este produto" }, { status: 409 });
  }

  const review = await db.review.create({
    data: { userId, productId, rating, comment },
  });

  return NextResponse.json(review, { status: 201 });
}
