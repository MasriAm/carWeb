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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

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
  "Hyundai",
  "BYD",
  "Changan",
  "Neta",
  "MG",
];

const FUEL_OPTIONS = [
  { value: "GAS" as const, label: "Gasoline" },
  { value: "DIESEL" as const, label: "Diesel" },
  { value: "ELECTRIC" as const, label: "Electric" },
  { value: "HYBRID" as const, label: "Hybrid" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from(
  { length: currentYear - 2009 },
  (_, i) => currentYear - i
);

const inputCls =
  "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 h-10";
const labelCls = "text-zinc-400 text-sm font-medium";

function syncFromSearchParams(searchParams: URLSearchParams) {
  const brand = searchParams.get("brand") || "";
  const model = searchParams.get("model") || "";
  const condition = searchParams.get("condition") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const transmission = searchParams.get("transmission") || "";
  const fuelType = searchParams.get("fuelType") || "";

  const yearSingle = searchParams.get("year");
  const minY = searchParams.get("minYear") || "";
  const maxY = searchParams.get("maxYear") || "";
  let minYear = minY;
  let maxYear = maxY;
  if (yearSingle && !minY && !maxY) {
    minYear = yearSingle;
    maxYear = yearSingle;
  }

  return {
    brand,
    model,
    condition,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
    transmission,
    fuelType,
  };
}

export default function InlineSidebarFilter({
  brands,
}: {
  brands: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const allBrands = [...new Set([...BRANDS, ...brands])].sort();
  const spKey = searchParams.toString();

  const [models, setModels] = useState<string[]>([]);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [transmission, setTransmission] = useState("");
  const [fuelType, setFuelType] = useState("");

  useEffect(() => {
    const s = syncFromSearchParams(new URLSearchParams(spKey));
    setBrand(s.brand);
    setModel(s.model);
    setCondition(s.condition);
    setMinYear(s.minYear);
    setMaxYear(s.maxYear);
    setMinPrice(s.minPrice);
    setMaxPrice(s.maxPrice);
    setTransmission(s.transmission);
    setFuelType(s.fuelType);
  }, [spKey]);

  useEffect(() => {
    if (brand) {
      getModelsByBrand(brand).then(setModels);
    } else {
      setModels([]);
    }
  }, [brand]);

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    params.delete("year");

    if (brand && brand !== "all") params.set("brand", brand);
    else params.delete("brand");
    if (model && model !== "all") params.set("model", model);
    else params.delete("model");

    if (condition === "NEW" || condition === "USED")
      params.set("condition", condition);
    else params.delete("condition");

    if (minYear) params.set("minYear", minYear);
    else params.delete("minYear");
    if (maxYear) params.set("maxYear", maxYear);
    else params.delete("maxYear");

    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    if (transmission === "AUTO" || transmission === "MANUAL")
      params.set("transmission", transmission);
    else params.delete("transmission");

    if (fuelType) params.set("fuelType", fuelType);
    else params.delete("fuelType");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [
    brand,
    model,
    condition,
    minYear,
    maxYear,
    minPrice,
    maxPrice,
    transmission,
    fuelType,
    pathname,
    router,
    searchParams,
  ]);

  const clearAll = useCallback(() => {
    setBrand("");
    setModel("");
    setCondition("");
    setMinYear("");
    setMaxYear("");
    setMinPrice("");
    setMaxPrice("");
    setTransmission("");
    setFuelType("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }, [pathname, router]);

  const filterBody = (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label className={labelCls}>Brand</Label>
        <Select
          value={brand || "all"}
          onValueChange={(v) => {
            setBrand(v === "all" ? "" : v);
            setModel("");
          }}
        >
          <SelectTrigger className={cn(inputCls, "w-full")}>
            <SelectValue placeholder="All brands" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-700">
            <SelectItem value="all">All brands</SelectItem>
            {allBrands.map((b) => (
              <SelectItem key={b} value={b}>
                {b}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {models.length > 0 && (
        <div className="space-y-2">
          <Label className={labelCls}>Model</Label>
          <Select
            value={model || "all"}
            onValueChange={(v) => setModel(v === "all" ? "" : v)}
          >
            <SelectTrigger className={cn(inputCls, "w-full")}>
              <SelectValue placeholder="All models" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all">All models</SelectItem>
              {models.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <Label className={labelCls}>Condition</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setCondition((c) => (c === "NEW" ? "" : "NEW"))
            }
            className={cn(
              "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
              condition === "NEW"
                ? "border-amber-500 bg-amber-500 text-zinc-950"
                : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            )}
          >
            New
          </button>
          <button
            type="button"
            onClick={() =>
              setCondition((c) => (c === "USED" ? "" : "USED"))
            }
            className={cn(
              "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
              condition === "USED"
                ? "border-amber-500 bg-amber-500 text-zinc-950"
                : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            )}
          >
            Used
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelCls}>Year</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select
            value={minYear || "all"}
            onValueChange={(v) => setMinYear(v === "all" ? "" : v)}
          >
            <SelectTrigger className={cn(inputCls, "w-full")}>
              <SelectValue placeholder="From" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-zinc-900 border-zinc-700">
              <SelectItem value="all">From</SelectItem>
              {YEARS.map((y) => (
                <SelectItem key={`min-${y}`} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={maxYear || "all"}
            onValueChange={(v) => setMaxYear(v === "all" ? "" : v)}
          >
            <SelectTrigger className={cn(inputCls, "w-full")}>
              <SelectValue placeholder="To" />
            </SelectTrigger>
            <SelectContent className="max-h-60 bg-zinc-900 border-zinc-700">
              <SelectItem value="all">To</SelectItem>
              {YEARS.map((y) => (
                <SelectItem key={`max-${y}`} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelCls}>Price (JOD)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Min JOD"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className={inputCls}
            min={0}
          />
          <Input
            type="number"
            inputMode="numeric"
            placeholder="Max JOD"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={inputCls}
            min={0}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelCls}>Transmission</Label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setTransmission((t) => (t === "AUTO" ? "" : "AUTO"))
            }
            className={cn(
              "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
              transmission === "AUTO"
                ? "border-amber-500 bg-amber-500 text-zinc-950"
                : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            )}
          >
            Auto
          </button>
          <button
            type="button"
            onClick={() =>
              setTransmission((t) => (t === "MANUAL" ? "" : "MANUAL"))
            }
            className={cn(
              "flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors",
              transmission === "MANUAL"
                ? "border-amber-500 bg-amber-500 text-zinc-950"
                : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
            )}
          >
            Manual
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className={labelCls}>Fuel type</Label>
        <div className="grid grid-cols-2 gap-2">
          {FUEL_OPTIONS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() =>
                setFuelType((cur) => (cur === f.value ? "" : f.value))
              }
              className={cn(
                "rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors",
                fuelType === f.value
                  ? "border-amber-500 bg-amber-500 text-zinc-950"
                  : "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Button
          type="button"
          onClick={applyFilters}
          className="h-11 w-full bg-amber-500 text-zinc-950 hover:bg-amber-400"
        >
          Apply Filters
        </Button>
        <button
          type="button"
          onClick={clearAll}
          className="mt-3 w-full text-center text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Clear All
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:block">
        <div className="sticky top-[120px] h-fit rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
          <h2 className="mb-6 text-lg font-semibold text-zinc-100">
            Filters
          </h2>
          {filterBody}
        </div>
      </div>

      <div className="block lg:hidden">
        <Accordion
          type="single"
          collapsible
          className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-lg"
        >
          <AccordionItem value="refine" className="border-0">
            <AccordionTrigger className="px-4 py-4 text-zinc-100 hover:no-underline [&[data-state=open]]:border-b [&[data-state=open]]:border-zinc-800">
              Refine Search
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-6 pt-2">
              {filterBody}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
