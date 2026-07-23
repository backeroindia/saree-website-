import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().min(3).max(1000),
});

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in to leave a review" }, { status: 401 });

  const { id: productId } = await params;
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid review" },
      { status: 400 }
    );
  }

  const review = await prisma.review.upsert({
    where: { productId_userId: { productId, userId: session.sub } },
    update: { rating: parsed.data.rating, comment: parsed.data.comment },
    create: {
      productId,
      userId: session.sub,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    },
    include: { user: { select: { name: true } } },
  });

  return NextResponse.json({ review });
}
