"use client";

import { useId, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { indexToValue, valueToIndex } from "@/lib/filter-scale";
import { formatNumber } from "@/lib/vehicle-format";

/**
 * Two-thumb range on a non-linear scale, with numeric inputs beside it.
 *
 * The slider is the Radix primitive, so it has the keyboard contract the
 * hand-rolled version never had: arrow keys, Home/End, Page Up/Down,
 * `role="slider"` and a live `aria-valuenow` on each thumb. The inputs exist
 * because someone with an exact budget should be able to type 18500 rather
 * than hunt for it on a track.
 */
export default function RangeFilter({
  label,
  stops,
  min,
  max,
  onCommit,
  unit,
  minPlaceholder = "Any",
  maxPlaceholder = "Any",
}: {
  label: string;
  stops: number[];
  min: number | undefined;
  max: number | undefined;
  onCommit: (next: { min?: number; max?: number }) => void;
  unit?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
}) {
  const floor = stops[0];
  const ceiling = stops[stops.length - 1];
  const id = useId();

  const toIndexes = (lo: number | undefined, hi: number | undefined): [number, number] => [
    valueToIndex(stops, lo ?? floor),
    valueToIndex(stops, hi ?? ceiling),
  ];

  const [indexes, setIndexes] = useState<[number, number]>(() =>
    toIndexes(min, max)
  );

  // Keep the thumbs in step when the URL changes from elsewhere (a chip being
  // cleared, the back button). Adjusting state during render rather than in an
  // effect avoids a second paint with stale thumb positions.
  const signature = `${min ?? ""}|${max ?? ""}|${stops.length}`;
  const [lastSignature, setLastSignature] = useState(signature);
  if (lastSignature !== signature) {
    setLastSignature(signature);
    setIndexes(toIndexes(min, max));
  }

  const loValue = indexToValue(stops, indexes[0]);
  const hiValue = indexToValue(stops, indexes[1]);

  function commitIndexes(next: number[]) {
    const lo = indexToValue(stops, next[0]);
    const hi = indexToValue(stops, next[1]);
    onCommit({
      min: lo <= floor ? undefined : lo,
      max: hi >= ceiling ? undefined : hi,
    });
  }

  function commitTyped(which: "min" | "max", raw: string) {
    const parsed = Number(raw.replace(/[^0-9]/g, ""));
    const value = Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
    const next =
      which === "min"
        ? { min: value, max: hiValue >= ceiling ? undefined : hiValue }
        : { min: loValue <= floor ? undefined : loValue, max: value };
    onCommit(next);
  }

  return (
    <div className="space-y-3">
      <Slider
        aria-label={`${label} range`}
        min={0}
        max={stops.length - 1}
        step={1}
        value={indexes}
        onValueChange={(v) => setIndexes([v[0], v[1]])}
        onValueCommit={commitIndexes}
        minStepsBetweenThumbs={1}
      />

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label htmlFor={`${id}-min`} className="sr-only">
            Minimum {label}
          </label>
          <input
            id={`${id}-min`}
            inputMode="numeric"
            defaultValue={min ? formatNumber(min) : ""}
            key={`min-${min ?? "any"}`}
            placeholder={minPlaceholder}
            onBlur={(e) => commitTyped("min", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="h-10 w-full rounded-control border border-line-control bg-surface px-3 text-body-sm text-ink tabular-nums placeholder:text-ink-3"
          />
        </div>
        <span aria-hidden="true" className="text-ink-3">
          –
        </span>
        <div className="flex-1">
          <label htmlFor={`${id}-max`} className="sr-only">
            Maximum {label}
          </label>
          <input
            id={`${id}-max`}
            inputMode="numeric"
            defaultValue={max ? formatNumber(max) : ""}
            key={`max-${max ?? "any"}`}
            placeholder={maxPlaceholder}
            onBlur={(e) => commitTyped("max", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
            className="h-10 w-full rounded-control border border-line-control bg-surface px-3 text-body-sm text-ink tabular-nums placeholder:text-ink-3"
          />
        </div>
      </div>

      <p className="text-caption text-ink-3" aria-live="polite">
        {formatNumber(loValue)} – {hiValue >= ceiling ? `${formatNumber(ceiling)}+` : formatNumber(hiValue)}
        {unit ? ` ${unit}` : ""}
      </p>
    </div>
  );
}
