import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ productId: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Please sign in" }, { status: 401 });

  const { productId } = await params;
  await prisma.wishlistItem.deleteMany({
    where: { userId: session.sub, productId },
  });

  return NextResponse.json({ success: true });
}
