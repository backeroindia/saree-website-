import Link from "next/link";
import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { getCategories, getFeaturedProducts, parseImages } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
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

export default async function HomePage() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);

  const heroSlides: HeroSlide[] = featured.slice(0, 4).map((p, i) => ({
    ...HERO_TEMPLATES[i % HERO_TEMPLATES.length],
    image: parseImages(p.images)[0] ?? null,
    ctaHref: `/shop?category=${p.category.slug}`,
  }));

  return (
    <div>
      <HeroCarousel slides={heroSlides} />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Truck, title: "Pan-India Delivery", sub: "Free above ₹1,999" },
            { icon: ShieldCheck, title: "Cash on Delivery", sub: "Pay when it arrives" },
            { icon: RotateCcw, title: "Easy Returns", sub: "7-day return window" },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="flex items-center gap-3 rounded-xl border border-gold/15 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md">
                <item.icon className="h-6 w-6 text-green" />
                <div>
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-ink/50">{item.sub}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="mb-6 font-serif text-2xl font-bold text-ink">
            Shop by Category
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 100}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative flex h-40 items-end overflow-hidden rounded-xl bg-green p-5"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-green-dark/90 via-green/40 to-transparent transition-all duration-500 group-hover:from-green-dark group-hover:scale-105" />
                <div className="relative transition-transform duration-300 group-hover:translate-x-1">
                  <h3 className="font-serif text-xl font-semibold text-ivory">
                    {c.name}
                  </h3>
                  <span className="text-xs text-gold">Shop now →</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-ink">
              Featured Sarees
            </h2>
            <Link href="/shop" className="text-sm font-medium text-green transition-colors hover:text-gold">
              View all →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
