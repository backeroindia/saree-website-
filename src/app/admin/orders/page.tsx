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
      <h1 className="font-serif text-3xl font-bold text-ink">Orders</h1>

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
                  <p className="text-ink">{o.user.name}</p>
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
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink/50">
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
