"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Crown, Menu, LogIn, UserPlus, LayoutDashboard, LogOut, User } from "lucide-react";
import { useSession } from "@/lib/session-provider";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/about", label: "About Us" },
];

export default function Header() {
  const pathname = usePathname();
  const { user } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Crown className="h-6 w-6 text-amber-500 transition-transform group-hover:scale-110" />
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-tight text-white">
                Royal Cars
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-amber-500/80 font-medium">
                Jordan
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname === link.href
                    ? "bg-amber-500 text-zinc-950"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full bg-zinc-800 border border-zinc-700 pl-3 pr-1 py-1 hover:bg-zinc-700 transition-colors">
                    <span className="text-sm font-medium text-zinc-300 max-w-[120px] truncate">
                      {user.name || "Account"}
                    </span>
                    <div className="h-7 w-7 rounded-full bg-amber-500 text-zinc-950 flex items-center justify-center text-xs font-bold shrink-0">
                      {initials}
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
                  <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer">
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-zinc-300 focus:bg-zinc-800 focus:text-white cursor-pointer">
                    <Link href="/dashboard/profile" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-red-400 focus:bg-zinc-800 focus:text-red-300 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="rounded-full bg-amber-500 text-zinc-950 hover:bg-amber-400"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-zinc-800"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-zinc-950 border-zinc-800">
              <div className="flex items-center gap-2.5 mb-8 mt-4">
                <Crown className="h-6 w-6 text-amber-500" />
                <span className="text-lg font-bold text-white">Royal Cars</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-amber-500/10 text-amber-500"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-zinc-800 my-4" />
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        setOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-zinc-900 text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium bg-amber-500 text-zinc-950 text-center"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
