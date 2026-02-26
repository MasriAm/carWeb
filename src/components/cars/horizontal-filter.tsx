"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
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
];
const ORIGINS = ["EUROPEAN", "CHINESE", "JORDANIAN", "AMERICAN", "GULF"];
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

export default function HorizontalFilter({ brands }: { brands: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const allBrands = [...new Set([...BRANDS, ...brands])].sort();

  const [models, setModels] = useState<string[]>([]);
  const currentBrand = searchParams.get("brand") || "";

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
      <div className="max-w-[1400px] mx-auto px-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {/* Brand */}
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

          {/* Model (reactive) */}
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

          {/* Price Range */}
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

          {/* Origin Spec */}
          <Select value={searchParams.get("originSpec") || "all"} onValueChange={(v) => updateFilter("originSpec", v)}>
            <SelectTrigger className="w-[140px] shrink-0 bg-zinc-900 border-zinc-700 text-zinc-200 h-9 text-sm">
              <SelectValue placeholder="Origin" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all">Any Origin</SelectItem>
              {ORIGINS.map((o) => (
                <SelectItem key={o} value={o}>{o}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
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
