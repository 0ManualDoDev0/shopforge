import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/store/ProductCard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lista de Desejos — ShopForge" };

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/wishlist");

  const items = await db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          category: true,
          _count: { select: { orderItems: true } },
          reviews: { select: { rating: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const products = items
    .map((i) => i.product)
    .filter((p) => !p.isArchived);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Heart className="size-6 text-red-500 fill-red-500" />
        <h1 className="text-2xl font-bold">Lista de Desejos</h1>
        <span className="text-sm text-muted-foreground">
          ({products.length} produto{products.length !== 1 ? "s" : ""})
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-muted/20 py-24 text-center">
          <Heart className="mb-4 size-16 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Lista de desejos vazia</h2>
          <p className="mt-2 text-muted-foreground">
            Navegue pelos produtos e salve os que você mais gostou.
          </p>
          <Button className="mt-6" render={<Link href="/products" />}>
            <ShoppingBag className="mr-2 size-4" />
            Ver Produtos
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => {
            const avgRating =
              product.reviews.length > 0
                ? product.reviews.reduce((s, r) => s + r.rating, 0) /
                  product.reviews.length
                : 0;
            return (
              <ProductCard
                key={product.id}
                product={product}
                avgRating={avgRating}
                reviewCount={product.reviews.length}
                totalSold={product._count.orderItems}
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
