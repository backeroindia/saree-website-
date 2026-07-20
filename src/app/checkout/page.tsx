"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import { formatINR } from "@/lib/money";

type Session = { id: string; name: string; email: string } | null;

const RAZORPAY_ENABLED = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clear = useCartStore((s) => s.clear);

  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<Session>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "RAZORPAY">("COD");
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    setMounted(true);
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setSession(data.user);
        if (data.user?.name) {
          setForm((f) => ({ ...f, fullName: data.user.name }));
        }
      })
      .finally(() => setCheckingSession(false));
  }, []);

  if (!mounted || checkingSession) return null;

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink">Sign in to checkout</h1>
        <p className="mt-2 text-ink/60">
          Please sign in or create an account to place your order.
        </p>
        <Link
          href="/login?next=/checkout"
          className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-green-dark hover:bg-gold-hover"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-serif text-2xl font-bold text-ink">Your cart is empty</h1>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-green-dark hover:bg-gold-hover"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= 199900 ? 0 : 9900;
  const total = subtotal + shipping;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          address: form,
          paymentMethod,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/order/${data.order.id}`);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl font-bold text-ink">Checkout</h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-gold/15 bg-white p-6">
            <h2 className="font-serif text-lg font-semibold text-ink">Shipping Address</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2"
              />
              <input
                required
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2"
              />
              <input
                required
                placeholder="Address Line 1"
                value={form.line1}
                onChange={(e) => setForm({ ...form, line1: e.target.value })}
                className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2"
              />
              <input
                placeholder="Address Line 2 (optional)"
                value={form.line2}
                onChange={(e) => setForm({ ...form, line2: e.target.value })}
                className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2"
              />
              <input
                required
                placeholder="City"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                required
                placeholder="State"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
              />
              <input
                required
                placeholder="Pincode"
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                className="rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold sm:col-span-2"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gold/15 bg-white p-6">
            <h2 className="font-serif text-lg font-semibold text-ink">Payment Method</h2>
            <div className="mt-4 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gold/30 p-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <div>
                  <p className="text-sm font-medium">Cash on Delivery</p>
                  <p className="text-xs text-ink/50">Pay in cash when your order arrives</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 rounded-lg border border-gold/30 p-3 ${
                  RAZORPAY_ENABLED ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  disabled={!RAZORPAY_ENABLED}
                  checked={paymentMethod === "RAZORPAY"}
                  onChange={() => setPaymentMethod("RAZORPAY")}
                />
                <div>
                  <p className="text-sm font-medium">Pay Online (UPI / Card / Netbanking)</p>
                  <p className="text-xs text-ink/50">
                    {RAZORPAY_ENABLED ? "Powered by Razorpay" : "Coming soon"}
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="h-fit space-y-4 rounded-xl border border-gold/15 bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-ink">Order Summary</h2>
          <ul className="space-y-2 text-sm text-ink/70">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between">
                <span className="line-clamp-1 pr-2">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0">{formatINR(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-gold/15 pt-3 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-ink">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>
          {error && <p className="animate-fade-in-up text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-green-dark transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:active:scale-100"
          >
            {submitting ? "Placing Order…" : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
