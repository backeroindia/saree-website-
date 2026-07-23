import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function getWishlistedProductIds(): Promise<Set<string>> {
  const session = await getSession();
  if (!session) return new Set();

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.sub },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
}
