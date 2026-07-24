"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export type HeroSlide = {
  badge: string;
  title: string;
  highlight: string;
  description: string;
  image: string | null;
  ctaHref: string;
  ctaLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export default function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const goTo = (i: number) =>
    setIndex(((i % slides.length) + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden bg-green">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative h-[640px] sm:h-[480px] md:h-[520px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-6 px-4 py-6 sm:grid-cols-2 sm:gap-8 sm:px-6 lg:px-8">
              <div
                key={i === index ? `active-${i}` : `inactive-${i}`}
                className={`text-ivory ${i === index ? "animate-fade-in-up" : ""}`}
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-ivory/10 px-3 py-1 text-xs font-medium tracking-wide text-background">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse" /> {slide.badge}
                </span>
                <h1 className="mt-3 font-serif text-2xl font-bold leading-tight sm:mt-4 sm:text-4xl md:text-5xl">
                  {slide.title}
                  <span className="block text-background">{slide.highlight}</span>
                </h1>
                <p className="mt-3 max-w-md text-sm text-ivory/80 line-clamp-3 sm:mt-4 sm:text-base sm:line-clamp-none">
                  {slide.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                  <Link
                    href={slide.ctaHref}
                    className="rounded-full bg-gold px-5 py-2.5 text-xs font-semibold text-background transition-all duration-300 hover:bg-gold-hover hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5 active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {slide.ctaLabel}
                  </Link>
                  <Link
                    href={slide.secondaryHref}
                    className="rounded-full border border-ivory/30 px-5 py-2.5 text-xs font-semibold text-ivory transition-all duration-300 hover:bg-ivory/10 hover:-translate-y-0.5 active:scale-95 sm:px-6 sm:py-3 sm:text-sm"
                  >
                    {slide.secondaryLabel}
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto aspect-[4/5] w-full max-w-[210px] overflow-hidden rounded-2xl border-4 border-gold/30 shadow-2xl sm:max-w-sm md:max-w-md">
                {slide.image && (
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    priority={i === 0}
                    sizes="(min-width: 768px) 28rem, 90vw"
                    className={`object-cover ${i === index ? "animate-ken-burns" : ""}`}
                  />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-green-dark/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => goTo(index - 1)}
            aria-label="Previous slide"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ivory/10 p-2 text-ivory transition-colors hover:bg-ivory/20 sm:left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => goTo(index + 1)}
            aria-label="Next slide"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-ivory/10 p-2 text-ivory transition-colors hover:bg-ivory/20 sm:right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? "w-6 bg-background" : "w-1.5 bg-ivory/40 hover:bg-ivory/60"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
