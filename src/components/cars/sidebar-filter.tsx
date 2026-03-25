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
const FUEL_OPTIONS = [
  { value: "GAS", label: "Gasoline" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID", label: "Hybrid" },
];
const TRANSMISSION_OPTIONS = [
  { value: "AUTO", label: "Automatic" },
  { value: "MANUAL", label: "Manual" },
];
const CONDITION_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
];
const triggerCls = "bg-zinc-800 border-zinc-700 text-zinc-200 w-full";
const contentCls = "bg-zinc-900 border-zinc-700";
const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
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
    <aside className="w-full space-y-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Filters
          </h2>
        </div>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-zinc-500 hover:text-amber-500 flex items-center gap-1 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      <Separator className="bg-zinc-800" />

      <div className="space-y-2">
        <Label className="text-xs text-zinc-500">Sort By</Label>
        <Select value={val("sortBy") || "newest"} onValueChange={(v) => updateFilter("sortBy", v)}>
          <SelectTrigger className={triggerCls}><SelectValue /></SelectTrigger>
          <SelectContent className={contentCls}>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-500">Brand</Label>
        <Select value={val("brand") || "all"} onValueChange={(v) => updateFilter("brand", v)}>
          <SelectTrigger className={triggerCls}><SelectValue placeholder="All Brands" /></SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all">All Brands</SelectItem>
            {allBrands.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {models.length > 0 && (
        <div className="space-y-2">
          <Label className="text-xs text-zinc-500">Model</Label>
          <Select value={val("model") || "all"} onValueChange={(v) => updateFilter("model", v)}>
            <SelectTrigger className={triggerCls}><SelectValue placeholder="All Models" /></SelectTrigger>
            <SelectContent className={contentCls}>
              <SelectItem value="all">All Models</SelectItem>
              {models.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs text-zinc-500">Price (JOD)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={val("minPrice")}
            onChange={(e) => updateFilter("minPrice", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={val("maxPrice")}
            onChange={(e) => updateFilter("maxPrice", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm"
          />
        </div>
      </div>

      <Separator className="bg-zinc-800" />

      <div className="space-y-2">
        <Label className="text-xs text-zinc-500">Condition</Label>
        <Select value={val("condition") || "all"} onValueChange={(v) => updateFilter("condition", v)}>
          <SelectTrigger className={triggerCls}><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all">Any</SelectItem>
            {CONDITION_OPTIONS.map((c) => (
              <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-500">Body Type</Label>
        <Select value={val("bodyType") || "all"} onValueChange={(v) => updateFilter("bodyType", v)}>
          <SelectTrigger className={triggerCls}><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all">Any</SelectItem>
            {BODY_TYPES.map((b) => (
              <SelectItem key={b} value={b}>{b}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-500">Fuel Type</Label>
        <Select value={val("fuelType") || "all"} onValueChange={(v) => updateFilter("fuelType", v)}>
          <SelectTrigger className={triggerCls}><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all">Any</SelectItem>
            {FUEL_OPTIONS.map((f) => (
              <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-zinc-500">Transmission</Label>
        <Select value={val("transmission") || "all"} onValueChange={(v) => updateFilter("transmission", v)}>
          <SelectTrigger className={triggerCls}><SelectValue placeholder="Any" /></SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all">Any</SelectItem>
            {TRANSMISSION_OPTIONS.map((t) => (
              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator className="bg-zinc-800" />

      <div className="space-y-2">
        <Label className="text-xs text-zinc-500">Year Range</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={val("minYear")}
            onChange={(e) => updateFilter("minYear", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm"
          />
          <Input
            type="number"
            placeholder="Max"
            value={val("maxYear")}
            onChange={(e) => updateFilter("maxYear", e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-zinc-100 h-9 text-sm"
          />
        </div>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800" onClick={clearAll}>
          Reset Filters
        </Button>
      )}
    </aside>
  );
}
