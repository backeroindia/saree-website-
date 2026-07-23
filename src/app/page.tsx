import Link from "next/link";
import Image from "next/image";
import { Truck, Heart, PackageX, Quote } from "lucide-react";
import {
  getCategories,
  getBestsellers,
  getNewArrivals,
  getTopReviews,
  parseImages,
} from "@/lib/products";
import { getWishlistedProductIds } from "@/lib/wishlist";
import { prisma } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import StarRating from "@/components/StarRating";
import Reveal from "@/components/Reveal";
import HeroCarousel, { type HeroSlide } from "@/components/HeroCarousel";

const HERO_TEMPLATES: Omit<HeroSlide, "image" | "ctaHref">[] = [
  {
    badge: "New Season Handloom Collection",
    title: "Sarees woven with",
    highlight: "tradition & grace",
    description:
      "Discover handpicked handloom cotton, silk cotton and printed sarees — each piece photographed true to its weave, delivered to your door anywhere in India.",
    ctaLabel: "Shop the Collection",
    secondaryHref: "/shop?category=cotton-sarees",
    secondaryLabel: "Explore Cotton Sarees",
  },
  {
    badge: "Pure Silk Edit",
    title: "Timeless silk,",
    highlight: "modern elegance",
    description:
      "Rich silk sarees with intricate borders — handpicked for weddings, festivities and every grand occasion.",
    ctaLabel: "Shop This Look",
    secondaryHref: "/shop",
    secondaryLabel: "View All Sarees",
  },
  {
    badge: "Everyday Comfort",
    title: "Cotton comfort,",
    highlight: "everyday grace",
    description:
      "Breathable, lightweight cotton sarees crafted for daily wear without compromising on style.",
    ctaLabel: "Shop This Look",
    secondaryHref: "/shop",
    secondaryLabel: "View All Sarees",
  },
  {
    badge: "Fresh Prints",
    title: "Printed sarees,",
    highlight: "bold & beautiful",
    description:
      "Vibrant printed sarees that bring a contemporary edge to traditional drapes.",
    ctaLabel: "Shop This Look",
    secondaryHref: "/shop",
    secondaryLabel: "View All Sarees",
  },
];

const OCCASIONS = [
  {
    label: "Wedding & Festive",
    sub: "Rich silk cotton weaves for the big day",
    categorySlug: "silk-cotton-sarees",
  },
  {
    label: "Everyday Elegance",
    sub: "Breathable handloom cotton for daily wear",
    categorySlug: "cotton-sarees",
  },
  {
    label: "Prints & Casual",
    sub: "Bold contemporary prints",
    categorySlug: "printed-sarees",
  },
];

