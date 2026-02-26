"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Brand = {
  name: string;
  slug: string;
  logo?: string;
};

const brands: Brand[] = [
  { name: "Toyota", slug: "Toyota", logo: "https://www.carlogos.org/car-logos/toyota-logo.png" },
  { name: "Hyundai", slug: "Hyundai", logo: "https://www.carlogos.org/car-logos/hyundai-logo.png" },
  { name: "Kia", slug: "Kia", logo: "https://www.carlogos.org/car-logos/kia-logo.png" },
  { name: "Mercedes-Benz", slug: "Mercedes-Benz", logo: "https://www.carlogos.org/car-logos/mercedes-benz-logo.png" },
  { name: "BMW", slug: "BMW", logo: "https://www.carlogos.org/car-logos/bmw-logo.png" },
  { name: "Porsche", slug: "Porsche", logo: "https://www.carlogos.org/car-logos/porsche-logo.png" },
  { name: "Range Rover", slug: "Range Rover", logo: "https://www.carlogos.org/car-logos/land-rover-logo.png" },
  { name: "Ferrari", slug: "Ferrari", logo: "https://www.carlogos.org/car-logos/ferrari-logo.png" },
  { name: "Lamborghini", slug: "Lamborghini", logo: "https://www.carlogos.org/car-logos/lamborghini-logo.png" },
  { name: "BYD", slug: "BYD" },
  { name: "Changan", slug: "Changan" },
  { name: "Neta", slug: "Neta" },
  { name: "MG", slug: "MG" },
];

function BrandLogo({ brand }: { brand: Brand }) {
  const [imgError, setImgError] = useState(false);

  if (!brand.logo || imgError) {
    const initials = brand.name.length <= 3
      ? brand.name
      : brand.name.split(/[\s-]/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);

    return (
      <div className="h-full w-full flex items-center justify-center">
        <span className="text-lg font-bold text-amber-500/70 tracking-tight select-none">
          {initials}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={brand.logo}
      alt={brand.name}
      width={48}
      height={48}
      className="object-contain p-1 brightness-0 invert opacity-60 group-hover/brand:opacity-100 transition-opacity"
      unoptimized
      onError={() => setImgError(true)}
    />
  );
}

export default function BrandStrip() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 5);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.6;
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

        <div className="relative">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg transition-colors hover:bg-zinc-700"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5 text-zinc-300" />
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scroll-smooth px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            {brands.map((brand, i) => (
              <motion.div
                key={brand.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="shrink-0"
              >
                <Link
                  href={`/cars?brand=${encodeURIComponent(brand.slug)}`}
                  className="flex flex-col items-center gap-3 w-[100px] group/brand"
                >
                  <div className="relative h-20 w-20 rounded-full bg-zinc-900 border-2 border-zinc-800 flex items-center justify-center overflow-hidden transition-all group-hover/brand:border-amber-500/50 group-hover/brand:shadow-lg group-hover/brand:shadow-amber-500/10">
                    <BrandLogo brand={brand} />
                  </div>
                  <span className="text-xs font-medium text-zinc-500 group-hover/brand:text-amber-500 transition-colors whitespace-nowrap">
                    {brand.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shadow-lg transition-colors hover:bg-zinc-700"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5 text-zinc-300" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
