"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Check } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

type Props = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  stock: number;
};

export default function AddToCart({ productId, slug, name, image, price, stock }: Props) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const router = useRouter();

  if (stock <= 0) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed rounded-full bg-ink/20 px-6 py-3 text-sm font-semibold text-ink/50"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-ink/60">Quantity</span>
        <div className="flex items-center rounded-full border border-gold/30">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="p-2 text-ink/60 hover:text-green"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(stock, q + 1))}
            className="p-2 text-ink/60 hover:text-green"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className="text-xs text-ink/40">{stock} in stock</span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            addItem({ productId, slug, name, image, price, stock }, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-300 active:scale-95 ${
            added ? "bg-green-700 text-white" : "bg-gold text-background hover:bg-gold-hover hover:shadow-lg"
          }`}
        >
          {added ? (
            <Check className="animate-scale-in h-4 w-4" />
          ) : (
            <ShoppingBag className="h-4 w-4" />
          )}
          {added ? "Added!" : "Add to Cart"}
        </button>
        <button
          onClick={() => {
            addItem({ productId, slug, name, image, price, stock }, qty);
            router.push("/cart");
          }}
          className="flex-1 rounded-full border border-gold px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold active:scale-95"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
