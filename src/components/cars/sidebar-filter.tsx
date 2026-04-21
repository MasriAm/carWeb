"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Sliders, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─── Constants ────────────────────────────────────────────────── */

const CURRENT_YEAR = new Date().getFullYear();

export const PRICE_MIN = 0;
export const PRICE_MAX = 500_000;
export const YEAR_MIN = 2010;
export const YEAR_MAX = CURRENT_YEAR;

export const CONDITION_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "USED", label: "Used" },
] as const;

export const FUEL_OPTIONS = [
  { value: "GAS", label: "Gasoline" },
  { value: "DIESEL", label: "Diesel" },
  { value: "ELECTRIC", label: "Electric" },
  { value: "HYBRID", label: "Hybrid" },
] as const;

export const TRANSMISSION_OPTIONS = [
  { value: "AUTO", label: "Auto" },
  { value: "MANUAL", label: "Manual" },
] as const;

export const BODY_OPTIONS = [
  { value: "SUV", label: "SUV" },
  { value: "SEDAN", label: "Sedan" },
  { value: "HATCHBACK", label: "Hatchback" },
  { value: "CONVERTIBLE", label: "Convertible" },
  { value: "COUPE", label: "Coupe" },
] as const;

/* ─── Shared filter hook ───────────────────────────────────────── */

export type CarFilters = {
  brand: string;
  condition: string;
  transmission: string;
  fuelType: string;
  bodyType: string;
  price: [number, number];
  year: [number, number];
};

function filtersFromParams(sp: URLSearchParams): CarFilters {
  const num = (k: string, fallback: number) => {
    const raw = sp.get(k);
    if (!raw) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  };
  return {
    brand: sp.get("brand") ?? "",
    condition: sp.get("condition") ?? "",
    transmission: sp.get("transmission") ?? "",
    fuelType: sp.get("fuelType") ?? "",
    bodyType: sp.get("bodyType") ?? "",
    price: [num("minPrice", PRICE_MIN), num("maxPrice", PRICE_MAX)],
    year: [num("minYear", YEAR_MIN), num("maxYear", YEAR_MAX)],
  };
}

export function useCarFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const spKey = searchParams.toString();

  // URL is the source of truth — derive filters during render.
  const urlFilters = useMemo<CarFilters>(
    () => filtersFromParams(new URLSearchParams(spKey)),
    [spKey]
  );

  // Local draft for smooth slider drag. null = use URL directly.
  const [draft, setDraft] = useState<CarFilters | null>(null);

  // When the URL changes (e.g. after a commit, or from pagination/sort),
  // drop any stale draft by comparing the previous URL key during render.
  const [prevSpKey, setPrevSpKey] = useState(spKey);
  if (prevSpKey !== spKey) {
    setPrevSpKey(spKey);
    if (draft !== null) setDraft(null);
  }

  const filters = draft ?? urlFilters;

  const pushFilters = useCallback(
    (next: CarFilters) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      params.delete("year");

      const setOrDelete = (key: string, value: string) => {
        if (value) params.set(key, value);
        else params.delete(key);
      };

      setOrDelete("brand", next.brand);
      setOrDelete("condition", next.condition);
      setOrDelete("transmission", next.transmission);
      setOrDelete("fuelType", next.fuelType);
      setOrDelete("bodyType", next.bodyType);

      if (next.price[0] > PRICE_MIN)
        params.set("minPrice", String(next.price[0]));
      else params.delete("minPrice");
      if (next.price[1] < PRICE_MAX)
        params.set("maxPrice", String(next.price[1]));
      else params.delete("maxPrice");

      if (next.year[0] > YEAR_MIN)
        params.set("minYear", String(next.year[0]));
      else params.delete("minYear");
      if (next.year[1] < YEAR_MAX)
        params.set("maxYear", String(next.year[1]));
      else params.delete("maxYear");

      setDraft(null);
      const q = params.toString();
      startTransition(() => {
        router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // Chip / toggle handlers: commit the new filters to URL immediately.
  const updateAndCommit = useCallback(
    (producer: (prev: CarFilters) => CarFilters) => {
      pushFilters(producer(filters));
    },
    [filters, pushFilters]
  );

  // Range slider drag: mutate local draft only; URL is untouched until commit.
  const updateLocal = useCallback(
    (producer: (prev: CarFilters) => CarFilters) => {
      setDraft((prev) => producer(prev ?? urlFilters));
    },
    [urlFilters]
  );

  const commit = useCallback(() => {
    if (draft) pushFilters(draft);
  }, [draft, pushFilters]);

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    [
      "brand",
      "condition",
      "transmission",
      "fuelType",
      "bodyType",
      "minPrice",
      "maxPrice",
      "minYear",
      "maxYear",
      "year",
      "page",
    ].forEach((k) => params.delete(k));
    setDraft(null);
    const q = params.toString();
    startTransition(() => {
      router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
    });
  }, [pathname, router, searchParams]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.brand) n++;
    if (filters.condition) n++;
    if (filters.transmission) n++;
    if (filters.fuelType) n++;
    if (filters.bodyType) n++;
    if (filters.price[0] > PRICE_MIN || filters.price[1] < PRICE_MAX) n++;
    if (filters.year[0] > YEAR_MIN || filters.year[1] < YEAR_MAX) n++;
    return n;
  }, [filters]);

  return {
    filters,
    setFilters: updateAndCommit,
    setFiltersLocal: updateLocal,
    commit,
    clearAll,
    activeCount,
    isPending,
  };
}

