import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, User, Search, ShieldCheck } from "lucide-react";
import { getSession } from "@/lib/auth";
import { getCategories } from "@/lib/products";
import CartBadge from "@/components/CartBadge";
import LogoutButton from "@/components/LogoutButton";
import MobileNav from "@/components/MobileNav";

export default async function Header() {
  const [session, categories] = await Promise.all([
    getSession(),
    getCategories(),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-background/95 backdrop-blur">
      <div className="overflow-hidden bg-green py-2 text-xs tracking-wide text-ivory sm:text-sm">
        <div className="animate-marquee flex w-max gap-16 whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex items-center gap-16 px-4">
              <span>Free shipping across India on orders above ₹1,999</span>
              <span className="text-background font-semibold">Cash on Delivery available</span>
              <span>Handwoven, sourced with care</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 transition-transform duration-300 hover:scale-[1.02]">
          <Image
            src="/brand/logo-circle.png"
            alt="N.INIYAZHL"
            width={44}
            height={44}
            priority
            className="h-10 w-10 shrink-0 rounded-full object-contain"
          />
          <span>
            <span className="block font-serif text-2xl font-bold tracking-tight text-green">
              N.<span className="text-gold transition-colors group-hover:text-gold-hover">INIYAZHL</span>
            </span>
            <span className="block text-[10px] uppercase tracking-[0.3em] text-ink/50">
              Handloom &amp; Silk Sarees
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-ink/80 md:flex">
          <Link href="/shop" className="relative py-1 transition-colors hover:text-green after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full">
            All Sarees
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              className="relative py-1 transition-colors hover:text-green after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full"
            >
              {c.name}
            </Link>
          ))}
          <Link href="/about" className="relative py-1 transition-colors hover:text-green after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-gold after:transition-all after:duration-300 hover:after:w-full">
            About
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <form action="/shop" className="hidden items-center sm:flex">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
              <input
                type="text"
                name="search"
                placeholder="Search sarees..."
                className="w-48 rounded-full border border-gold/30 bg-white py-2 pl-9 pr-3 text-sm outline-none transition-all focus:w-64 focus:border-gold lg:w-64"
              />
            </div>
          </form>

          {session ? (
            <div className="group relative hidden md:block">
              <button className="flex items-center gap-1 text-ink/80 transition-colors hover:text-green">
                <User className="h-5 w-5" />
                <span className="hidden text-sm lg:inline">{session.name.split(" ")[0]}</span>
              </button>
              <div className="invisible absolute right-0 top-full w-48 origin-top-right scale-95 rounded-lg border border-gold/20 bg-white p-2 opacity-0 shadow-lg transition duration-200 group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                <Link
                  href="/account"
                  className="block rounded px-3 py-2 text-sm transition-colors hover:bg-gold/10 hover:text-green"
                >
                  My Orders
                </Link>
                {session.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 rounded px-3 py-2 text-sm transition-colors hover:bg-gold/10 hover:text-green"
                  >
                    <ShieldCheck className="h-4 w-4" /> Admin Panel
                  </Link>
                )}
                <LogoutButton className="block w-full rounded px-3 py-2 text-left text-sm text-green hover:bg-gold/10" />
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden items-center gap-1 text-ink/80 transition-colors hover:text-green md:flex">
              <User className="h-5 w-5" />
              <span className="hidden text-sm lg:inline">Sign in</span>
            </Link>
          )}

          <Link href="/cart" className="relative text-ink/80 transition-colors hover:text-green">
            <ShoppingBag className="h-5 w-5" />
            <CartBadge />
          </Link>

          <MobileNav
            categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug }))}
            session={session ? { name: session.name, role: session.role } : null}
          />
        </div>
      </div>
    </header>
  );
}
