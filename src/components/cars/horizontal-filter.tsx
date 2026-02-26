"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { motion } from "framer-motion";
import { getModelsByBrand } from "@/lib/actions/vehicles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const BRANDS = [
  "Mercedes-Benz", "BMW", "Porsche", "Audi", "Toyota",
  "Range Rover", "Lexus", "Kia", "Ferrari", "Lamborghini",
  "Hyundai", "BYD", "Changan", "Neta", "MG",
];
const ORIGINS = [
  { value: "GULF", label: "Gulf Spec" },
  { value: "AMERICAN", label: "US Spec" },
  { value: "EUROPEAN", label: "European" },
  { value: "JORDANIAN", label: "Jordanian" },
  { value: "CHINESE", label: "Chinese" },
];
const PRICE_RANGES = [
  { label: "Under 20K", min: "0", max: "20000" },
  { label: "20K – 50K", min: "20000", max: "50000" },
  { label: "50K – 100K", min: "50000", max: "100000" },
  { label: "100K – 200K", min: "100000", max: "200000" },
  { label: "200K+", min: "200000", max: "" },
];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price ↑" },
  { value: "price_desc", label: "Price ↓" },
  { value: "year_desc", label: "Year ↓" },
];

const pillSpring = { type: "spring" as const, stiffness: 500, damping: 30 };

export default function HorizontalFilter({ brands }: { brands: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const allBrands = [...new Set([...BRANDS, ...brands])].sort();

  const [models, setModels] = useState<string[]>([]);
  const currentBrand = searchParams.get("brand") || "";
  const currentOrigin = searchParams.get("originSpec") || "";

  useEffect(() => {
    if (currentBrand) {
      getModelsByBrand(currentBrand).then(setModels);
    } else {
      setModels([]);
    }
  }, [currentBrand]);

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  const updatePriceRange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete("minPrice");
        params.delete("maxPrice");
      } else {
        const range = PRICE_RANGES.find(
          (r) => `${r.min}-${r.max}` === value
        );
        if (range) {
          if (range.min) params.set("minPrice", range.min);
          else params.delete("minPrice");
          if (range.max) params.set("maxPrice", range.max);
          else params.delete("maxPrice");
        }
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, pathname, router]
  );

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasFilters = searchParams.toString().length > 0;

  const currentPriceRange = (() => {
    const min = searchParams.get("minPrice") || "";
    const max = searchParams.get("maxPrice") || "";
    if (!min && !max) return "all";
    return `${min}-${max}`;
  })();

  return (
    <div className="sticky top-16 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-[1400px] mx-auto px-4 py-3 space-y-3">
        {/* Origin spec pills with sliding background */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          {[{ value: "", label: "All Specs" }, ...ORIGINS].map((origin) => {
            const isActive = currentOrigin === origin.value;
            return (
              <button
                key={origin.value}
                onClick={() => updateFilter("originSpec", origin.value || "all")}
                className="relative px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-full bg-amber-500"
                    transition={pillSpring}
                  />
                )}
                <span className={`relative z-10 ${isActive ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-200"}`}>
                  {origin.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dropdowns row */}
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <Select value={searchParams.get("brand") || "all"} onValueChange={(v) => updateFilter("brand", v)}>
            <SelectTrigger className="w-[160px] shrink-0 bg-zinc-900 border-zinc-700 text-zinc-200 h-9 text-sm">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all">All Brands</SelectItem>
              {allBrands.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {models.length > 0 && (
            <Select value={searchParams.get("model") || "all"} onValueChange={(v) => updateFilter("model", v)}>
              <SelectTrigger className="w-[140px] shrink-0 bg-zinc-900 border-zinc-700 text-zinc-200 h-9 text-sm">
                <SelectValue placeholder="Model" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-700">
                <SelectItem value="all">All Models</SelectItem>
                {models.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={currentPriceRange} onValueChange={updatePriceRange}>
            <SelectTrigger className="w-[140px] shrink-0 bg-zinc-900 border-zinc-700 text-zinc-200 h-9 text-sm">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all">Any Price</SelectItem>
              {PRICE_RANGES.map((r) => (
                <SelectItem key={`${r.min}-${r.max}`} value={`${r.min}-${r.max}`}>
                  {r.label} JOD
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={searchParams.get("sortBy") || "newest"} onValueChange={(v) => updateFilter("sortBy", v)}>
            <SelectTrigger className="w-[120px] shrink-0 bg-zinc-900 border-zinc-700 text-zinc-200 h-9 text-sm">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="shrink-0 text-zinc-400 hover:text-white hover:bg-zinc-800 h-9"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
