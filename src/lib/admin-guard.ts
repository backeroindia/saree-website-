import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function ensureAdmin() {
  const session = await requireAdmin();
  if (!session) {
    return { session: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, response: null };
}
