import Image from "next/image";
import { Car } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Listing photo with a real fallback.
 *
 * When an image host is unreachable the old card became an empty black box
 * with no indication anything was wrong. A missing photo now looks
 * deliberate.
 *
 * `sizes` matches the grid's actual breakpoints (1 column, 2 at 640, 3 with
 * the sidebar at 1280); they previously described a different layout, so
 * tablets downloaded images sized for a full-width viewport.
 */
export const GRID_IMAGE_SIZES =
  "(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 400px";

export default function CarPhoto({
  src,
  alt,
  priority = false,
  sizes = GRID_IMAGE_SIZES,
  className,
  aspect = "aspect-[4/3]",
}: {
  src: string | undefined;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  aspect?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-surface-2",
          aspect,
          className
        )}
      >
        <span className="flex flex-col items-center gap-1.5 text-ink-3">
          <Car className="h-8 w-8" aria-hidden="true" />
          <span className="text-caption font-medium">No photo</span>
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-surface-2", aspect, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>
  );
}