/* ─── Range Slider ────────────────────────────────────────────── */

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  onCommit,
  format,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  onCommit?: () => void;
  format: (v: number) => string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const startDrag = (thumb: "lo" | "hi") => (e: React.PointerEvent) => {
    e.preventDefault();
    const track = trackRef.current;
    if (!track) return;

    const move = (ev: PointerEvent) => {
      const rect = track.getBoundingClientRect();
      const raw = min + ((ev.clientX - rect.left) / rect.width) * (max - min);
      const clamped = Math.max(min, Math.min(max, Math.round(raw)));
      const [lo, hi] = valueRef.current;
      if (thumb === "lo") {
        onChange([Math.min(clamped, hi - 1), hi]);
      } else {
        onChange([lo, Math.max(clamped, lo + 1)]);
      }
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      onCommit?.();
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };

  return (
    <div>
      <div
        ref={trackRef}
        className="relative mx-2.5 mt-5 mb-2 h-1 rounded-full bg-zinc-800 select-none"
      >
        <div
          className="absolute h-full rounded-full bg-amber-500"
          style={{
            left: `${pct(value[0])}%`,
            right: `${100 - pct(value[1])}%`,
          }}
        />
        {(["lo", "hi"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-label={t === "lo" ? "Minimum" : "Maximum"}
            onPointerDown={startDrag(t)}
            className="absolute top-1/2 h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none rounded-full border-2 border-zinc-950 bg-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.2)] active:cursor-grabbing"
            style={{
              left: `${pct(t === "lo" ? value[0] : value[1])}%`,
            }}
          />
        ))}
      </div>
      <div className="mt-4 flex justify-between text-xs font-semibold text-amber-500">
        <span>{format(value[0])}</span>
        <span>{format(value[1])}</span>
      </div>
    </div>
  );
}

export const formatPrice = (v: number) =>
  v === PRICE_MIN
    ? "Any"
    : v >= PRICE_MAX
    ? "500K+"
    : v >= 1000
    ? `${Math.round(v / 1000)}K`
    : String(v);

export const formatYear = (v: number) => String(v);

