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
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">{title}</p>
            <p className="text-3xl font-bold text-neutral-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-neutral-400 mt-1">{subtitle}</p>
            )}
          </div>
          <div className="h-10 w-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
