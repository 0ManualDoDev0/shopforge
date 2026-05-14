import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ChevronRight, AlertTriangle } from "lucide-react";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPrice, formatDate } from "@/lib/utils";
import ProductImageGallery from "@/components/store/ProductImageGallery";
import AddToCartButton from "@/components/store/AddToCartButton";
import TrustBar from "@/components/shared/TrustBar";
import RecommendedProducts from "@/components/store/RecommendedProducts";

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await db.product.findMany({
      where: { isArchived: false },
      select: { slug: true },
    });
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return { title: "Produto não encontrado" };
  return {
    title: `${product.name} — ShopForge`,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug, isArchived: false },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  const price = Number(product.price);
  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Início
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <Link
          href={`/products?category=${product.category.slug}`}
          className="hover:text-foreground transition-colors"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="size-3.5 shrink-0" />
        <span className="truncate font-medium text-foreground">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* Image gallery */}
        <ProductImageGallery
          images={product.images.length > 0 ? product.images : ["/placeholder.png"]}
          productName={product.name}
        />

        {/* Product info */}
        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category.name}
            </Badge>
            <h1 className="text-3xl font-bold">{product.name}</h1>
          </div>

          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.round(avgRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} (
                {product.reviews.length} avaliação
                {product.reviews.length !== 1 ? "ões" : ""})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(price)}</span>
            {product.comparePrice &&
              Number(product.comparePrice) > price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
          </div>

          <p
            className={`text-sm font-medium ${
              product.stock > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-500"
            }`}
          >
            {product.stock > 0
              ? `${product.stock} em estoque`
              : "Produto esgotado"}
          </p>

          {/* Low stock warning */}
          {isLowStock && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 dark:border-red-900/40 dark:bg-red-900/20">
              <AlertTriangle className="size-4 shrink-0 text-red-500" />
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                Apenas {product.stock} restante{product.stock !== 1 ? "s" : ""}!
              </p>
            </div>
          )}

          <Separator />

          {/* Add to cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price,
              images: product.images,
              slug: product.slug,
              stock: product.stock,
            }}
          />

          {/* Trust signals compact */}
          <TrustBar compact />
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="reviews">
              Avaliações ({product.reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {product.reviews.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma avaliação ainda.</p>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-5xl font-bold">
                    {avgRating.toFixed(1)}
                  </span>
                  <div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-5 ${
                            i < Math.round(avgRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.reviews.length} avaliação
                      {product.reviews.length !== 1 ? "ões" : ""}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id}>
                      <div className="flex items-start gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarImage src={review.user.image ?? undefined} />
                          <AvatarFallback>
                            {review.user.name?.charAt(0).toUpperCase() ?? "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-medium">
                              {review.user.name ?? "Usuário"}
                            </p>
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`size-3.5 ${
                                    i < review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-muted text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {formatDate(review.createdAt)}
                          </p>
                          {review.comment && (
                            <p className="mt-2 text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Recommended products */}
      <RecommendedProducts
        productId={product.id}
        categorySlug={product.category.slug ?? ""}
      />
    </main>
  );
}
