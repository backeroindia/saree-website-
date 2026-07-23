import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="animate-fade-in-up mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="font-serif text-8xl font-bold text-gold/30">404</span>
      <h1 className="mt-2 font-serif text-2xl font-bold text-ink">
        This page has wandered off
      </h1>
      <p className="mt-3 text-ink/60">
        We couldn&rsquo;t find the page you were looking for. It may have been moved,
        or the link might be incorrect.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95"
        >
          <Home className="h-4 w-4" /> Back to Home
        </Link>
        <Link
          href="/shop"
          className="flex items-center gap-2 rounded-full border border-gold px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold active:scale-95"
        >
          <Search className="h-4 w-4" /> Browse Sarees
        </Link>
      </div>
    </div>
  );
}
