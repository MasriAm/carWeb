"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Newest Arrivals" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "year_desc", label: "Year: Newest First" },
] as const;

function selectValueFromUrl(sortParam: string | null): string {
  if (
    sortParam === "price_asc" ||
    sortParam === "price_desc" ||
    sortParam === "year_desc"
  ) {
    return sortParam;
  }
  return "createdAt_desc";
}

export default function CarsMarketplaceSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const value = selectValueFromUrl(searchParams.get("sortBy"));

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[220px]">
      <Label className="text-ink-3 text-sm font-medium">Sort by</Label>
      <Select
        value={value}
        onValueChange={(next) => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete("page");
          if (next === "createdAt_desc") {
            params.delete("sortBy");
          } else {
            params.set("sortBy", next);
          }
          const q = params.toString();
          startTransition(() => {
            router.push(q ? `${pathname}?${q}` : pathname, { scroll: false });
          });
        }}
      >
        <SelectTrigger className="h-10 w-full rounded-md border border-line bg-surface text-ink shadow-sm">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent className="border border-line bg-surface text-ink">
          {SORT_OPTIONS.map((o) => (
            <SelectItem
              key={o.value}
              value={o.value}
              className="focus:bg-surface-2 focus:text-ink"
            >
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
