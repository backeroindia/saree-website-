import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ productIds: [] });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.sub },
    select: { productId: true },
  });
  return NextResponse.json({ productIds: items.map((i) => i.productId) });
}

const schema = z.object({ productId: z.string() });

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: session.sub, productId: parsed.data.productId } },
    update: {},
    create: { userId: session.sub, productId: parsed.data.productId },
  });

  return NextResponse.json({ success: true });
}
