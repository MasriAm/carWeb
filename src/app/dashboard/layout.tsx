import { Suspense } from "react";
import { requireAuth } from "@/lib/auth-utils";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

/**
 * The dashboard is entirely personal, so its shell depends on the session.
 * Reading it inside a Suspense boundary keeps that dependency contained: the
 * document and its styles still stream immediately.
 */
async function AuthedShell({ children }: { children: React.ReactNode }) {
  const user = await requireAuth();
  return (
    <DashboardShell role={user.role} userName={user.name}>
      {children}
    </DashboardShell>
  );
}

function ShellFallback() {
  return (
    <div className="min-h-screen bg-canvas">
      <div className="h-header border-b border-line bg-surface" />
      <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
        <div
          aria-hidden="true"
          className="h-8 w-56 animate-pulse rounded bg-surface-2"
        />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<ShellFallback />}>
      <AuthedShell>{children}</AuthedShell>
    </Suspense>
  );
}
