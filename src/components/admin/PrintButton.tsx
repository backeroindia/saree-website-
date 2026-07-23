"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-green-dark transition-all hover:bg-gold-hover"
    >
      <Printer className="h-4 w-4" /> Print / Save as PDF
    </button>
  );
}
