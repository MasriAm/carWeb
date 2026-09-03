"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookmarkPlus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { saveSearch } from "@/lib/actions/account";

/**
 * Keeps the current filter set so the buyer can come back to it.
 *
 * The query string is what gets stored, so re-running a saved search is just
 * a navigation and the URL stays the single source of truth for filter state.
 */
export default function SaveSearchButton({
  isLoggedIn,
  suggestedName,
}: {
  isLoggedIn: boolean;
  suggestedName: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(suggestedName);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const query = searchParams.toString();

  if (!isLoggedIn) {
    return (
      <Button
        type="button"
        variant="outline"
        className="h-10 gap-2 border-line-control"
        onClick={() =>
          router.push(
            `/login?callbackUrl=${encodeURIComponent(`/cars${query ? `?${query}` : ""}`)}`
          )
        }
      >
        <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
        Save search
      </Button>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setName(suggestedName);
          setError(null);
          setSaved(false);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 gap-2 border-line-control"
        >
          {saved ? (
            <Check className="h-4 w-4 text-trust" aria-hidden="true" />
          ) : (
            <BookmarkPlus className="h-4 w-4" aria-hidden="true" />
          )}
          {saved ? "Saved" : "Save search"}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(null);
            startTransition(async () => {
              const result = await saveSearch({ name, query });
              if (!result.success) {
                setError(result.error);
                return;
              }
              setSaved(true);
              setOpen(false);
            });
          }}
        >
          <label
            htmlFor="saved-search-name"
            className="block text-body-sm font-medium text-ink"
          >
            Name this search
          </label>
          <input
            id="saved-search-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            className="mt-2 h-10 w-full rounded-control border border-line-control bg-surface px-3 text-body-sm text-ink"
          />
          {error && (
            <p role="alert" className="mt-2 text-body-sm text-danger">
              {error}
            </p>
          )}
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={isPending || !name.trim()}>
              {isPending ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
