"use client";

import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * Segmented control. Radix gives roving focus and arrow-key navigation, so a
 * keyboard user tabs into the group once rather than through every option.
 */
function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn(
        "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-control border border-line-control bg-surface px-3 text-body-sm font-medium text-ink-2 transition-colors",
        "hover:border-ink-3 hover:text-ink",
        "data-[state=on]:border-brand data-[state=on]:bg-brand-soft data-[state=on]:font-semibold data-[state=on]:text-ink",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
