import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount, revenueAgg, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: true },
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
                  <td className="py-2">{o.user.name}</td>
                  <td className="py-2">{o.status}</td>
                  <td className="py-2 text-right">{formatINR(o.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
