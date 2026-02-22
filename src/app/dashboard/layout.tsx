import { requireAuth } from "@/lib/auth-utils";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export const metadata = {
  title: "Dashboard — Royal Cars",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return <DashboardShell role={user.role}>{children}</DashboardShell>;
}
