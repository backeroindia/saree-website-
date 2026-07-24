"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

const PRICE_BANDS = [
  { label: "Under ₹1,800", min: undefined as number | undefined, max: 179900 },
  { label: "₹1,800 – ₹2,200", min: 180000, max: 220000 },
  { label: "Above ₹2,200", min: 220100, max: undefined as number | undefined },
];

type Category = { id: string; slug: string; name: string };
type Current = { category?: string; search?: string; min?: string; max?: string };

export default function ShopFilters({
  categories,
  current,
}: {
  categories: Category[];
  current: Current;
}) {
  const [open, setOpen] = useState(false);

  const buildHref = (overrides: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const merged = { ...current, ...overrides };
    Object.entries(merged).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  const activeCategoryName = current.category
    ? categories.find((c) => c.slug === current.category)?.name
    : undefined;
  const hasActiveFilters = Boolean(current.category || current.min || current.max);

  return (
    <aside className="md:col-span-1">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-lg border border-gold/20 bg-white px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-gold/40 md:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4" /> Filters
          {hasActiveFilters && (
            <span className="rounded-full bg-green px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-background">
              {activeCategoryName ?? "Price"}
            </span>
          )}
        </span>
        <ChevronDown
          className={clsx("h-4 w-4 transition-transform duration-300", open && "rotate-180")}
        />
      </button>

      <div
        className={clsx(
          "grid overflow-hidden transition-all duration-300 ease-out md:!mt-0 md:!grid-rows-[1fr] md:!opacity-100",
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="min-h-0 space-y-8">
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
                    !current.category && "font-semibold text-green"
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
                      current.category === c.slug && "font-semibold text-green"
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
                    !current.min && !current.max && "font-semibold text-green"
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
                      current.min === band.min?.toString() &&
                        current.max === band.max?.toString() &&
                        "font-semibold text-green"
                    )}
                  >
                    {band.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
