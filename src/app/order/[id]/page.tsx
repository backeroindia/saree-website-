import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { formatINR } from "@/lib/money";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Order Placed",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect(`/login?next=/order/${id}`);

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true },
  });

  if (!order) notFound();
  if (order.userId !== session.sub && session.role !== "ADMIN") notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <CheckCircle2 className="h-14 w-14 text-green-600" />
        <h1 className="mt-4 font-serif text-3xl font-bold text-ink">Thank you for your order!</h1>
        <p className="mt-2 text-ink/60">
          Order <span className="font-medium text-ink">#{order.orderNumber}</span> has been placed successfully.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-gold/15 bg-white p-6">
        <div className="flex items-center justify-between border-b border-gold/15 pb-4">
          <div>
            <p className="text-xs text-ink/40">Order Status</p>
            <p className="font-semibold text-green">{STATUS_LABEL[order.status]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink/40">Payment</p>
            <p className="font-medium">
              {order.paymentMethod === "COD" ? "Cash on Delivery" : "Paid Online"}
            </p>
          </div>
        </div>

        <ul className="divide-y divide-gold/10">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-4 py-4">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-ivory">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="4rem" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink/50">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-ink">
                  {formatINR(item.price * item.quantity)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="space-y-1 border-t border-gold/15 pt-4 text-sm">
          <div className="flex justify-between text-ink/70">
            <span>Subtotal</span>
            <span>{formatINR(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink/70">
            <span>Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatINR(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-semibold text-ink">
            <span>Total</span>
            <span>{formatINR(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-gold/15 bg-white p-6">
        <h2 className="font-serif text-lg font-semibold text-ink">Shipping Address</h2>
        <p className="mt-2 text-sm text-ink/70">
          {order.address.fullName}<br />
          {order.address.line1}
          {order.address.line2 && <>, {order.address.line2}</>}<br />
          {order.address.city}, {order.address.state} - {order.address.pincode}<br />
          Phone: {order.address.phone}
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/account"
          className="rounded-full border border-gold px-6 py-3 text-sm font-semibold text-green-dark hover:bg-gold"
        >
          View My Orders
        </Link>
        <Link
          href="/shop"
          className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-green-dark hover:bg-gold-hover"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
