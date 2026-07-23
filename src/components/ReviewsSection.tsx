"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import clsx from "clsx";
import StarRating from "@/components/StarRating";

type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
};

export default function ReviewsSection({
  productId,
  reviews,
  averageRating,
}: {
  productId: string;
  reviews: Review[];
  averageRating: number;
}) {
  const router = useRouter();
  const [session, setSession] = useState<{ id: string; name: string } | null | undefined>(undefined);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => setSession(data.user ?? null));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await res.json().catch(() => ({}));
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? "Could not submit review");
      return;
    }
    setComment("");
    router.refresh();
  }

  return (
    <section className="mt-16">
      <div className="flex items-center gap-3">
        <h2 className="font-serif text-2xl font-bold text-ink">Reviews</h2>
        {reviews.length > 0 && <StarRating rating={averageRating} count={reviews.length} size="md" />}
      </div>

      {session === undefined ? null : session ? (
        <form onSubmit={handleSubmit} className="mt-6 max-w-lg rounded-xl border border-gold/15 bg-white p-5">
          <p className="text-sm font-medium text-ink">Write a review</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className="p-0.5"
                aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
              >
                <Star className={clsx("h-5 w-5", n <= rating ? "fill-gold text-gold" : "fill-none text-ink/20")} />
              </button>
            ))}
          </div>
          <textarea
            required
            minLength={3}
            rows={3}
            placeholder="Share your experience with this saree..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="mt-3 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm outline-none focus:border-gold"
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-background transition-all hover:bg-gold-hover disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Review"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-ink/60">
          <a href="/login" className="text-green hover:underline">
            Sign in
          </a>{" "}
          to write a review.
        </p>
      )}

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-sm text-ink/50">No reviews yet. Be the first to review this saree.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="rounded-xl border border-gold/15 bg-white p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-ink">{r.user.name}</p>
                <StarRating rating={r.rating} />
              </div>
              <p className="mt-2 text-sm text-ink/70">{r.comment}</p>
              <p className="mt-2 text-xs text-ink/40">
                {new Date(r.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
