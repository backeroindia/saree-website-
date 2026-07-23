import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const schema = z.object({
  code: z.string().trim().min(1),
  subtotal: z.number().int().min(0),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { code, subtotal } = parsed.data;
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
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

  const discount =
    coupon.type === "PERCENT" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;

  return NextResponse.json({
    code: coupon.code,
    type: coupon.type,
    discount: Math.min(discount, subtotal),
  });
}
