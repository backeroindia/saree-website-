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
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getFeaturedProducts(limit = 4) {
  return prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
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
    include: { category: true },
    orderBy,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4) {
  return prisma.product.findMany({
    where: { categoryId, id: { not: excludeId } },
    include: { category: true },
    take: limit,
  });
}
