import Link from "next/link";
import { Download, Receipt } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true, user: true, address: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-ink">Orders</h1>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- file download, not a page navigation */}
        <a
          href="/api/admin/orders/export"
          className="flex items-center gap-2 rounded-full border border-gold/30 px-4 py-2 text-sm font-medium text-ink/80 transition-colors hover:bg-gold/10 hover:text-green"
        >
          <Download className="h-4 w-4" /> Export CSV
        </a>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-gold/15 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-left text-ink/40">
              <th className="p-4 font-medium">Order</th>
              <th className="p-4 font-medium">Customer</th>
              <th className="p-4 font-medium">Items</th>
              <th className="p-4 font-medium">Payment</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-gold/10 last:border-0 align-top">
                <td className="p-4">
                  <p className="font-medium text-ink">#{o.orderNumber}</p>
                  <p className="text-xs text-ink/40">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </td>
                <td className="p-4">
                  <p className="text-ink">
                    {o.user?.name ?? o.guestName ?? "Guest"}
                    {!o.user && (
                      <span className="ml-1.5 rounded-full bg-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-green-dark">
                        Guest
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-ink/40">{o.address.city}, {o.address.state}</p>
                </td>
                <td className="p-4 text-ink/70">{o.items.length} item(s)</td>
                <td className="p-4 text-ink/70">
                  {o.paymentMethod === "COD" ? "COD" : "Online"}
                </td>
                <td className="p-4 font-medium text-ink">{formatINR(o.total)}</td>
                <td className="p-4">
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </td>
                <td className="p-4">
                  <Link
                    href={`/admin/orders/${o.id}/invoice`}
                    className="flex items-center gap-1 text-xs font-medium text-green hover:underline"
                  >
                    <Receipt className="h-3.5 w-3.5" /> Invoice
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-ink/50">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
