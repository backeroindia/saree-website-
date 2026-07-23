import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

const addressSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(8).max(15),
  line1: z.string().trim().min(3),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(2),
  state: z.string().trim().min(2),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1, "Your cart is empty"),
  address: addressSchema.optional(),
  addressId: z.string().optional(),
  guestEmail: z.string().trim().email().optional(),
  paymentMethod: z.enum(["COD", "RAZORPAY"]),
  notes: z.string().trim().optional(),
  couponCode: z.string().trim().optional(),
});

function generateOrderNumber() {
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `PN${Date.now().toString().slice(-8)}${rand}`;
}

export async function POST(req: NextRequest) {
  const { allowed, retryAfterSeconds } = checkRateLimit(req, "checkout", {
    limit: 20,
    windowMs: 10 * 60 * 1000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
  }

  const session = await getSession();

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order data" },
      { status: 400 }
    );
  }

  const { items, address, addressId, guestEmail, paymentMethod, notes, couponCode } = parsed.data;

  if (!session && !guestEmail) {
    return NextResponse.json(
      { error: "Please provide an email address to continue as a guest" },
      { status: 400 }
    );
  }
  if (!session && !address) {
    return NextResponse.json({ error: "Please provide a shipping address" }, { status: 400 });
  }
  if (addressId && !session) {
    return NextResponse.json({ error: "Saved addresses require an account" }, { status: 400 });
  }

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

  let discount = 0;
  let coupon: Awaited<ReturnType<typeof prisma.coupon.findUnique>> = null;
  if (couponCode) {
    coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
    if (!coupon || !coupon.active) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
    }
    if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 });
    }
    if (subtotal < coupon.minOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value for this coupon is ${(coupon.minOrderValue / 100).toFixed(0)} INR` },
        { status: 400 }
      );
    }
    discount =
      coupon.type === "PERCENT"
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value;
    discount = Math.min(discount, subtotal);
  }

  const shipping = subtotal >= 199900 ? 0 : 9900;
  const total = subtotal - discount + shipping;

  try {
    const order = await prisma.$transaction(async (tx) => {
      let resolvedAddressId: string;
      if (addressId) {
        const existing = await tx.address.findFirst({
          where: { id: addressId, userId: session!.sub },
        });
        if (!existing) throw new Error("ADDRESS_NOT_FOUND");
        resolvedAddressId = existing.id;
      } else {
        const createdAddress = await tx.address.create({
          data: { ...address!, userId: session?.sub },
        });
        resolvedAddressId = createdAddress.id;
      }

      if (coupon) {
        const couponUpdate = await tx.coupon.updateMany({
          where: {
            id: coupon.id,
            ...(coupon.maxUses !== null ? { usedCount: { lt: coupon.maxUses } } : {}),
          },
          data: { usedCount: { increment: 1 } },
        });
        if (couponUpdate.count === 0) throw new Error("COUPON_EXHAUSTED");
      }

      const createdOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session?.sub,
          guestName: !session ? address?.fullName : undefined,
          guestEmail: !session ? guestEmail : undefined,
          addressId: resolvedAddressId,
          subtotal,
          discount,
          couponId: coupon?.id,
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
        const result = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          const product = productMap.get(item.productId)!;
          throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
        }
      }

      return createdOrder;
    });

    const recipientEmail = session?.email ?? guestEmail!;
    const recipientName = session?.name ?? address?.fullName ?? "there";
    sendOrderConfirmationEmail({
      to: recipientEmail,
      customerName: recipientName,
      orderNumber: order.orderNumber,
      orderId: order.id,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      total: order.total,
      paymentMethod: order.paymentMethod,
    }).catch(() => {});

    return NextResponse.json({ order: { id: order.id, orderNumber: order.orderNumber } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.startsWith("INSUFFICIENT_STOCK:")) {
      return NextResponse.json(
        { error: `Sorry, "${message.split(":")[1]}" just sold out. Please update your cart.` },
        { status: 409 }
      );
    }
    if (message === "COUPON_EXHAUSTED") {
      return NextResponse.json({ error: "This coupon just reached its usage limit" }, { status: 409 });
    }
    if (message === "ADDRESS_NOT_FOUND") {
      return NextResponse.json({ error: "Selected address not found" }, { status: 400 });
    }
    console.error("[checkout] failed:", err);
    return NextResponse.json({ error: "Something went wrong placing your order" }, { status: 500 });
  }
}
