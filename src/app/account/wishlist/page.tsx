import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export default async function WishlistPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/wishlist");

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.sub },
    include: {
      product: {
        include: { category: true, reviews: { select: { rating: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/account" className="mb-4 flex items-center gap-1 text-sm text-ink/50 hover:text-green">
        <ArrowLeft className="h-4 w-4" /> Back to Account
      </Link>
      <h1 className="font-serif text-3xl font-bold text-ink">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border border-gold/15 bg-white p-12 text-center text-ink/60">
          <Heart className="mx-auto h-10 w-10 text-ink/20" />
          <p className="mt-3">Your wishlist is empty.</p>
          <Link href="/shop" className="mt-3 inline-block text-green hover:underline">
            Browse sarees →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.id} product={item.product} wishlisted />
          ))}
        </div>
      )}
    </div>
  );
}
