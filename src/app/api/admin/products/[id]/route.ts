import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { ensureAdmin } from "@/lib/admin-guard";

const schema = z.object({
  name: z.string().trim().min(3),
  slug: z
    .string()
    .trim()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers and hyphens"),
  description: z.string().trim().min(10),
  fabric: z.string().trim().min(2),
  color: z.string().trim().min(2),
  price: z.number().int().min(1),
  compareAtPrice: z.number().int().min(1).nullable().optional(),
  stock: z.number().int().min(0),
  images: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
  categoryId: z.string().min(1),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await ensureAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product data" },
      { status: 400 }
    );
  }

  const conflicting = await prisma.product.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (conflicting) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      images: JSON.stringify(parsed.data.images),
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await ensureAdmin();
  if (response) return response;

  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    return NextResponse.json(
      { error: "This product has existing orders and cannot be deleted." },
      { status: 409 }
    );
  }
  return NextResponse.json({ ok: true });
}
