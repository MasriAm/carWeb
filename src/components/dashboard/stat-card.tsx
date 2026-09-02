import { cn } from "@/lib/utils";

/**
 * Dashboard stat tile.
 *
 * Tone is semantic, not decorative: `brand` for the headline figure of a
 * screen, `trust` and `danger` where the number itself carries a state, and
 * `neutral` for everything else. The previous violet/blue/emerald/red rotation
 * coloured tiles for variety, which made colour meaningless.
 */
type StatTone = "neutral" | "brand" | "trust" | "danger";

const TONE: Record<StatTone, string> = {
  neutral: "border-line bg-surface-2 text-ink-2",
  brand: "border-brand/30 bg-brand-soft text-brand-strong",
  trust: "border-trust/25 bg-trust-soft text-trust",
  danger: "border-danger/25 bg-danger-soft text-danger",
};

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  tone = "neutral",
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  tone?: StatTone;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-meta font-medium text-ink-3">{title}</p>
          <p className="mt-1.5 font-display text-display text-ink">{value}</p>
          {subtitle && (
            <p className="mt-1.5 text-caption text-ink-3">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-control border",
            TONE[tone]
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
