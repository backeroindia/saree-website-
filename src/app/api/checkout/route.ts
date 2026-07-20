import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Your cart is empty"),
  address: z.object({
    fullName: z.string().trim().min(2),
    phone: z.string().trim().min(8).max(15),
    line1: z.string().trim().min(3),
    line2: z.string().trim().optional(),
    city: z.string().trim().min(2),
    state: z.string().trim().min(2),
    pincode: z.string().trim().min(4).max(10),
  }),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  notes: z.string().trim().optional(),
});

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PN${Date.now().toString().slice(-8)}${rand}`;
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please sign in to place an order" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order data" },
      { status: 400 }
    );
  }

  const { items, address, paymentMethod, notes } = parsed.data;

  if (paymentMethod === "RAZORPAY") {
    return NextResponse.json(
      { error: "Online payment is not configured yet. Please choose Cash on Delivery." },
      { status: 400 }
    );
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: "One of the products no longer exists" }, { status: 400 });
    }
    if (product.stock < item.quantity) {
      return NextResponse.json(
        { error: `Only ${product.stock} left in stock for "${product.name}"` },
        { status: 400 }
      );
    }
  }

  const subtotal = items.reduce((sum, item) => {
    const product = productMap.get(item.productId)!;
    return sum + product.price * item.quantity;
  }, 0);
  const shipping = subtotal >= 199900 ? 0 : 9900;
  const total = subtotal + shipping;

  const order = await prisma.$transaction(async (tx) => {
    const createdAddress = await tx.address.create({
      data: { ...address, userId: session.sub },
    });

    const createdOrder = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.sub,
        addressId: createdAddress.id,
        subtotal,
        shipping,
        total,
        paymentMethod,
        notes,
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.productId)!;
            const images = JSON.parse(product.images) as string[];
            return {
              productId: product.id,
              name: product.name,
              image: images[0] ?? "",
              price: product.price,
              quantity: item.quantity,
            };
          }),
        },
      },
      include: { items: true },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return createdOrder;
  });

  return NextResponse.json({ order: { id: order.id, orderNumber: order.orderNumber } });
}
