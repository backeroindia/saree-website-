import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureAdmin } from "@/lib/admin-guard";

export async function GET() {
  const { response } = await ensureAdmin();
  if (response) return response;

  const orders = await prisma.order.findMany({
    include: { items: true, user: true, address: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}
