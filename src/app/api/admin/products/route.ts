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
  images: z.array(z.string()).min(1, "Add at least one image"),
  featured: z.boolean().optional(),
  categoryId: z.string().min(1),
});

export async function GET() {
  const { response } = await ensureAdmin();
  if (response) return response;

  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const { response } = await ensureAdmin();
  if (response) return response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid product data" },
      { status: 400 }
    );
  }

  const existing = await prisma.product.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) {
    return NextResponse.json({ error: "A product with this slug already exists" }, { status: 409 });
  }

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      images: JSON.stringify(parsed.data.images),
    },
  });

  return NextResponse.json({ product });
}
