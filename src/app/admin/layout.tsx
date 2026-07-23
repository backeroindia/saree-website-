import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Mail, Tag, Users, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  if (session.role !== "ADMIN") redirect("/");

  const unreadCount = await prisma.contactMessage.count({ where: { read: false } });

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
    {
      href: "/admin/messages",
      label: "Messages",
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { href: "/admin/coupons", label: "Coupons", icon: Tag },
    { href: "/admin/customers", label: "Customers", icon: Users },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 print:p-0">
      <nav className="mb-6 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:hidden print:hidden">
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/20 bg-white px-4 py-2 text-sm text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
          >
            <item.icon className="h-4 w-4" /> {item.label}
            {item.badge !== undefined && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold text-green-dark">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-gold/20 bg-white px-4 py-2 text-sm text-ink/50 transition-colors hover:bg-gold/10 hover:text-green"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>
      </nav>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 md:block print:hidden">
          <div className="sticky top-24 rounded-xl border border-gold/15 bg-white p-4">
            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
              Admin Panel
            </p>
            <nav className="mt-3 space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
                >
                  <item.icon className="h-4 w-4" /> {item.label}
                  {item.badge !== undefined && (
                    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[11px] font-semibold text-green-dark">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
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
    </div>
  );
}
