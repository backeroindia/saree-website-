import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/money";
import { parseImages, averageRating } from "@/lib/products";
import StarRating from "@/components/StarRating";
import WishlistButton from "@/components/WishlistButton";

type ProductCardProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  images: string;
  fabric: string;
  color: string;
  stock: number;
  category: { name: string };
  reviews?: { rating: number }[];
};

export default function ProductCard({
  product,
  wishlisted = false,
  badge,
}: {
  product: ProductCardProduct;
  wishlisted?: boolean;
  badge?: string;
}) {
  const images = parseImages(product.images);
  const image = images[0];
  const reviews = product.reviews ?? [];

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-gold/15 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl hover:shadow-green/10"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory">
        <WishlistButton productId={product.id} initialWishlisted={wishlisted} />
        {badge && (
          <span className="animate-fade-in absolute left-2 top-2 z-10 rounded-full bg-green px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-background shadow-sm">
            {badge}
          </span>
        )}
        {image && (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-dark/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {product.stock <= 0 ? (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-center text-xs font-medium text-white">
            Out of stock
          </span>
        ) : product.stock <= 5 ? (
          <span className="absolute inset-x-0 bottom-0 bg-gold/90 py-1 text-center text-xs font-medium text-background">
            Only {product.stock} left
          </span>
        ) : null}
      </div>
      <div className="p-3">
        <p className="text-[11px] uppercase tracking-wide text-gold">
          {product.category.name}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-ink transition-colors group-hover:text-green">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-ink/50">
          {product.fabric} · {product.color}
        </p>
        {reviews.length > 0 && (
          <div className="mt-1">
            <StarRating rating={averageRating(reviews)} count={reviews.length} />
          </div>
        )}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-sm font-semibold text-green">
            {formatINR(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-ink/40 line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
