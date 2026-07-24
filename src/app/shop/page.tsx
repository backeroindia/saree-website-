import Link from "next/link";
import type { Metadata } from "next";
import { getCategories, getProducts } from "@/lib/products";
import { getWishlistedProductIds } from "@/lib/wishlist";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import ShopFilters from "@/components/ShopFilters";

type SearchParams = {
  category?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  min?: string;
  max?: string;
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  if (!sp.category) {
    return {
      title: "Shop All Sarees | N.INIYAZHL",
      description: "Browse handloom cotton, silk cotton and printed sarees. Pan-India shipping, cash on delivery available.",
    };
  }
  const category = await prisma.category.findUnique({ where: { slug: sp.category } });
  if (!category) return {};
  return {
    title: `${category.name} | N.INIYAZHL`,
    description: category.description ?? `Shop ${category.name} at N.INIYAZHL — handloom & silk sarees.`,
  };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const [categories, products, wishlistIds] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: sp.category,
      search: sp.search,
      sort: sp.sort,
      minPrice: sp.min ? Number(sp.min) : undefined,
      maxPrice: sp.max ? Number(sp.max) : undefined,
    }),
    getWishlistedProductIds(),
  ]);

  const activeCategory = categories.find((c) => c.slug === sp.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-2 text-xs text-ink/50">
        <Link href="/" className="hover:text-green">Home</Link> / <span>Shop</span>
      </nav>
      <h1 className="font-serif text-3xl font-bold text-ink">
        {activeCategory ? activeCategory.name : "All Sarees"}
      </h1>
      {sp.search && (
        <p className="mt-1 text-sm text-ink/60">
          Search results for &ldquo;{sp.search}&rdquo;
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <ShopFilters
          categories={categories
            .filter((c) => c._count.products > 0 || c.slug === sp.category)
            .map((c) => ({ id: c.id, slug: c.slug, name: c.name }))}
          current={{ category: sp.category, search: sp.search, min: sp.min, max: sp.max }}
        />

        <div className="md:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-ink/60">{products.length} sarees</p>
            <SortSelect />
          </div>

          {products.length === 0 ? (
            <div className="rounded-xl border border-gold/15 bg-white p-12 text-center text-ink/60">
              No sarees match your filters. Try clearing them.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(i % 6) * 60}ms` }}
                >
                  <ProductCard product={p} wishlisted={wishlistIds.has(p.id)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
