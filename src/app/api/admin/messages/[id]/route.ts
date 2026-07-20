import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ensureAdmin } from "@/lib/admin-guard";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { response } = await ensureAdmin();
  if (response) return response;

  const { id } = await params;
  const message = await prisma.contactMessage.update({
    where: { id },
    data: { read: true },
  });
  return NextResponse.json({ message });
}
