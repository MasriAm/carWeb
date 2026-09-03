"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Role } from "@/generated/prisma/client";
import {
  LayoutDashboard,
  Car,
  Heart,
  Building2,
  Users,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Crown,
  ArrowLeft,
  UserCog,
  Plus,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: Role[];
};

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, roles: ["USER", "DEALER", "ADMIN"] },
  { label: "My Vehicles", href: "/dashboard/vehicles", icon: <Car className="h-4 w-4" />, roles: ["DEALER", "ADMIN"] },
  { label: "Dealership", href: "/dashboard/dealership", icon: <Building2 className="h-4 w-4" />, roles: ["DEALER", "ADMIN"] },
  { label: "All Vehicles", href: "/dashboard/admin/vehicles", icon: <ShieldCheck className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "All Dealerships", href: "/dashboard/admin/dealerships", icon: <Building2 className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "All Users", href: "/dashboard/admin/users", icon: <Users className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "Saved Cars", href: "/dashboard/saved", icon: <Heart className="h-4 w-4" />, roles: ["USER", "DEALER", "ADMIN"] },
  { label: "Saved Searches", href: "/dashboard/searches", icon: <Bookmark className="h-4 w-4" />, roles: ["USER", "DEALER", "ADMIN"] },
  { label: "Profile Settings", href: "/dashboard/profile", icon: <UserCog className="h-4 w-4" />, roles: ["USER", "DEALER", "ADMIN"] },
];

export default function DashboardShell({
  role,
  userName,
  children,
}: {
  role: Role;
  userName?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dealers previously had Overview and Saved Cars hidden from them for no
  // stated reason, so a dealer could not reach their own saved listings.
  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : role[0];

  const canAddVehicle = role === "DEALER" || role === "ADMIN";

  const roleLabel =
    role === "ADMIN" ? "Admin" : role === "DEALER" ? "Dealer" : "Buyer";

  const roleBadge = (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-caption font-bold text-brand-ink">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-meta font-semibold text-ink">
          {userName || roleLabel}
        </p>
        <p className="text-caption text-ink-3">{roleLabel}</p>
      </div>
    </div>
  );

  const sidebarNav = (
    <nav className="flex flex-col gap-0.5 flex-1">
      {filteredNav.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
              active
                ? "bg-surface-2/60 text-ink"
                : "text-ink-3 hover:bg-surface-2/40 hover:text-ink-2"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-brand" />
            )}
            <span className={active ? "text-brand-strong" : "text-ink-3 group-hover:text-ink-3"}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* ─── Top Navigation Bar ─── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-canvas border-b border-line z-50 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-2 text-ink-3"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <Crown className="h-6 w-6 text-brand-strong" />
            <span className="font-bold text-lg text-ink hidden sm:inline">Royal Cars</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {canAddVehicle && (
            <Link href="/dashboard/vehicles/new">
              <Button size="sm" className="bg-brand text-brand-ink hover:bg-brand-hover h-9 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Add a car</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          )}
          <Link
            href="/dashboard/profile"
            className="h-9 w-9 rounded-full bg-gradient-to-br from-brand to-brand-hover flex items-center justify-center text-brand-ink text-xs font-bold shadow-lg shadow-lift"
            title={`Signed in as ${userName || role}`}
          >
            {initials}
          </Link>
        </div>
      </header>

      {/* ─── Desktop Sidebar ─── */}
      <aside className="fixed top-16 left-0 bottom-0 w-[260px] bg-canvas border-r border-line hidden lg:flex flex-col z-30">
        {roleBadge}
        <div className="px-4 pt-5 pb-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand-strong hover:bg-brand-soft transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        <div className="flex-1 px-4 overflow-y-auto">
          {sidebarNav}
        </div>

        <div className="px-4 py-4 border-t border-line">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-ink-3 hover:text-danger hover:bg-surface-2/50 h-10"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ─── Mobile Drawer ─── */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed top-16 left-0 bottom-0 w-[260px] bg-canvas z-50 lg:hidden flex flex-col shadow-2xl border-r border-line">
            {roleBadge}
            <div className="px-4 pt-4 pb-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-brand-strong hover:bg-brand-soft transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
              </Link>
            </div>
            <div className="flex-1 px-4 overflow-y-auto">
              {sidebarNav}
            </div>
            <div className="px-4 py-4 border-t border-line">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-ink-3 hover:text-danger hover:bg-surface-2/50 h-10"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </aside>
        </>
      )}

      {/* ─── Main Content ─── */}
      <main className="lg:ps-[260px] pt-header">
        <div className="max-w-page mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
