"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Eye, EyeOff, Loader2, Timer, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await registerAction(formData);
      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.error || "Registration failed");
      }
    });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-20">
      {/* Decorative background — soft amber glow + subtle grid */}

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="mb-5 inline-flex items-center gap-2 hover:opacity-90"
          >
            <Crown className="h-7 w-7 text-brand-strong" />
            <span className="text-xl font-extrabold tracking-tight text-ink">
              Royal<span className="text-brand-strong">Cars</span>
            </span>
          </Link>
          <h1 className="mb-1.5 text-2xl font-extrabold text-ink">
            Create an account
          </h1>
          <p className="text-sm text-ink-3">
            Join Jordan&apos;s premier car marketplace.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-7 shadow-lg shadow-lift sm:p-8">
          {error && (
            <div
              className={`mb-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-sm ${
                error.includes("Too many requests")
                  ? "border-brand/30 bg-brand-soft text-brand-strong"
                  : "border-danger/25 bg-danger-soft text-danger"
              }`}
            >
              {error.includes("Too many requests") && (
                <Timer className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-ink-2">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Ahmad Mansour"
                required
                disabled={isPending}
                autoComplete="name"
                className="h-11 border-line-control bg-surface-2 text-ink placeholder:text-ink-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-ink-2">
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
                className="h-11 border-line-control bg-surface-2 text-ink placeholder:text-ink-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-ink-2">
                Phone{" "}
                <span className="font-normal text-ink-3">(optional)</span>
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+962791234567"
                disabled={isPending}
                autoComplete="tel"
                className="h-11 border-line-control bg-surface-2 text-ink placeholder:text-ink-3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-ink-2">
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
                  autoComplete="new-password"
                  className="h-11 border-line-control bg-surface-2 pr-10 text-ink placeholder:text-ink-3"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 transition-colors hover:text-ink-2"
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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-ink-2">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                required
                disabled={isPending}
                autoComplete="new-password"
                className="h-11 border-line-control bg-surface-2 text-ink placeholder:text-ink-3"
              />
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="h-11 w-full bg-brand font-semibold text-brand-ink hover:bg-brand-hover"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>
        </div>

        <p className="mt-7 text-center text-sm text-ink-3">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-brand-strong hover:text-brand-strong"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
