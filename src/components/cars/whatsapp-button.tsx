import { WhatsAppIcon } from "@/components/ui/brand-icons";
import { cn } from "@/lib/utils";

/**
 * WhatsApp is the primary contact channel in this market, so it gets the
 * card's primary action slot rather than a generic "Details" button that
 * duplicated the card's own link.
 */
export default function WhatsAppButton({
  href,
  label,
  className,
  full = false,
}: {
  href: string;
  label: string;
  className?: string;
  full?: boolean;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Message the seller about the ${label} on WhatsApp`}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-wa px-4 text-body-sm font-semibold text-white transition-colors hover:bg-wa-hover",
        full ? "w-full" : "flex-1",
        className
      )}
    >
      <WhatsAppIcon className="h-4 w-4" />
      WhatsApp
    </a>
  );
}
