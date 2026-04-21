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
  /** Radial gradient background — keeps the dark theme intact (no images). */
  gradient: string;
};

const heroSlides: Slide[] = [
  {
    tag: "Zarqa Free Zone",
    title: "Jordan's Premium Car Marketplace.",
    subtitle:
      "From verified agency imports to US and Korean spec vehicles — curated with absolute transparency.",
    gradient:
      "radial-gradient(ellipse at 20% 60%, #1A2744 0%, #050505 60%)",
  },
  {
    tag: "100% Verified",
    title: "Performance You Can Trust.",
    subtitle:
      "Every listing is verified. Accurate JOD pricing, full spec disclosure, and strict dealer vetting.",
    gradient:
      "radial-gradient(ellipse at 80% 40%, #1C1C1E 0%, #050505 60%)",
  },
  {
    tag: "All Specs",
    title: "European, Gulf & American Specs.",
    subtitle:
      "Browse imports from every origin — all available in one curated marketplace built for Jordan.",
    gradient:
      "radial-gradient(ellipse at 30% 70%, #2D1810 0%, #050505 60%)",
  },
  {
    tag: "Premium Selection",
    title: "Drive Your Dream.",
    subtitle:
      "Trusted dealers across Amman, Irbid, and Zarqa. Premium selection, transparent deals.",
    gradient:
      "radial-gradient(ellipse at 70% 30%, #1F1A00 0%, #050505 60%)",
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
      className="relative flex min-h-[92vh] items-center justify-center overflow-hidden"
      style={{ background: slide.gradient, transition: "background 1.2s ease" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[20%] h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-24 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-500">
                {slide.tag}
              </span>
            </span>
            <h1 className="mb-5 text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-zinc-50 sm:text-5xl md:text-6xl">
              {slide.title}
            </h1>
            <p className="mx-auto mb-9 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/cars">
            <Button
              size="lg"
              className="h-12 rounded-full bg-amber-500 px-8 text-base font-bold text-zinc-950 hover:bg-amber-400"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Cars
            </Button>
          </Link>
          <Link href="/register">
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-zinc-700 bg-transparent px-7 text-base font-medium text-zinc-400 hover:border-zinc-600 hover:bg-zinc-900 hover:text-zinc-200"
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
                i === current ? "w-7 bg-amber-500" : "w-1.5 bg-white/25"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/5 bg-black/40 backdrop-blur">
        <div className="mx-auto grid max-w-6xl grid-cols-2 sm:grid-cols-4">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.l}
              className={`py-4 text-center ${
                i > 0 ? "border-l border-white/5" : ""
              }`}
            >
              <div className="text-xl font-extrabold tracking-tight text-amber-500 sm:text-[22px]">
                {s.n}
              </div>
              <div className="mt-0.5 text-[11px] tracking-wide text-zinc-500">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
