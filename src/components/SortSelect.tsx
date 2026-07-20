"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") ?? "newest";

  return (
    <select
      value={currentSort}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        if (e.target.value === "newest") {
          params.delete("sort");
        } else {
          params.set("sort", e.target.value);
        }
        router.push(`${pathname}?${params.toString()}`);
      }}
      className="rounded-full border border-gold/30 bg-white px-3 py-2 text-sm outline-none focus:border-gold"
    >
      <option value="newest">Newest</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
    </select>
  );
}