/* ─── Section (accordion) ─────────────────────────────────────── */

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-zinc-800 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-3 text-[10px] font-bold uppercase tracking-[0.09em] text-zinc-300 hover:text-zinc-100"
      >
        {title}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-zinc-600 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-250 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Chip ────────────────────────────────────────────────────── */

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-md border px-[11px] py-1 text-xs font-medium transition-colors",
        active
          ? "border-amber-500 bg-amber-500/10 text-amber-500"
          : "border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
      )}
    >
      {label}
    </button>
  );
}

/* ─── Toggle row (two-button group) ───────────────────────────── */

function ToggleRow<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly { value: T; label: string }[];
  value: string;
  onChange: (v: T | "") => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(value === opt.value ? "" : opt.value)}
          className={cn(
            "rounded-lg border px-2 py-2 text-xs font-semibold transition-colors",
            value === opt.value
              ? "border-amber-500 bg-amber-500/10 text-amber-500"
              : "border-zinc-800 bg-transparent text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Filter body (shared between desktop panel & mobile sheet) ─ */

export function FilterSections({
  brands,
  filters,
  setFilters,
  setFiltersLocal,
  commit,
}: {
  brands: string[];
  filters: CarFilters;
  setFilters: (fn: (p: CarFilters) => CarFilters) => void;
  setFiltersLocal: (fn: (p: CarFilters) => CarFilters) => void;
  commit: () => void;
}) {
  return (
    <div className="px-6">
      <Section title="Brand">
        <div className="flex flex-wrap gap-1.5 pb-1">
          {brands.map((b) => (
            <Chip
              key={b}
              label={b}
              active={filters.brand === b}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  brand: f.brand === b ? "" : b,
                }))
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Condition">
        <ToggleRow
          options={CONDITION_OPTIONS}
          value={filters.condition}
          onChange={(v) =>
            setFilters((f) => ({ ...f, condition: v }))
          }
        />
      </Section>

      <Section title="Price (JOD)">
        <div className="px-1 pt-2 pb-1">
          <RangeSlider
            min={PRICE_MIN}
            max={PRICE_MAX}
            value={filters.price}
            onChange={(v) => setFiltersLocal((f) => ({ ...f, price: v }))}
            onCommit={commit}
            format={formatPrice}
          />
        </div>
      </Section>

      <Section title="Year">
        <div className="px-1 pt-2 pb-1">
          <RangeSlider
            min={YEAR_MIN}
            max={YEAR_MAX}
            value={filters.year}
            onChange={(v) => setFiltersLocal((f) => ({ ...f, year: v }))}
            onCommit={commit}
            format={formatYear}
          />
        </div>
      </Section>

      <Section title="Fuel Type">
        <div className="flex flex-wrap gap-1.5 pb-1">
          {FUEL_OPTIONS.map((f) => (
            <Chip
              key={f.value}
              label={f.label}
              active={filters.fuelType === f.value}
              onClick={() =>
                setFilters((cur) => ({
                  ...cur,
                  fuelType: cur.fuelType === f.value ? "" : f.value,
                }))
              }
            />
          ))}
        </div>
      </Section>

      <Section title="Transmission">
        <ToggleRow
          options={TRANSMISSION_OPTIONS}
          value={filters.transmission}
          onChange={(v) =>
            setFilters((f) => ({ ...f, transmission: v }))
          }
        />
      </Section>

      <Section title="Body Type" defaultOpen={false}>
        <div className="flex flex-wrap gap-1.5 pb-1">
          {BODY_OPTIONS.map((b) => (
            <Chip
              key={b.value}
              label={b.label}
              active={filters.bodyType === b.value}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  bodyType: f.bodyType === b.value ? "" : b.value,
                }))
              }
            />
          ))}
        </div>
      </Section>

      <div className="h-6" />
    </div>
  );
}

/* ─── Desktop sidebar ─────────────────────────────────────────── */

