import { prisma } from "@/lib/db";

export function parseImages(images: string): string[] {
  try {
    const arr = JSON.parse(images);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export function averageRating(reviews: { rating: number }[]): number {
  if (reviews.length === 0) return 0;
  return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getNewArrivals(limit = 4) {
  return prisma.product.findMany({
    include: { category: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getBestsellers(limit = 4) {
  const grouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((g) => g.productId) } },
    include: { category: true, reviews: { select: { rating: true } } },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const ranked = grouped
    .map((g) => productMap.get(g.productId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (ranked.length >= limit) return ranked;

  // Store is still building sales history — pad the section with featured
  // picks so the homepage doesn't look sparse while real rankings grow in.
  const fillers = await prisma.product.findMany({
    where: { featured: true, id: { notIn: ranked.map((p) => p.id) } },
    include: { category: true, reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
    take: limit - ranked.length,
  });

  return [...ranked, ...fillers];
}

export async function getTopReviews(limit = 6) {
  return prisma.review.findMany({
    where: { rating: { gte: 4 } },
    include: { user: { select: { name: true } }, product: { select: { name: true, slug: true } } },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export type ProductFilters = {
  categorySlug?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  minPrice?: number;
  maxPrice?: number;
};

export async function getProducts(filters: ProductFilters = {}) {
  const { categorySlug, search, sort = "newest", minPrice, maxPrice } = filters;

  const where: Record<string, unknown> = {};
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
      { fabric: { contains: search } },
      { color: { contains: search } },
    ];
  }
  if (minPrice != null || maxPrice != null) {
    where.price = {
      ...(minPrice != null ? { gte: minPrice } : {}),
      ...(maxPrice != null ? { lte: maxPrice } : {}),
    };
  }

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  return prisma.product.findMany({
    where,
    include: { category: true, reviews: { select: { rating: true } } },
    orderBy,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: { category: true, reviews: { select: { rating: true } } },
    take: limit,
  });
}
