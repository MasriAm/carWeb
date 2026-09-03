"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteSavedSearch } from "@/lib/actions/account";

export default function SavedSearchRow({
  id,
  name,
  query,
  description,
}: {
  id: string;
  name: string;
  query: string;
  description: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 p-4">
      <Link
        href={`/cars${query ? `?${query}` : ""}`}
        className="min-w-0 flex-1 rounded-control"
      >
        <span className="block truncate text-body font-semibold text-ink">
          {name}
        </span>
        <span className="block truncate text-body-sm text-ink-3">
          {description}
        </span>
      </Link>
      <button
        type="button"
        disabled={isPending}
        aria-label={`Delete saved search ${name}`}
        onClick={() =>
          startTransition(async () => {
            await deleteSavedSearch(id);
            router.refresh();
          })
        }
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-control text-ink-3 transition-colors hover:bg-danger-soft hover:text-danger disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
