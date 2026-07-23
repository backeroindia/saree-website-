import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ensureAdmin } from "@/lib/admin-guard";

const schema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .regex(/^[A-Za-z0-9]+$/, "Code must be letters/numbers only")
    .transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENT", "FLAT"]),
  value: z.number().int().min(1),
  minOrderValue: z.number().int().min(0).optional(),
  maxUses: z.number().int().min(1).nullable().optional(),
  expiresAt: z.string().trim().optional().nullable(),
  active: z.boolean().optional(),
});

export async function GET() {
  const { response } = await ensureAdmin();
  if (response) return response;

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ coupons });
}

export async function POST(req: NextRequest) {
  const { response } = await ensureAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid coupon data" },
      { status: 400 }
    );
  }

  const existing = await prisma.coupon.findUnique({ where: { code: parsed.data.code } });
  if (existing) {
    return NextResponse.json({ error: "A coupon with this code already exists" }, { status: 409 });
  }

  if (parsed.data.type === "PERCENT" && parsed.data.value > 100) {
    return NextResponse.json({ error: "Percent discount cannot exceed 100" }, { status: 400 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: parsed.data.code,
      type: parsed.data.type,
      value: parsed.data.value,
      minOrderValue: parsed.data.minOrderValue ?? 0,
      maxUses: parsed.data.maxUses ?? null,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      active: parsed.data.active ?? true,
    },
  });

  return NextResponse.json({ coupon });
}
