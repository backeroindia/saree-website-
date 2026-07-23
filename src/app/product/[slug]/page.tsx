import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, parseImages, averageRating } from "@/lib/products";
import { getWishlistedProductIds } from "@/lib/wishlist";
import { formatINR } from "@/lib/money";
import ProductGallery from "@/components/ProductGallery";
import ProductDescription from "@/components/ProductDescription";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ReviewsSection from "@/components/ReviewsSection";
import StarRating from "@/components/StarRating";
import WishlistButton from "@/components/WishlistButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const images = parseImages(product.images);
  const title = `${product.name} | N.INIYAZHL`;
  const description = product.description.slice(0, 155);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: images[0] ? [images[0]] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const images = parseImages(product.images);
  const [related, wishlistIds] = await Promise.all([
    getRelatedProducts(product.categoryId, product.id, 4),
    getWishlistedProductIds(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs text-ink/50">
        <Link href="/" className="hover:text-green">Home</Link> /{" "}
        <Link href={`/shop?category=${product.category.slug}`} className="hover:text-green">
          {product.category.name}
        </Link>{" "}
        / <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={images} name={product.name} />

        <div>
          <p className="text-xs uppercase tracking-wide text-gold">{product.category.name}</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-ink">{product.name}</h1>
          <p className="mt-1 text-sm text-ink/50">{product.fabric} · {product.color}</p>
          {product.reviews.length > 0 && (
            <div className="mt-2">
              <StarRating rating={averageRating(product.reviews)} count={product.reviews.length} />
            </div>
          )}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-green">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-base text-ink/40 line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-ink/40">Inclusive of all taxes</p>

          <ProductDescription description={product.description} />

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-gold/15 bg-white p-4 text-sm">
            <div>
              <p className="text-ink/40">Fabric</p>
              <p className="font-medium">{product.fabric}</p>
            </div>
            <div>
              <p className="text-ink/40">Colour</p>
              <p className="font-medium">{product.color}</p>
            </div>
            <div>
              <p className="text-ink/40">Saree Length</p>
              <p className="font-medium">6.3 m (with blouse piece)</p>
            </div>
            <div>
              <p className="text-ink/40">Wash Care</p>
              <p className="font-medium">Dry clean recommended</p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <AddToCart
              productId={product.id}
              slug={product.slug}
              name={product.name}
              image={images[0] ?? ""}
              price={product.price}
              stock={product.stock}
            />
            <WishlistButton productId={product.id} initialWishlisted={wishlistIds.has(product.id)} variant="inline" />
          </div>
        </div>
      </div>

      <ReviewsSection
        productId={product.id}
        reviews={product.reviews.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
        averageRating={averageRating(product.reviews)}
      />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-serif text-2xl font-bold text-ink">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} wishlisted={wishlistIds.has(p.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
