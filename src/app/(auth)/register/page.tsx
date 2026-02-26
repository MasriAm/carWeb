"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Eye, EyeOff, Loader2 } from "lucide-react";

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
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5">
            <Crown className="h-7 w-7 text-amber-500" />
            <span className="text-xl font-bold tracking-tight">Royal Cars</span>
          </Link>
          <div>
            <h2 className="text-4xl font-bold leading-tight mb-3">
              Start Your<br />Journey Today
            </h2>
            <p className="text-zinc-400 max-w-sm">
              Join thousands of buyers and sellers on Jordan&apos;s most trusted car marketplace.
            </p>
          </div>
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Royal Cars. All rights reserved.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-zinc-950">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <Crown className="h-6 w-6 text-amber-500" />
            <span className="text-lg font-bold text-white">Royal Cars</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">Create an account</h1>
          <p className="text-zinc-500 text-sm mb-8">
            Join Jordan&apos;s premier car marketplace.
          </p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">Full Name</Label>
              <Input id="name" name="name" type="text" placeholder="Ahmad Mansour" required disabled={isPending} autoComplete="name" className="h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required disabled={isPending} autoComplete="email" className="h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-zinc-300">Phone <span className="text-zinc-600 font-normal">(optional)</span></Label>
              <Input id="phone" name="phone" type="tel" placeholder="+962791234567" disabled={isPending} autoComplete="tel" className="h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">Password</Label>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" required disabled={isPending} autoComplete="new-password" className="h-11 pr-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors" tabIndex={-1}>
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-zinc-300">Confirm Password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" required disabled={isPending} autoComplete="new-password" className="h-11 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600" />
            </div>
            <Button type="submit" className="w-full h-11 bg-amber-500 text-zinc-950 hover:bg-amber-400 font-semibold" disabled={isPending}>
              {isPending ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating account...</>) : "Create Account"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-500 hover:text-amber-400">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
