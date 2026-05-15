import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL =
  process.env.NEXTAUTH_URL ?? "https://shopforge-three.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/products`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/sobre`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contato`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: { isArchived: false },
      select: { slug: true, updatedAt: true },
    }),
    db.category.findMany({
      select: { slug: true },
    }),
  ]);

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.slug)
    .map((c) => ({
      url: `${BASE_URL}/products?category=${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
