"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Eye, EyeOff, Loader2, LogIn, Timer } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const suspendedError = searchParams.get("error") === "suspended";

  const [error, setError] = useState<string | null>(
    suspendedError ? "Your account has been suspended." : null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.success) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-950 px-4 py-20">
      {/* Decorative background — soft amber glow + subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 hover:opacity-90"
          >
            <Crown className="h-7 w-7 text-amber-500" />
            <span className="text-xl font-extrabold tracking-tight text-white">
              Royal<span className="text-amber-500">Cars</span>
            </span>
          </Link>
          <h1 className="mb-1.5 text-2xl font-extrabold text-white">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">
            Sign in to your account to continue.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7 shadow-lg shadow-black/40 sm:p-8">
          {error && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${
                error.includes("Too many requests")
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  : "border-red-500/20 bg-red-500/10 text-red-400"
              }`}
            >
              {error.includes("Too many requests") && (
                <Timer className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                disabled={isPending}
                autoComplete="email"
                className="h-11 border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                  autoComplete="current-password"
                  className="h-11 border-zinc-700 bg-zinc-800 pr-10 text-zinc-100 placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                  tabIndex={-1}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full bg-amber-500 font-semibold text-zinc-950 hover:bg-amber-400"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-7 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-amber-500 hover:text-amber-400"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
