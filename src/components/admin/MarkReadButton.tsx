"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function MarkReadButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await fetch(`/api/admin/messages/${id}`, { method: "PATCH" });
          router.refresh();
        });
      }}
      className="rounded-full border border-gold/30 px-3 py-1 text-xs font-medium text-green transition-all duration-200 hover:bg-gold/10 active:scale-95 disabled:opacity-50"
    >
      {isPending ? "…" : "Mark as read"}
    </button>
  );
}
