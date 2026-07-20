import type { ReactNode } from "react";

export default function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="animate-fade-in-up mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">N.INIYAZHL</p>
      <h1 className="mt-2 font-serif text-4xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink/50">Last updated: {updated}</p>

      <div className="mt-10 space-y-8 [&_h2]:font-serif [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-ink/70 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_ul]:text-ink/70 [&_li]:leading-relaxed">
        {children}
      </div>
    </div>
  );
}
