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
  {
    label: "Overview",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: ["USER", "DEALER", "ADMIN"],
  },
  {
    label: "Saved Cars",
    href: "/dashboard/saved",
    icon: <Heart className="h-4 w-4" />,
    roles: ["USER", "DEALER", "ADMIN"],
  },
  {
    label: "My Vehicles",
    href: "/dashboard/vehicles",
    icon: <Car className="h-4 w-4" />,
    roles: ["DEALER", "ADMIN"],
  },
  {
    label: "Dealership",
    href: "/dashboard/dealership",
    icon: <Building2 className="h-4 w-4" />,
    roles: ["DEALER", "ADMIN"],
  },
  {
    label: "All Users",
    href: "/dashboard/admin/users",
    icon: <Users className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
  {
    label: "All Vehicles",
    href: "/dashboard/admin/vehicles",
    icon: <ShieldCheck className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
  {
    label: "All Dealerships",
    href: "/dashboard/admin/dealerships",
    icon: <Building2 className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
];

export default function DashboardShell({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredNav = NAV_ITEMS.filter((item) => item.roles.includes(role));

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  const navContent = (
    <nav className="flex flex-col gap-1 flex-1">
      {filteredNav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive(item.href)
              ? "bg-neutral-900 text-white"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-neutral-200 hidden lg:flex flex-col z-30">
        <div className="px-6 py-5 border-b border-neutral-200">
          <Link href="/" className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-neutral-900" />
            <span className="font-bold text-lg text-neutral-900">Royal Cars</span>
          </Link>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
            {role} Dashboard
          </p>
        </div>

        <div className="flex-1 px-3 py-4 overflow-y-auto">
          {navContent}
        </div>

        <div className="px-3 py-4 border-t border-neutral-200">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-neutral-600 hover:text-red-600"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-neutral-900" />
          <span className="font-bold text-neutral-900">Royal Cars</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg hover:bg-neutral-100"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden flex flex-col shadow-xl">
            <div className="px-6 py-5 border-b border-neutral-200">
              <span className="font-bold text-lg text-neutral-900">Dashboard</span>
              <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                {role}
              </p>
            </div>
            <div className="flex-1 px-3 py-4 overflow-y-auto">{navContent}</div>
            <div className="px-3 py-4 border-t border-neutral-200">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-neutral-600 hover:text-red-600"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
