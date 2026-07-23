import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, Leaf, Award } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getFeaturedProducts, parseImages } from "@/lib/products";

export const metadata = {
  title: "About Us — N.INIYAZHL",
  description: "The story behind N.INIYAZHL — handloom and silk sarees woven with tradition and care.",
};

export default async function AboutPage() {
  const featured = await getFeaturedProducts(3);
  const images = featured.map((p) => parseImages(p.images)[0]).filter(Boolean);

  return (
    <div>
      <section className="relative overflow-hidden bg-green">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
          <div className="animate-fade-in-up text-ivory">
            <span className="inline-flex items-center gap-2 rounded-full bg-ivory/10 px-3 py-1 text-xs font-medium tracking-wide text-background">
              <Sparkles className="h-3.5 w-3.5" /> Our Story
            </span>
            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-5xl">
              Weaving tradition into
              <span className="block text-background">everyday elegance</span>
            </h1>
            <p className="mt-4 max-w-md text-ivory/80">
              N.INIYAZHL began with a simple idea: bring authentic handloom and silk
              cotton sarees — the kind woven by hand over generations — directly to
              your wardrobe, without the markup of the traditional supply chain.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {images.map((img, i) => (
              <div
                key={img}
                className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-gold/30 shadow-xl ${
                  i === 1 ? "mt-8" : ""
                }`}
              >
                <Image src={img!} alt="Saree from our collection" fill sizes="200px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-serif text-2xl font-bold text-ink">Our Mission</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-ink/70">
            Every saree we list is photographed exactly as it is — no filters, no
            misleading angles. We work with small weaving units across Tamil Nadu,
            paying fair prices for handloom cotton, silk cotton, and printed weaves,
            and pass the savings from cutting out middlemen straight to you.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            {
              icon: Leaf,
              title: "Sourced Responsibly",
              body: "We buy directly from weaving clusters, favouring natural fibres and low-waste production.",
            },
            {
              icon: Users,
              title: "Fair to Weavers",
              body: "Fair pricing and steady orders for the artisans and small units behind every saree.",
            },
            {
              icon: Award,
              title: "Quality Checked",
              body: "Every piece is inspected for weave, colour-fastness and finish before it reaches you.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <div className="h-full rounded-xl border border-gold/15 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-lg font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-ink/60">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-green-dark py-14 text-center text-ivory">
        <Reveal>
          <h2 className="font-serif text-2xl font-bold">Ready to find your next saree?</h2>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-gold px-6 py-3 text-sm font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg active:scale-95"
          >
            Browse the Collection
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
