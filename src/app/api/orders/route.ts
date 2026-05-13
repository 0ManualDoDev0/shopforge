import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createOrderSchema } from "@/lib/validations/order.schema";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = (session.user as { role?: string }).role;
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = 10;

  const where = role === "ADMIN" ? {} : { userId: session.user.id! };

  const [orders, total] = await Promise.all([
    db.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: { select: { id: true, name: true, images: true, slug: true } },
          },
        },
        address: true,
        user: { select: { id: true, name: true, email: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.order.count({ where }),
  ]);

  return NextResponse.json({ orders, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { items } = parsed.data;

  const products = await db.product.findMany({
    where: { id: { in: items.map((i) => i.productId) }, isArchived: false },
  });

  // Validate all products exist
  if (products.length !== items.length) {
    const foundIds = new Set(products.map((p) => p.id));
    const missing = items.find((i) => !foundIds.has(i.productId));
    return NextResponse.json(
      { error: `Produto ${missing?.productId ?? ""} não encontrado` },
      { status: 400 }
    );
  }

  // Validate stock
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.stock < item.quantity) {
      return NextResponse.json(
        {
          error: `Estoque insuficiente para "${product.name}". Disponível: ${product.stock}`,
        },
        { status: 400 }
      );
    }
  }

  const total = products.reduce((sum, p) => {
    const qty = items.find((i) => i.productId === p.id)?.quantity ?? 1;
    return sum + Number(p.price) * qty;
  }, 0);

  const order = await db.order.create({
    data: {
      userId: session.user.id!,
      total,
      status: "PENDING",
      items: {
        create: products.map((p) => ({
          productId: p.id,
          quantity: items.find((i) => i.productId === p.id)?.quantity ?? 1,
          price: p.price,
        })),
      },
    },
    include: {
      items: {
        include: {
          product: { select: { id: true, name: true, images: true, slug: true } },
        },
      },
    },
  });

  return NextResponse.json(order, { status: 201 });
}
