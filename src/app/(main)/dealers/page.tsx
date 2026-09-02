import type { Metadata } from "next";
import Link from "next/link";
import { Store } from "lucide-react";
import { getActiveDealerships } from "@/lib/data/dealerships";
import { formatNumber } from "@/lib/vehicle-format";

export const metadata: Metadata = {
  title: "Car dealers in Jordan",
  description:
    "Dealerships listing cars on Royal Cars, with the number of vehicles each currently has for sale.",
  alternates: { canonical: "/dealers" },
};

/**
 * Dealer index.
 *
 * Dealerships already had a `slug` in the schema and it was selected in every
 * listing query, but nothing linked to it — there was no public dealer page
 * at all.
 */
export default async function DealersPage() {
  const dealers = await getActiveDealerships();

  return (
    <div className="min-h-screen bg-canvas">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-page px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="font-display text-h2 text-ink">Dealers</h1>
          <p className="mt-1 text-body-sm text-ink-3">
            {dealers.length === 0
              ? "No dealers have cars listed right now."
              : `${formatNumber(dealers.length)} ${
                  dealers.length === 1 ? "dealer" : "dealers"
                } with cars for sale.`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-page px-4 py-6 sm:px-6 lg:px-8">
        {dealers.length === 0 ? (
          <div className="rounded-card border border-line bg-surface px-6 py-14 text-center">
            <Store className="mx-auto mb-4 h-10 w-10 text-ink-3" aria-hidden="true" />
            <p className="text-body text-ink-2">
              Nothing listed yet.{" "}
              <Link href="/cars" className="font-semibold text-brand-strong hover:underline">
                Browse all cars
              </Link>
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dealers.map((dealer) => (
              <li key={dealer.id}>
                <Link
                  href={`/dealers/${dealer.slug}`}
                  className="flex h-full items-center gap-3.5 rounded-card border border-line bg-surface p-5 transition-shadow hover:shadow-lift"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-brand-soft font-display text-title text-brand-strong"
                  >
                    {dealer.name.charAt(0)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-body font-semibold text-ink">
                      {dealer.name}
                    </span>
                    <span className="block text-body-sm text-ink-3 tabular-nums">
                      {formatNumber(dealer.listingCount)}{" "}
                      {dealer.listingCount === 1 ? "car" : "cars"} for sale
                    </span>
                    {dealer.address && (
                      <span className="block truncate text-body-sm text-ink-3">
                        {dealer.address}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
