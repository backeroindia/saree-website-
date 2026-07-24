import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureAdmin } from "@/lib/admin-guard";
import { createShiprocketShipment, isShiprocketConfigured } from "@/lib/shiprocket";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await ensureAdmin();
  if (response) return response;

  if (!isShiprocketConfigured()) {
    return NextResponse.json(
      {
        error:
          "Shiprocket is not configured. Add SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD and SHIPROCKET_PICKUP_LOCATION to .env to enable shipping.",
      },
      { status: 400 }
    );
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, address: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (order.shiprocketOrderId) {
    return NextResponse.json({ error: "Order already shipped via Shiprocket" }, { status: 400 });
  }

  try {
    const result = await createShiprocketShipment({
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      address: order.address,
      items: order.items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity })),
      subtotal: order.subtotal,
      paymentMethod: order.paymentMethod,
    });

    const updated = await prisma.order.update({
      where: { id },
      data: {
        shiprocketOrderId: result.shiprocketOrderId,
        shiprocketShipmentId: result.shiprocketShipmentId,
        shippedAt: new Date(),
        status: order.status === "PENDING" ? "CONFIRMED" : order.status,
      },
    });

    return NextResponse.json({ order: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Shiprocket request failed" },
      { status: 502 }
    );
  }
}
