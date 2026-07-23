"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Something went wrong");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  }

  if (!token) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-bold text-ink">Invalid Link</h1>
        <p className="mt-2 text-sm text-ink/60">This password reset link is missing a token.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-green hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="animate-fade-in-up mx-auto max-w-md px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-2xl font-bold text-ink">Password Reset</h1>
        <p className="mt-2 text-sm text-ink/60">Your password has been updated. Redirecting to sign in…</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up mx-auto max-w-md px-4 py-16 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-ink">Reset Password</h1>
      <p className="mt-1 text-sm text-ink/60">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          required
          type="password"
          minLength={6}
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Confirm New Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-lg border border-gold/30 px-3 py-2.5 text-sm outline-none focus:border-gold"
        />
        {error && <p className="animate-fade-in-up text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-green-dark transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95 disabled:opacity-60"
        >
          {submitting ? "Saving…" : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
