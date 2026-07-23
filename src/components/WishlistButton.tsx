"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import clsx from "clsx";

export default function WishlistButton({
  productId,
  initialWishlisted,
  variant = "overlay",
}: {
  productId: string;
  initialWishlisted: boolean;
  variant?: "overlay" | "inline";
}) {
  const router = useRouter();
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !wishlisted;
    setWishlisted(next);
    startTransition(async () => {
      const res = await fetch(next ? "/api/wishlist" : `/api/wishlist/${productId}`, {
        method: next ? "POST" : "DELETE",
        headers: next ? { "Content-Type": "application/json" } : undefined,
        body: next ? JSON.stringify({ productId }) : undefined,
      });
      if (res.status === 401) {
        setWishlisted(!next);
        router.push("/login?next=/shop");
        return;
      }
      if (!res.ok) {
        setWishlisted(!next);
        return;
      }
      router.refresh();
    });
  }

  if (variant === "inline") {
    return (
      <button
        onClick={toggle}
        disabled={isPending}
        className="flex items-center gap-1.5 rounded-full border border-gold/30 px-4 py-2.5 text-sm font-medium text-ink/70 transition-colors hover:bg-gold/10 disabled:opacity-60"
      >
        <Heart className={clsx("h-4 w-4", wishlisted && "fill-red-500 text-red-500")} />
        {wishlisted ? "Saved to Wishlist" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
    >
      <Heart
        key={wishlisted ? "on" : "off"}
        className={clsx(
          "h-4 w-4 transition-colors",
          wishlisted ? "animate-pop fill-red-500 text-red-500" : "text-ink/50"
        )}
      />
    </button>
  );
}
