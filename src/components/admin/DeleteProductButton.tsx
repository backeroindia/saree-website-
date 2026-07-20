"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-end gap-2">
      {error && <span className="text-xs text-red-600">{error}</span>}
      <button
        disabled={isPending}
        onClick={() => {
          if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
          setError(null);
          startTransition(async () => {
            const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              setError(data.error ?? "Failed to delete");
              return;
            }
            router.refresh();
          });
        }}
        className="rounded-full p-2 text-ink/40 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
        aria-label={`Delete ${name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
