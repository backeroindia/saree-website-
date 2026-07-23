import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureAdmin } from "@/lib/admin-guard";

function csvEscape(value: string | number): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function GET() {
  const { response } = await ensureAdmin();
  if (response) return response;

  const orders = await prisma.order.findMany({
    include: { items: true, user: true, address: true },
    orderBy: { createdAt: "desc" },
  });

  const header = [
    "Order Number",
    "Date",
    "Customer",
    "Email",
    "Phone",
    "City",
    "State",
    "Pincode",
    "Items",
    "Payment Method",
    "Payment Status",
    "Status",
    "Subtotal (INR)",
    "Discount (INR)",
    "Shipping (INR)",
    "Total (INR)",
  ];

  const rows = orders.map((o) => [
    o.orderNumber,
    new Date(o.createdAt).toISOString().slice(0, 10),
    o.user?.name ?? o.guestName ?? "Guest",
    o.user?.email ?? o.guestEmail ?? "",
    o.address.phone,
    o.address.city,
    o.address.state,
    o.address.pincode,
    o.items.reduce((sum, i) => sum + i.quantity, 0),
    o.paymentMethod,
    o.paymentStatus,
    o.status,
    (o.subtotal / 100).toFixed(2),
    (o.discount / 100).toFixed(2),
    (o.shipping / 100).toFixed(2),
    (o.total / 100).toFixed(2),
  ]);

  const csv = [header, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
