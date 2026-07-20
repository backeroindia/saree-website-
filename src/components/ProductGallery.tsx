"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="animate-fade-in relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-gold/15 bg-white">
        {images[active] && (
          <Image
            key={images[active]}
            src={images[active]}
            alt={name}
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="animate-fade-in object-cover"
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition-all duration-200 hover:opacity-90",
                i === active
                  ? "border-gold shadow-md shadow-gold/20"
                  : "border-transparent hover:border-gold/30"
              )}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
