"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatINR } from "@/lib/money";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-2xl px-4 py-24 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-ink/20" />
        <h1 className="mt-4 font-serif text-2xl font-bold text-ink">Your cart is empty</h1>
        <p className="mt-2 text-ink/60">Add some sarees to get started.</p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-ink">Shopping Cart</h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item, i) => (
            <div
              key={item.productId}
              style={{ animationDelay: `${i * 60}ms` }}
              className="animate-fade-in-up flex gap-4 rounded-xl border border-gold/15 bg-white p-4 transition-shadow duration-300 hover:shadow-md sm:gap-5"
            >
              <Link
                href={`/product/${item.slug}`}
                className="group relative aspect-[3/4] w-28 shrink-0 overflow-hidden rounded-lg bg-ivory sm:w-36 md:w-40"
              >
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(min-width: 768px) 10rem, (min-width: 640px) 9rem, 7rem"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/product/${item.slug}`} className="text-sm font-medium text-ink hover:text-green">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-green">{formatINR(item.price)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border border-gold/30">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 text-ink/60 hover:text-green"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 text-ink/60 hover:text-green"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex items-center gap-1 text-xs text-ink/40 hover:text-green"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit rounded-xl border border-gold/15 bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-ink">Order Summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-gold/15 pt-2 text-base font-semibold text-ink">
              <span>Total</span>
              <span>{formatINR(subtotal + shipping)}</span>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-gold px-6 py-3 text-center text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95"
          >
            Proceed to Checkout
          </Link>
          <Link
            href="/shop"
            className="mt-3 block text-center text-sm text-ink/50 hover:text-green"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
