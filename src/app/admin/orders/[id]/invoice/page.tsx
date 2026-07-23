import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatINR } from "@/lib/money";
import PrintButton from "@/components/admin/PrintButton";

export default async function OrderInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, user: true, address: true },
  });
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="print:hidden mb-6 flex items-center justify-between">
        <Link href="/admin/orders" className="flex items-center gap-1 text-sm text-ink/50 hover:text-green">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
        <PrintButton />
      </div>

      <div className="rounded-xl border border-gold/15 bg-white p-8 print:border-0 print:p-0 print:shadow-none">
        <div className="flex items-start justify-between border-b border-gold/15 pb-6">
          <div>
            <p className="font-serif text-2xl font-bold text-green">
              N.<span className="text-gold">INIYAZHL</span>
            </p>
            <p className="mt-1 text-xs text-ink/50">Handloom &amp; Silk Sarees</p>
            <p className="text-xs text-ink/50">support@iniyazhl.shop</p>
          </div>
          <div className="text-right">
            <h1 className="font-serif text-xl font-bold text-ink">Invoice</h1>
            <p className="mt-1 text-sm text-ink/60">#{order.orderNumber}</p>
            <p className="text-xs text-ink/40">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Billed To</p>
            <p className="mt-1 font-medium text-ink">{order.user?.name ?? order.guestName ?? "Guest"}</p>
            <p className="text-ink/60">{order.user?.email ?? order.guestEmail}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink/40">Ship To</p>
            <p className="mt-1 text-ink/70">
              {order.address.fullName}<br />
              {order.address.line1}{order.address.line2 && `, ${order.address.line2}`}<br />
              {order.address.city}, {order.address.state} - {order.address.pincode}<br />
              Phone: {order.address.phone}
            </p>
          </div>
        </div>

        <table className="mt-8 w-full text-sm">
          <thead>
            <tr className="border-b border-gold/15 text-left text-ink/40">
              <th className="pb-2 font-medium">Item</th>
              <th className="pb-2 text-right font-medium">Qty</th>
              <th className="pb-2 text-right font-medium">Price</th>
              <th className="pb-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b border-gold/10">
                <td className="py-2 text-ink">{item.name}</td>
                <td className="py-2 text-right text-ink/70">{item.quantity}</td>
                <td className="py-2 text-right text-ink/70">{formatINR(item.price)}</td>
                <td className="py-2 text-right font-medium text-ink">{formatINR(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end">
          <div className="w-56 space-y-1.5 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green">
                <span>Discount</span>
                <span>-{formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink/70">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-gold/15 pt-1.5 text-base font-semibold text-ink">
              <span>Total</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gold/15 pt-4 text-xs text-ink/50">
          <p>Payment method: {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}</p>
          <p className="mt-1">Thank you for shopping with N.INIYAZHL.</p>
        </div>
      </div>
    </div>
  );
}
