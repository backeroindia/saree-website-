"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Unable to sign in");
      setSubmitting(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="animate-fade-in-up mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-ink">Sign In</h1>
      <p className="mt-1 text-sm text-ink/60">Welcome back to N.INIYAZHL.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <div className="text-right">
          <Link href="/forgot-password" className="text-xs text-green hover:underline">
            Forgot password?
          </Link>
        </div>
        {error && <p className="animate-fade-in-up text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:active:scale-100"
        >
          {submitting ? "Signing in…" : "Sign In"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        New here?{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-medium text-green hover:underline">
          Create an account
        </Link>
      </p>

      <div className="mt-8 rounded-lg border border-gold/20 bg-white p-4 text-xs text-ink/50">
        <p className="font-medium text-ink/70">Demo accounts</p>
        <p className="mt-1">Admin: admin@saree.shop / admin123</p>
        <p>Customer: customer@example.com / customer123</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