export default function SidebarFilter({
  brands,
  resultsCount,
}: {
  brands: string[];
  resultsCount: number;
}) {
  const {
    filters,
    setFilters,
    setFiltersLocal,
    commit,
    clearAll,
    activeCount,
  } = useCarFilters();

  return (
    <div className="hidden overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40 lg:block">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-[18px] py-4">
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-100">
          <Sliders className="h-3.5 w-3.5 text-amber-500" />
          Filters
          {activeCount > 0 && (
            <span className="rounded-full bg-amber-500 px-1.5 py-px text-[9px] font-extrabold leading-4 text-zinc-950">
              {activeCount}
            </span>
          )}
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-semibold text-amber-500 hover:text-amber-400"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="scrollbar-dark max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Results count */}
        <div className="mx-[18px] border-b border-zinc-800 py-2.5 text-xs text-zinc-500">
          <span className="font-bold text-amber-500">{resultsCount}</span>{" "}
          vehicle{resultsCount !== 1 ? "s" : ""} found
        </div>

        <FilterSections
          brands={brands}
          filters={filters}
          setFilters={setFilters}
          setFiltersLocal={setFiltersLocal}
          commit={commit}
        />
      </div>
    </div>
  );
}

/* ─── Active filter chips (shown above results) ────────────────── */

export function ActiveFilterChips() {
  const { filters, setFilters, clearAll, activeCount } = useCarFilters();

  if (activeCount === 0) return null;

  const tags: { key: string; label: string; clear: () => void }[] = [];

  const labelOf = <T extends { value: string; label: string }>(
    opts: readonly T[],
    v: string
  ) => opts.find((o) => o.value === v)?.label ?? v;

  if (filters.brand) {
    tags.push({
      key: "brand",
      label: filters.brand,
      clear: () => setFilters((f) => ({ ...f, brand: "" })),
    });
  }
  if (filters.condition) {
    tags.push({
      key: "condition",
      label: labelOf(CONDITION_OPTIONS, filters.condition),
      clear: () => setFilters((f) => ({ ...f, condition: "" })),
    });
  }
  if (filters.fuelType) {
    tags.push({
      key: "fuelType",
      label: labelOf(FUEL_OPTIONS, filters.fuelType),
      clear: () => setFilters((f) => ({ ...f, fuelType: "" })),
    });
  }
  if (filters.bodyType) {
    tags.push({
      key: "bodyType",
      label: labelOf(BODY_OPTIONS, filters.bodyType),
      clear: () => setFilters((f) => ({ ...f, bodyType: "" })),
    });
  }
  if (filters.transmission) {
    tags.push({
      key: "transmission",
      label: labelOf(TRANSMISSION_OPTIONS, filters.transmission),
      clear: () => setFilters((f) => ({ ...f, transmission: "" })),
    });
  }
  if (filters.price[0] > PRICE_MIN || filters.price[1] < PRICE_MAX) {
    tags.push({
      key: "price",
      label: `${formatPrice(filters.price[0])}–${formatPrice(
        filters.price[1]
      )} JOD`,
      clear: () =>
        setFilters((f) => ({ ...f, price: [PRICE_MIN, PRICE_MAX] })),
    });
  }
  if (filters.year[0] > YEAR_MIN || filters.year[1] < YEAR_MAX) {
    tags.push({
      key: "year",
      label: `${filters.year[0]}–${filters.year[1]}`,
      clear: () =>
        setFilters((f) => ({ ...f, year: [YEAR_MIN, YEAR_MAX] })),
    });
  }

  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5">
      <span className="mr-0.5 text-[11px] font-medium text-zinc-500">
        Active:
      </span>
      {tags.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={t.clear}
          className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/[0.07] px-2.5 py-1 text-[11px] font-medium leading-tight text-amber-500 hover:bg-amber-500/10"
        >
          {t.label}
          <X className="h-2.5 w-2.5 opacity-70" />
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="ml-1 px-1 py-1 text-[11px] text-zinc-500 hover:text-zinc-300"
      >
        Clear all
      </button>
    </div>
  );
}
