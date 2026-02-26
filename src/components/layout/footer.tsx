import Link from "next/link";
import { Crown } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Crown className="h-6 w-6 text-amber-500" />
              <span className="text-lg font-bold text-white">Royal Cars</span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Jordan&apos;s premier destination for luxury and performance
              vehicles. Browse curated listings from trusted dealers across
              Amman.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/cars" className="text-zinc-400 hover:text-white transition-colors">
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-amber-500 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>Mecca Street, Amman, Jordan</li>
              <li>+962 6 593 1000</li>
              <li>info@royalcars.jo</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-zinc-800 pt-6 text-center text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} Royal Cars Jordan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
