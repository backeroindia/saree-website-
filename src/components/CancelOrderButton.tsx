"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Cancel this order? This can't be undone.")) return;
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Could not cancel this order");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <button
        onClick={handleCancel}
        disabled={isPending}
        className="flex items-center gap-1 text-xs font-medium text-red-600 hover:underline disabled:opacity-50"
      >
        <X className="h-3.5 w-3.5" /> {isPending ? "Cancelling…" : "Cancel Order"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
