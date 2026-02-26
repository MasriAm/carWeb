import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Crown, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 text-center">
      <Crown className="h-12 w-12 text-amber-500/30 mb-6" />
      <h1 className="text-8xl font-bold text-white mb-2">404</h1>
      <h2 className="text-xl font-semibold text-zinc-300 mb-3">Page Not Found</h2>
      <p className="text-zinc-500 max-w-md mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex gap-3">
        <Link href="/">
          <Button variant="outline" className="gap-2 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            <ArrowLeft className="h-4 w-4" />
            Back Home
          </Button>
        </Link>
        <Link href="/cars">
          <Button className="bg-amber-500 text-zinc-950 hover:bg-amber-400">Browse Cars</Button>
        </Link>
      </div>
    </div>
  );
}
