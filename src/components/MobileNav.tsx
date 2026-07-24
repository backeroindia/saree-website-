"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

type Category = { id: string; name: string; slug: string };
type SpecialNavItem = { label: string; slug: string; active: boolean };
type SessionInfo = { name: string; role: "CUSTOMER" | "ADMIN" } | null;

export default function MobileNav({
  categories,
  specialNav,
  session,
}: {
  categories: Category[];
  specialNav: SpecialNavItem[];
  session: SessionInfo;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawer = (
    <>
      <div
        className={`fixed inset-0 z-50 bg-green-dark/50 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 w-72 max-w-[85vw] transform overflow-y-auto bg-background p-6 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-serif text-lg font-bold text-green">Menu</span>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="text-ink/60 hover:text-green">
            <X className="h-5 w-5" />
          </button>
        </div>

        {session && (
          <p className="mt-4 text-sm text-ink/60">
            Signed in as <span className="font-medium text-ink">{session.name}</span>
          </p>
        )}

        <nav className="mt-6 flex flex-col gap-1 text-sm font-medium text-ink/80">
          <Link href="/shop?sort=newest" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green">
            New Arrivals
          </Link>
          <Link href="/shop" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green">
            Saree
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shop?category=${c.slug}`}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 pl-5 text-xs text-ink/60 transition-colors hover:bg-gold/10 hover:text-green"
            >
              {c.name}
            </Link>
          ))}
          {specialNav.map((item) =>
            item.active ? (
              <Link
                key={item.slug}
                href={`/shop?category=${item.slug}`}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green"
              >
                {item.label}
              </Link>
            ) : (
              <span key={item.slug} className="flex cursor-not-allowed items-center justify-between rounded-lg px-2 py-2.5 text-ink/35">
                {item.label}
                <span className="rounded-full bg-ink/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide">Soon</span>
              </span>
            )
          )}
          <div className="my-2 border-t border-gold/15" />
          <Link href="/about" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green">
            About Us
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green">
            Contact Us
          </Link>
          <Link href="/faq" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green">
            FAQs
          </Link>
          <div className="my-2 border-t border-gold/15" />
          {session ? (
            <>
              <Link href="/account" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green">
                My Orders
              </Link>
              {session.role === "ADMIN" && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green"
                >
                  <ShieldCheck className="h-4 w-4" /> Admin Panel
                </Link>
              )}
              <LogoutButton className="rounded-lg px-2 py-2.5 text-left text-green transition-colors hover:bg-gold/10" />
            </>
          ) : (
            <Link href="/login" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green">
              Sign In
            </Link>
          )}
          <Link href="/cart" onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 transition-colors hover:bg-gold/10 hover:text-green">
            Cart
          </Link>
        </nav>
      </div>
    </>
  );

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="text-ink/80 transition hover:text-green"
      >
        <Menu className="h-6 w-6" />
      </button>

      {mounted && createPortal(drawer, document.body)}
    </div>
  );
}
