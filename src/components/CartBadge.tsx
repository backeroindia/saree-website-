"use client";

import { useCartStore } from "@/lib/cart-store";

export default function CartBadge() {
  const totalItems = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  if (totalItems === 0) return null;

  return (
    <span
      key={totalItems}
      className="animate-pop absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-semibold text-background"
    >
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}
