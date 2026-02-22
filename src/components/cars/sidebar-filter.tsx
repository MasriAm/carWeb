"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { getModelsByBrand } from "@/lib/actions/vehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SlidersHorizontal, X } from "lucide-react";

const BRANDS = [
  "Mercedes-Benz",
  "BMW",
  "Porsche",
  "Audi",
  "Toyota",
  "Range Rover",
  "Lexus",
  "Kia",
  "Ferrari",
  "Lamborghini",
];

const BODY_TYPES = ["SUV", "SEDAN", "COUPE", "HATCHBACK", "CONVERTIBLE", "PICKUP", "VAN", "WAGON"];
const FUEL_TYPES = ["GAS", "ELECTRIC", "DIESEL", "HYBRID"];
const TRANSMISSIONS = ["AUTO", "MANUAL"];
const CONDITIONS = ["NEW", "USED"];
const ORIGINS = ["EUROPEAN", "CHINESE", "JORDANIAN", "AMERICAN", "GULF"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest" },
  { value: "year_asc", label: "Year: Oldest" },
];

export default function SidebarFilter({ brands }: { brands: string[] }) {
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

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasFilters = searchParams.toString().length > 0;

  const val = (key: string) => searchParams.get(key) || "";

  return (
    <aside className="w-full space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            Filters
          </h2>
        </div>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-neutral-400 hover:text-neutral-900 flex items-center gap-1 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <Separator />

      {/* Sort */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Sort By</Label>
        <Select
          value={val("sortBy") || "newest"}
          onValueChange={(v) => updateFilter("sortBy", v)}
        >
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Brand</Label>
        <Select value={val("brand") || "all"} onValueChange={(v) => updateFilter("brand", v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="All Brands" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {allBrands.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Model — reactive to brand */}
      {models.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-neutral-500">Model</Label>
          <Select value={val("model") || "all"} onValueChange={(v) => updateFilter("model", v)}>
            <SelectTrigger className="w-full"><SelectValue placeholder="All Models" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {models.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Price (JOD)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={val("minPrice")}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={val("maxPrice")}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      <Separator />

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Condition</Label>
        <Select value={val("condition") || "all"} onValueChange={(v) => updateFilter("condition", v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {CONDITIONS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body Type */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Body Type</Label>
        <Select value={val("bodyType") || "all"} onValueChange={(v) => updateFilter("bodyType", v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {BODY_TYPES.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Fuel Type</Label>
        <Select value={val("fuelType") || "all"} onValueChange={(v) => updateFilter("fuelType", v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {FUEL_TYPES.map((f) => (
              <SelectItem key={f} value={f}>{f}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Transmission</Label>
        <Select value={val("transmission") || "all"} onValueChange={(v) => updateFilter("transmission", v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {TRANSMISSIONS.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Origin Spec */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Origin Spec</Label>
        <Select value={val("originSpec") || "all"} onValueChange={(v) => updateFilter("originSpec", v)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            {ORIGINS.map((o) => (
              <SelectItem key={o} value={o}>{o}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Year Range */}
      <div className="space-y-2">
        <Label className="text-xs text-neutral-500">Production Year</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="From"
            value={val("minYear")}
            onChange={(e) => updateFilter("minYear", e.target.value)}
            className="text-sm"
          />
          <Input
            type="number"
            placeholder="To"
            value={val("maxYear")}
            onChange={(e) => updateFilter("maxYear", e.target.value)}
            className="text-sm"
          />
        </div>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearAll}>
          Reset Filters
        </Button>
      )}
    </aside>
  );
}
