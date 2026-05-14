import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ ids: [] });
  }

  const items = await db.wishlist.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  });

  return NextResponse.json({ ids: items.map((i) => i.productId) });
}

const toggleSchema = z.object({ productId: z.string().min(1) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = toggleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 422 });
  }

  const { productId } = parsed.data;
  const userId = session.user.id;

  const existing = await db.wishlist.findUnique({
    where: { userId_productId: { userId, productId } },
    select: { id: true },
  });

  if (existing) {
    await db.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ added: false });
  }

  await db.wishlist.create({ data: { userId, productId } });
  return NextResponse.json({ added: true }, { status: 201 });
}
