export default function StatCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-lg shadow-black/20">
      <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-white mt-1.5 tabular-nums">{value}</p>
          {subtitle && (
            <p className="text-xs text-zinc-600 mt-1.5">{subtitle}</p>
          )}
        </div>
        <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/5">
          {icon}
        </div>
      </div>
    </div>
  );
}
