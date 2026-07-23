"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ProductDescription({ description }: { description: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-6 rounded-lg border border-gold/15 bg-white">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-ink">Description</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-green transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 leading-relaxed text-ink/70">{description}</p>
        </div>
      </div>
    </div>
  );
}
