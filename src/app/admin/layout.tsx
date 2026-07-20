import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Mail, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") redirect("/");

  const unreadCount = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <aside className="hidden w-56 shrink-0 md:block">
        <div className="sticky top-24 rounded-xl border border-gold/15 bg-white p-4">
          <p className="px-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
            Admin Panel
          </p>
          <nav className="mt-3 space-y-1">
            <Link
              href="/admin"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <Link
              href="/admin/products"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
            >
              <Package className="h-4 w-4" /> Products
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
            >
              <ShoppingCart className="h-4 w-4" /> Orders
            </Link>
            <Link
              href="/admin/messages"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
            >
              <Mail className="h-4 w-4" /> Messages
              {unreadCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold text-green-dark">
                  {unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/"
              className="mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/50 transition-colors hover:bg-gold/10 hover:text-green"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Store
            </Link>
          </nav>
        </div>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
