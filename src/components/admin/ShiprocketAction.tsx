"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Truck, ExternalLink } from "lucide-react";

export default function ShiprocketAction({
  orderId,
  enabled,
  shiprocketOrderId,
}: {
  orderId: string;
  enabled: boolean;
  shiprocketOrderId: string | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!enabled) {
    return (
      <span className="text-xs text-ink/30" title="Add SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD and SHIPROCKET_PICKUP_LOCATION to .env to enable">
        Not configured
      </span>
    );
  }

  if (shiprocketOrderId) {
    return (
      <a
        href={`https://app.shiprocket.in/seller/orders/details/${shiprocketOrderId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs font-medium text-green hover:underline"
      >
        <Truck className="h-3.5 w-3.5" /> Shipped <ExternalLink className="h-3 w-3" />
      </a>
    );
  }

  async function handleShip() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/admin/orders/${orderId}/shiprocket`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Failed to ship");
      setLoading(false);
      return;
    }
    router.refresh();
  }

  return (
    <div>
      <button
        onClick={handleShip}
        disabled={loading}
        className="flex items-center gap-1 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-medium text-ink/70 transition-colors hover:bg-gold/10 hover:text-green disabled:opacity-60"
      >
        <Truck className="h-3.5 w-3.5" /> {loading ? "Shipping…" : "Ship via Shiprocket"}
      </button>
      {error && <p className="mt-1 max-w-[180px] text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
