"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    setMessage(data.message);
  }

  return (
    <div className="animate-fade-in-up mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-ink">Forgot Password</h1>
      <p className="mt-1 text-sm text-ink/60">
        Enter your email and we&rsquo;ll send you a link to reset your password.
      </p>

      {message ? (
        <p className="mt-8 rounded-lg border border-gold/20 bg-white p-4 text-sm text-ink/70">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          {error && <p className="animate-fade-in-up text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-green-dark transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95 disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink/60">
        <Link href="/login" className="font-medium text-green hover:underline">
          Back to Sign In
        </Link>
      </p>
    </div>
  );
}
