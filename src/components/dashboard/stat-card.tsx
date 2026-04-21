type StatColor = "amber" | "emerald" | "red" | "violet" | "blue";

const COLOR_STYLES: Record<
  StatColor,
  { glow: string; iconBg: string; iconBorder: string; iconText: string }
> = {
  amber: {
    glow: "bg-amber-500/5",
    iconBg: "bg-amber-500/10",
    iconBorder: "border-amber-500/20",
    iconText: "text-amber-500",
  },
  emerald: {
    glow: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/20",
    iconText: "text-emerald-400",
  },
  red: {
    glow: "bg-red-500/5",
    iconBg: "bg-red-500/10",
    iconBorder: "border-red-500/20",
    iconText: "text-red-400",
  },
  violet: {
    glow: "bg-violet-500/5",
    iconBg: "bg-violet-500/10",
    iconBorder: "border-violet-500/20",
    iconText: "text-violet-300",
  },
  blue: {
    glow: "bg-blue-500/5",
    iconBg: "bg-blue-500/10",
    iconBorder: "border-blue-500/20",
    iconText: "text-blue-400",
  },
};

export default function StatCard({
  title,
  value,
  icon,
  subtitle,
  color = "amber",
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
  color?: StatColor;
}) {
  const c = COLOR_STYLES[color];
  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg shadow-black/20">
      <div
        className={`absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl ${c.glow}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 tracking-wide">
            {title}
          </p>
          <p className="text-3xl font-bold text-white mt-1.5 tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-600 mt-1.5">{subtitle}</p>
          )}
        </div>
        <div
          className={`h-11 w-11 rounded-xl border flex items-center justify-center shadow-lg shadow-black/20 ${c.iconBg} ${c.iconBorder} ${c.iconText}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
