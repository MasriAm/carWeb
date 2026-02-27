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
  Bell,
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
  { label: "Saved Cars", href: "/dashboard/saved", icon: <Heart className="h-4 w-4" />, roles: ["USER", "DEALER", "ADMIN"] },
  { label: "Profile Settings", href: "/dashboard/profile", icon: <UserCog className="h-4 w-4" />, roles: ["USER", "DEALER", "ADMIN"] },
  { label: "My Vehicles", href: "/dashboard/vehicles", icon: <Car className="h-4 w-4" />, roles: ["DEALER", "ADMIN"] },
  { label: "Dealership", href: "/dashboard/dealership", icon: <Building2 className="h-4 w-4" />, roles: ["DEALER", "ADMIN"] },
  { label: "All Users", href: "/dashboard/admin/users", icon: <Users className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "All Vehicles", href: "/dashboard/admin/vehicles", icon: <ShieldCheck className="h-4 w-4" />, roles: ["ADMIN"] },
  { label: "All Dealerships", href: "/dashboard/admin/dealerships", icon: <Building2 className="h-4 w-4" />, roles: ["ADMIN"] },
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

  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : role[0];

  const canAddVehicle = role === "DEALER" || role === "ADMIN";

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
                ? "bg-zinc-800/60 text-white"
                : "text-zinc-500 hover:bg-zinc-800/40 hover:text-zinc-200"
            }`}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-amber-500" />
            )}
            <span className={active ? "text-amber-500" : "text-zinc-600 group-hover:text-zinc-400"}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* ─── Top Navigation Bar ─── */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 z-50 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-zinc-800 text-zinc-400"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <Crown className="h-6 w-6 text-amber-500" />
            <span className="font-bold text-lg text-white hidden sm:inline">Royal Cars</span>
          </Link>
          <span className="hidden lg:inline text-xs text-zinc-600 border-l border-zinc-800 pl-3 ml-1 uppercase tracking-widest font-medium">
            {role} Panel
          </span>
        </div>

        <div className="flex items-center gap-2">
          {canAddVehicle && (
            <Link href="/dashboard/vehicles/new">
              <Button size="sm" className="bg-amber-500 text-zinc-950 hover:bg-amber-400 h-9 text-xs font-semibold">
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                <span className="hidden sm:inline">Add Vehicle</span>
                <span className="sm:hidden">New</span>
              </Button>
            </Link>
          )}
          <button className="relative h-9 w-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors">
            <Bell className="h-4 w-4" />
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-zinc-950 text-xs font-bold shadow-lg shadow-amber-500/20"
            title={`Signed in as ${userName || role}`}
          >
            {initials}
          </button>
        </div>
      </header>

      {/* ─── Desktop Sidebar ─── */}
      <aside className="fixed top-16 left-0 bottom-0 w-[260px] bg-zinc-950 border-r border-zinc-800 hidden lg:flex flex-col z-30">
        <div className="px-4 pt-5 pb-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        <div className="flex-1 px-4 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Navigation
          </p>
          {sidebarNav}
        </div>

        <div className="px-4 py-4 border-t border-zinc-800">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50 h-10"
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
          <aside className="fixed top-16 left-0 bottom-0 w-[260px] bg-zinc-950 z-50 lg:hidden flex flex-col shadow-2xl border-r border-zinc-800">
            <div className="px-4 pt-4 pb-2">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Marketplace
              </Link>
            </div>
            <div className="flex-1 px-4 overflow-y-auto">
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                Navigation
              </p>
              {sidebarNav}
            </div>
            <div className="px-4 py-4 border-t border-zinc-800">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50 h-10"
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
      <main className="lg:pl-[260px] pt-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
