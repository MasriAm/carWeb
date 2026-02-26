import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="bg-zinc-900 border-zinc-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-400">{title}</p>
            <p className="text-3xl font-bold text-white mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-zinc-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
