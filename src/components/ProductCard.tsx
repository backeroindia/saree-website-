import Link from "next/link";
import Image from "next/image";
import { formatINR } from "@/lib/money";
import { parseImages } from "@/lib/products";

type ProductCardProduct = {
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  images: string;
  fabric: string;
  color: string;
  stock: number;
  category: { name: string };
};

export default function ProductCard({ product }: { product: ProductCardProduct }) {
  const images = parseImages(product.images);
  const image = images[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
        )
      : null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-xl border border-gold/15 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl hover:shadow-green/10"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-ivory">
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
        {discount && (
          <span className="animate-scale-in absolute left-2 top-2 rounded-full bg-gold px-2 py-1 text-[11px] font-semibold text-green-dark">
            {discount}% OFF
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/80 py-1 text-center text-xs font-medium text-white">
            Out of stock
          </span>
        )}
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
