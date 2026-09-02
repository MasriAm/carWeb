"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";

type Slide = {
  tag: string;
  title: string;
  subtitle: string;
};

const heroSlides: Slide[] = [
  {
    tag: "Zarqa Free Zone",
    title: "Jordan's Premium Car Marketplace.",
    subtitle:
      "From verified agency imports to US and Korean spec vehicles — curated with absolute transparency."
  },
  {
    tag: "100% Verified",
    title: "Performance You Can Trust.",
    subtitle:
      "Every listing is verified. Accurate JOD pricing, full spec disclosure, and strict dealer vetting."
  },
  {
    tag: "All Specs",
    title: "European, Gulf & American Specs.",
    subtitle:
      "Browse imports from every origin — all available in one curated marketplace built for Jordan."
  },
  {
    tag: "Premium Selection",
    title: "Drive Your Dream.",
    subtitle:
      "Trusted dealers across Amman, Irbid, and Zarqa. Premium selection, transparent deals."
  },
];

const INTERVAL = 5000;

const HERO_STATS = [
  { n: "1,200+", l: "Vehicles Listed" },
  { n: "85+", l: "Verified Dealers" },
  { n: "12K+", l: "Happy Buyers" },
  { n: "5", l: "Cities Covered" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const slide = heroSlides[current];

  return (
    <section
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-inverse"
    >

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" />
              <span className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-strong">
                {slide.tag}
              </span>
            </span>
            <h1 className="mb-5 text-balance font-display text-hero leading-none text-inverse-ink sm:text-6xl">
              {slide.title}
            </h1>
            <p className="mx-auto mb-9 max-w-2xl text-lead leading-relaxed text-inverse-ink-2">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/cars">
            <Button
              size="lg"
              className="h-12 rounded-full bg-brand px-8 text-base font-bold text-brand-ink hover:bg-brand-hover"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Cars
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-inverse-ink-2/40 bg-transparent px-7 text-base font-medium text-inverse-ink hover:bg-inverse-ink/10 hover:text-inverse-ink"
            >
              Create Account
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-7 bg-brand" : "w-1.5 bg-inverse-ink/30"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-inverse-ink/10 bg-inverse">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.l}
              className={`py-4 text-center ${
                i > 0 ? "border-l border-white/5" : ""
              }`}
            >
              <div className="text-xl font-extrabold tracking-tight text-brand-strong sm:text-title">
                {s.n}
              </div>
              <div className="mt-0.5 text-caption tracking-wide text-inverse-ink-2">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
