import Link from "next/link";
import { getCategories, getProducts } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import clsx from "clsx";

const PRICE_BANDS = [
  { label: "Under ₹1,800", min: undefined, max: 179900 },
  { label: "₹1,800 – ₹2,200", min: 180000, max: 220000 },
  { label: "Above ₹2,200", min: 220100, max: undefined },
];

type SearchParams = {
  category?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  min?: string;
  max?: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      categorySlug: sp.category,
      search: sp.search,
      sort: sp.sort,
      minPrice: sp.min ? Number(sp.min) : undefined,
      maxPrice: sp.max ? Number(sp.max) : undefined,
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === sp.category);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { category: sp.category, search: sp.search, min: sp.min, max: sp.max, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

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
        <aside className="space-y-8 md:col-span-1">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/70">
              Category
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={buildHref({ category: undefined })}
                  className={clsx(
                    "block rounded px-2 py-1 hover:bg-white",
                    !sp.category && "font-semibold text-green"
                  )}
                >
                  All
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={buildHref({ category: c.slug })}
                    className={clsx(
                      "block rounded px-2 py-1 hover:bg-white",
                      sp.category === c.slug && "font-semibold text-green"
                    )}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink/70">
              Price
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={buildHref({ min: undefined, max: undefined })}
                  className={clsx(
                    "block rounded px-2 py-1 hover:bg-white",
                    !sp.min && !sp.max && "font-semibold text-green"
                  )}
                >
                  Any price
                </Link>
              </li>
              {PRICE_BANDS.map((band) => (
                <li key={band.label}>
                  <Link
                    href={buildHref({
                      min: band.min?.toString(),
                      max: band.max?.toString(),
                    })}
                    className={clsx(
                      "block rounded px-2 py-1 hover:bg-white",
                      sp.min === band.min?.toString() &&
                        sp.max === band.max?.toString() &&
                        "font-semibold text-green"
                    )}
                  >
                    {band.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

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
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
