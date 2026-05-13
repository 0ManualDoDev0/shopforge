import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { productSchema } from "@/lib/validations/product.schema";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 12);
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");

  const where = {
    isArchived: false,
    ...(categoryId && { categoryId }),
    ...(search && { name: { contains: search, mode: "insensitive" as const } }),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: { category: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({ products, total, page, totalPages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const data = productSchema.parse(body);

  const slug = slugify(data.name, { lower: true, strict: true });

  const product = await db.product.create({
    data: { ...data, slug },
    include: { category: true },
  });

  return NextResponse.json(product, { status: 201 });
}
