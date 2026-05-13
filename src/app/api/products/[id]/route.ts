import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validations/product.schema";

type Params = { params: Promise<{ id: string }> };

function isAdmin(token: unknown): boolean {
  return (token as { role?: string } | null)?.role === "ADMIN";
}

async function requireAdmin(req: NextRequest): Promise<boolean> {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  return isAdmin(token);
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = productSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await db.product.update({
    where: { id },
    data: parsed.data,
    include: { category: true },
  });

  return NextResponse.json(product);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  if (!(await requireAdmin(req))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const orderItemCount = await db.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    return NextResponse.json(
      {
        error:
          "Produto possui pedidos vinculados e não pode ser deletado. Archive-o em vez disso.",
      },
      { status: 400 }
    );
  }

  await db.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
