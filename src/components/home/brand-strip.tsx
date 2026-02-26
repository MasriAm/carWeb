"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
  { name: "Mercedes-Benz", slug: "Mercedes-Benz", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
  { name: "BMW", slug: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo.png" },
  { name: "Porsche", slug: "Porsche", logo: "https://www.carlogos.org/car-logos/porsche-logo.png" },
  { name: "Audi", slug: "Audi", logo: "https://www.carlogos.org/car-logos/audi-logo.png" },
  { name: "Toyota", slug: "Toyota", logo: "https://www.carlogos.org/car-logos/toyota-logo.png" },
  { name: "Range Rover", slug: "Range Rover", logo: "https://www.carlogos.org/car-logos/land-rover-logo.png" },
  { name: "Lexus", slug: "Lexus", logo: "https://www.carlogos.org/car-logos/lexus-logo.png" },
  { name: "Kia", slug: "Kia", logo: "https://www.carlogos.org/car-logos/kia-logo.png" },
  { name: "Ferrari", slug: "Ferrari", logo: "https://www.carlogos.org/car-logos/ferrari-logo.png" },
  { name: "Lamborghini", slug: "Lamborghini", logo: "https://www.carlogos.org/car-logos/lamborghini-logo.png" },
];

export default function BrandStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 220;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-16 bg-zinc-950 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-sm font-semibold uppercase tracking-widest text-amber-500/60 mb-10">
          Shop by Brand
        </h2>

        <div className="relative group">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-800"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-zinc-400" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {brands.map((brand, i) => (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/cars?brand=${encodeURIComponent(brand.slug)}`}
                  className="flex flex-col items-center gap-3 min-w-[100px] group/brand"
                >
                  <div className="relative h-20 w-20 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center overflow-hidden transition-all group-hover/brand:border-amber-500/50 group-hover/brand:shadow-lg group-hover/brand:shadow-amber-500/10">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      width={48}
                      height={48}
                      className="object-contain p-1 brightness-0 invert opacity-60 group-hover/brand:opacity-100 transition-opacity"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 group-hover/brand:text-amber-500 transition-colors whitespace-nowrap">
                    {brand.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-zinc-800"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-zinc-400" />
          </button>
        </div>
      </div>
    </section>
  );
}
