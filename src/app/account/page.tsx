import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { MapPin, Heart } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";
import LogoutButton from "@/components/LogoutButton";
import CancelOrderButton from "@/components/CancelOrderButton";

const CANCELLABLE_STATUSES = ["PENDING", "CONFIRMED"];

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AccountPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account");

  const orders = await prisma.order.findMany({
    where: { userId: session.sub },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-ink">My Account</h1>
          <p className="mt-1 text-sm text-ink/60">{session.name} · {session.email}</p>
        </div>
        <LogoutButton className="rounded-full border border-gold px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold hover:text-background" />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/account/addresses"
          className="flex items-center gap-2 rounded-full border border-gold/30 bg-white px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
        >
          <MapPin className="h-4 w-4" /> Saved Addresses
        </Link>
        <Link
          href="/account/wishlist"
          className="flex items-center gap-2 rounded-full border border-gold/30 bg-white px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
        >
          <Heart className="h-4 w-4" /> Wishlist
        </Link>
      </div>

      <h2 className="mt-10 mb-4 font-serif text-xl font-semibold text-ink">Order History</h2>

      {orders.length === 0 ? (
        <div className="rounded-xl border border-gold/15 bg-white p-10 text-center text-ink/60">
          You haven&rsquo;t placed any orders yet.
          <div className="mt-4">
            <Link href="/shop" className="text-green hover:underline">
              Start shopping →
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-gold/15 bg-white p-5 transition hover:shadow-md"
            >
              <Link href={`/order/${order.id}`} className="block">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">#{order.orderNumber}</p>
                    <p className="text-xs text-ink/50">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {order.items.slice(0, 4).map((item) => (
                    <div key={item.id} className="relative h-12 w-10 overflow-hidden rounded bg-ivory">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill sizes="2.5rem" className="object-cover" />
                      )}
                    </div>
                  ))}
                  <p className="ml-auto text-sm font-semibold text-green">
                    {formatINR(order.total)}
                  </p>
                </div>
              </Link>
              {CANCELLABLE_STATUSES.includes(order.status) && (
                <div className="mt-3 border-t border-gold/10 pt-3">
                  <CancelOrderButton orderId={order.id} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
