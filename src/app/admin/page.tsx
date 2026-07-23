import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";

const LOW_STOCK_THRESHOLD = 5;

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount, revenueAgg, recentOrders, lowStockProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
      prisma.product.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        orderBy: { stock: "asc" },
        select: { id: true, name: true, stock: true },
      }),
    ]);

  const stats = [
    { label: "Total Products", value: productCount },
    { label: "Total Orders", value: orderCount },
    { label: "Pending Orders", value: pendingCount },
    { label: "Total Revenue", value: formatINR(revenueAgg._sum.total ?? 0) },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-ink">Dashboard</h1>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gold/15 bg-white p-5">
            <p className="text-xs text-ink/50">{s.label}</p>
            <p className="mt-1 text-2xl font-semibold text-green">{s.value}</p>
          </div>
        ))}
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="font-serif text-lg font-semibold text-ink">Low Stock Alert</h2>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm">
            {lowStockProducts.map((p) => (
              <li key={p.id} className="flex items-center justify-between">
                <Link href={`/admin/products/${p.id}/edit`} className="text-ink/80 hover:text-green hover:underline">
                  {p.name}
                </Link>
                <span className={p.stock === 0 ? "font-medium text-red-600" : "font-medium text-amber-700"}>
                  {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-gold/15 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-green hover:underline">
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-ink/50">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="border-b border-gold/15 text-left text-ink/40">
                  <th className="pb-2 font-medium">Order</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-b border-gold/10 last:border-0">
                    <td className="py-2">
                      <Link href={`/admin/orders`} className="text-green hover:underline">
                        #{o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-2 whitespace-nowrap">{o.user?.name ?? o.guestName ?? "Guest"}</td>
                    <td className="py-2 whitespace-nowrap">{o.status}</td>
                    <td className="py-2 text-right whitespace-nowrap">{formatINR(o.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