export default async function HomePage() {
  const [bestsellers, newArrivals, categories, categoriesWithProduct, reviews, wishlistIds] =
    await Promise.all([
      getBestsellers(8),
      getNewArrivals(4),
      getCategories(),
      prisma.category.findMany({
        include: { products: { take: 1, orderBy: { featured: "desc" } } },
      }),
      getTopReviews(6),
      getWishlistedProductIds(),
    ]);

  const heroSlides: HeroSlide[] = bestsellers.slice(0, 4).map((p, i) => ({
    ...HERO_TEMPLATES[i % HERO_TEMPLATES.length],
    image: parseImages(p.images)[0] ?? null,
    ctaHref: `/shop?category=${p.category.slug}`,
  }));

  const occasionImages = new Map(
    categoriesWithProduct.map((c) => [c.slug, parseImages(c.products[0]?.images ?? "[]")[0] ?? null])
  );

  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Pan-India Delivery", sub: "Always free shipping" },
            { icon: Heart, title: "Handpicked with Love", sub: "Every saree, chosen with care" },
            { icon: PackageX, title: "No Exchange or Return", sub: "All sales are final" },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="flex items-center gap-4 rounded-xl border border-gold/15 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lg hover:shadow-gold/10">
                <div className="animate-float flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green/10" style={{ animationDelay: `${i * 300}ms` }}>
                  <item.icon className="h-6 w-6 text-green" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="text-xs text-ink/50">{item.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-green px-6 py-8 sm:grid-cols-4 sm:px-10">
            {[
              { value: `${bestsellers.length + newArrivals.length}+`, label: "Handloom Sarees" },
              { value: "100%", label: "Authentic Weaves" },
              { value: "Free", label: "Shipping, Always" },
              { value: "Direct", label: "From Weavers" },
            ].map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100} className="text-center">
                <p className="font-serif text-2xl font-bold text-background sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-ivory/70 sm:text-sm">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      {bestsellers.length > 0 && (
        <section className="bg-ivory py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">Loved by our customers</p>
                  <h2 className="mt-1 font-serif text-3xl font-bold text-ink">Bestsellers</h2>
                </div>
                <Link href="/shop" className="text-sm font-medium text-green transition-colors hover:text-gold hover:underline">
                  View all →
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {bestsellers.map((p, i) => (
                <Reveal key={p.id} delay={(i % 4) * 80} className="h-full">
                  <ProductCard product={p} wishlisted={wishlistIds.has(p.id)} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">Curated Edits</p>
          <h2 className="mt-1 mb-8 font-serif text-3xl font-bold text-ink">
            Shop by Category
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 100}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative flex h-52 items-end overflow-hidden rounded-xl bg-green p-6 shadow-md transition-shadow duration-300 hover:shadow-2xl hover:shadow-green/20"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-green-dark/90 via-green/40 to-transparent transition-all duration-500 group-hover:from-green-dark group-hover:scale-105" />
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(circle at 50% 100%, color-mix(in srgb, var(--color-gold) 25%, transparent), transparent 70%)" }} />
                <div className="relative transition-transform duration-300 group-hover:translate-x-1">
                  <h3 className="font-serif text-2xl font-semibold text-ivory">
                    {c.name}
                  </h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-background">
                    Shop now
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ivory py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold">Every Moment</p>
            <h2 className="mt-1 mb-8 font-serif text-3xl font-bold text-ink">Shop by Occasion</h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {OCCASIONS.map((o, i) => {
              const image = occasionImages.get(o.categorySlug);
              return (
                <Reveal key={o.categorySlug} delay={i * 100}>
                  <Link
                    href={`/shop?category=${o.categorySlug}`}
                    className="group relative flex h-72 items-end overflow-hidden rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-2xl hover:shadow-green/20"
                  >
                    {image && (
                      <Image
                        src={image}
                        alt={o.label}
                        fill
                        sizes="(min-width: 640px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-green-dark/95 via-green-dark/40 to-transparent transition-all duration-500 group-hover:from-green-dark" />
                    <div className="relative transition-transform duration-300 group-hover:translate-x-1">
                      <h3 className="font-serif text-2xl font-semibold text-ivory">{o.label}</h3>
                      <p className="mt-1 text-xs text-ivory/70">{o.sub}</p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {newArrivals.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <Reveal>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">Just In</p>
                <h2 className="mt-1 font-serif text-3xl font-bold text-ink">New Arrivals</h2>
              </div>
              <Link href="/shop?sort=newest" className="text-sm font-medium text-green transition-colors hover:text-gold hover:underline">
                View all →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {newArrivals.map((p, i) => (
              <Reveal key={p.id} delay={i * 80} className="h-full">
                <ProductCard product={p} wishlisted={wishlistIds.has(p.id)} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-ivory py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-1 items-center gap-8 sm:grid-cols-2">
              <div className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg">
                {bestsellers[0] && parseImages(bestsellers[0].images)[1] && (
                  <Image
                    src={parseImages(bestsellers[0].images)[1]}
                    alt="Handwoven saree detail"
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gold">Our Craft</p>
                <h2 className="mt-1 font-serif text-2xl font-bold text-ink">
                  Handwoven, not mass-produced
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">
                  Every saree in our collection is sourced directly from handloom weavers,
                  photographed true to its actual weave and colour. No stock photos, no
                  guesswork — what you see is what arrives at your door.
                </p>
                <Link
                  href="/about"
                  className="mt-4 inline-block text-sm font-medium text-green hover:text-gold hover:underline"
                >
                  Read our story →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold">Testimonials</p>
            <h2 className="mb-10 mt-1 text-center font-serif text-3xl font-bold text-ink">
              What Our Customers Say
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={(i % 3) * 100} className="h-full">
                <div className="h-full rounded-xl border border-gold/15 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gold/10">
                  <Quote className="h-5 w-5 text-gold/50" />
                  <p className="mt-2 line-clamp-4 text-sm text-ink/70">{r.comment}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">{r.user.name}</p>
                      <Link
                        href={`/product/${r.product.slug}`}
                        className="text-xs text-ink/40 hover:text-green hover:underline"
                      >
                        {r.product.name}
                      </Link>
                    </div>
                    <StarRating rating={r.rating} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
