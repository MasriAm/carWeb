"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Car, Menu, LogIn, UserPlus, LayoutDashboard } from "lucide-react";
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Car
              className={`h-7 w-7 transition-colors ${
                scrolled ? "text-neutral-900" : "text-white"
              }`}
            />
            <span
              className={`text-xl font-bold tracking-tight transition-colors ${
                scrolled ? "text-neutral-900" : "text-white"
              }`}
            >
              Royal Cars
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname === link.href
                    ? scrolled
                      ? "bg-neutral-900 text-white"
                      : "bg-white text-neutral-900"
                    : scrolled
                      ? "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Link href="/dashboard">
                <Button
                  variant={scrolled ? "default" : "secondary"}
                  size="sm"
                  className="rounded-full"
                >
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-full ${
                      scrolled
                        ? "text-neutral-600 hover:text-neutral-900"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    variant={scrolled ? "default" : "secondary"}
                    size="sm"
                    className="rounded-full"
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
                className={scrolled ? "text-neutral-900" : "text-white"}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center gap-2 mb-8 mt-4">
                <Car className="h-6 w-6" />
                <span className="text-lg font-bold">Royal Cars</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t my-4" />
                {user ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 rounded-lg text-sm font-medium bg-neutral-900 text-white text-center"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium bg-neutral-900 text-white text-center"
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
