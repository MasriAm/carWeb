"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Search } from "lucide-react";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1920&q=80",
    title: "Super Royal Cars",
    subtitle: "Jordan's Premier Luxury Marketplace",
  },
  {
    image:
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80",
    title: "Performance Redefined",
    subtitle: "Curated Selection of Exotic Vehicles",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1920&q=80",
    title: "Elegance in Motion",
    subtitle: "From Europe & The Gulf to Amman",
  },
  {
    image:
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1920&q=80",
    title: "Drive Your Dream",
    subtitle: "Trusted Dealers, Verified Listings",
  },
];

const INTERVAL = 5000;

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
    <section className="relative h-screen w-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.15 }}
            transition={{
              duration: INTERVAL / 1000 + 1.2,
              ease: "linear",
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-4 drop-shadow-lg">
              {slide.title}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8 drop-shadow">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/cars">
            <Button
              size="lg"
              className="rounded-full px-8 text-base bg-white text-neutral-900 hover:bg-white/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Browse Cars
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 text-base border-white/30 text-white hover:bg-white/10 bg-transparent"
            >
              Learn More
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-8 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
