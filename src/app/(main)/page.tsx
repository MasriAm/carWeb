import { Suspense } from "react";
import Hero from "@/components/home/hero";
import {
  BrowseByBodyType,
  BrowseByBrand,
  BrowseByBudget,
  DealerStrip,
} from "@/components/home/browse-sections";
import HowItWorks from "@/components/home/how-it-works";
import RecentlyViewed from "@/components/home/recently-viewed";
import VehicleStrip from "@/components/home/vehicle-strip";
import CarGridSkeleton from "@/components/cars/car-grid-skeleton";
import { getFeaturedVehicles, getRecentVehicles } from "@/lib/data/vehicles";
import { getSavedVehicleIds, getSessionUser } from "@/lib/data/session";

/**
 * Landing page.
 *
 * Everything here is a query against real inventory. The page it replaces
 * showed no cars at all, four invented statistics, and four generic
 * value-proposition cards.
 *
 * The strips need the visitor's saved-car state, so each sits behind its own
 * Suspense boundary; the hero, browse tiles and copy prerender.
 */
export default function HomePage() {
  return (
    <>
      <Hero />

      <Suspense fallback={<StripFallback title="Featured cars" />}>
        <FeaturedStrip />
      </Suspense>

      <BrowseByBodyType />

      <Suspense fallback={<StripFallback title="Just listed" />}>
        <NewestStrip />
      </Suspense>

      <BrowseByBudget />
      <RecentlyViewed />
      <BrowseByBrand />
      <DealerStrip />
      <HowItWorks />
    </>
  );
}

async function FeaturedStrip() {
  const [vehicles, savedIds, user] = await Promise.all([
    getFeaturedVehicles(4),
    getSavedVehicleIds(),
    getSessionUser(),
  ]);

  return (
    <VehicleStrip
      title="Featured cars"
      vehicles={vehicles}
      href="/cars"
      savedIds={savedIds}
      isLoggedIn={Boolean(user)}
      priority
    />
  );
}

async function NewestStrip() {
  const [vehicles, savedIds, user] = await Promise.all([
    getRecentVehicles(4),
    getSavedVehicleIds(),
    getSessionUser(),
  ]);

  return (
    <VehicleStrip
      title="Just listed"
      vehicles={vehicles}
      href="/cars?sortBy=newest"
      linkLabel="Browse newest"
      savedIds={savedIds}
      isLoggedIn={Boolean(user)}
    />
  );
}

function StripFallback({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-page px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-5 font-display text-h2 text-ink">{title}</h2>
      <CarGridSkeleton count={4} />
    </section>
  );
}
