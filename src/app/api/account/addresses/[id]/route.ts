import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

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
  isDefault: z.boolean().optional(),
});

async function assertOwnership(id: string, userId: string) {
  const address = await prisma.address.findFirst({ where: { id, userId } });
  return address;
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await assertOwnership(id, session.sub);
  if (!existing) return NextResponse.json({ error: "Address not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = addressSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid address" },
      { status: 400 }
    );
  }

  const { isDefault, ...data } = parsed.data;

  const address = await prisma.$transaction(async (tx) => {
    if (isDefault) {
      await tx.address.updateMany({
        where: { userId: session.sub },
        data: { isDefault: false },
      });
    }
    return tx.address.update({
      where: { id },
      data: { ...data, ...(isDefault !== undefined ? { isDefault } : {}) },
    });
  });

  return NextResponse.json({ address });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await assertOwnership(id, session.sub);
  if (!existing) return NextResponse.json({ error: "Address not found" }, { status: 404 });

  try {
    await prisma.address.delete({ where: { id } });
  } catch {
    return NextResponse.json(
      { error: "This address is linked to a past order and can't be deleted" },
      { status: 409 }
    );
  }
  return NextResponse.json({ success: true });
}
