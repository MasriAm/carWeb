"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toggleSaveVehicle } from "@/lib/actions/vehicles";
import { cn } from "@/lib/utils";

/**
 * Save toggle.
 *
 * A client island rather than part of the card, so the card itself stays a
 * server component. Optimistic so the heart responds to the tap immediately
 * rather than after a network round trip.
 */
export default function SaveButton({
  vehicleId,
  vehicleLabel,
  initialSaved,
  isLoggedIn,
  className,
}: {
  vehicleId: string;
  vehicleLabel: string;
  initialSaved: boolean;
  isLoggedIn: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [optimisticSaved, setOptimisticSaved] = useOptimistic(saved);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(false);

  const label = optimisticSaved
    ? `Remove ${vehicleLabel} from saved cars`
    : `Save ${vehicleLabel}`;

  function handleClick() {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/cars/${vehicleId}`)}`);
      return;
    }

    startTransition(async () => {
      setOptimisticSaved(!optimisticSaved);
      setError(false);
      try {
        const result = await toggleSaveVehicle(vehicleId);
        setSaved(result.saved);
      } catch {
        // Leaves the heart in its true state and tells the user, rather than
        // silently showing a save that did not happen.
        setError(true);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={label}
      aria-pressed={isLoggedIn ? optimisticSaved : undefined}
      title={error ? "Could not save. Try again." : label}
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center rounded-control border transition-colors",
        optimisticSaved
          ? "border-danger/30 bg-danger-soft text-danger"
          : "border-line-control bg-surface text-ink-2 hover:bg-surface-2",
        error && "border-danger",
        className
      )}
    >
      <Heart
        className={cn("h-5 w-5", optimisticSaved && "fill-current")}
        aria-hidden="true"
      />
    </button>
  );
}
