import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireAuth } from "@/lib/auth-utils";
import { getDealerOverview, getAdminOverview } from "@/lib/data/dashboard";
import { getSavedVehicles, getSavedSearches } from "@/lib/data/session";
import CarPhoto from "@/components/cars/car-photo";
import { formatPriceWithUnit } from "@/lib/vehicle-format";

/**
 * Dashboard overview.
 *
 * Previously four stat tiles and then an empty screen — the numbers were the
 * whole page, and none of them answered the question a dealer actually opens
 * this on: what is live right now, and what needs doing. Counts are now one
 * quiet line, and the space below them holds the listings themselves.
 */

function Figures({ items }: { items: { label: string; value: number }[] }) {
  return (
    <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-b border-line pb-5">
      {items.map((f) => (
        <div key={f.label} className="flex items-baseline gap-2">
          <dd className="font-display text-h2 tabular-nums text-ink">
            {f.value}
          </dd>
          <dt className="text-body-sm text-ink-3">{f.label}</dt>
        </div>
      ))}
    </dl>
  );
}

function ListingRow({
  vehicle,
  href,
  meta,
}: {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    productionYear: number;
    price: number;
    status: string;
    imageUrls: string[];
  };
  href: string;
  meta?: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex items-center gap-4 rounded-control px-2 py-2.5 transition-colors hover:bg-surface-2"
      >
        <CarPhoto
          src={vehicle.imageUrls[0]}
          alt=""
          aspect="aspect-[4/3]"
          sizes="72px"
          className="w-[72px] shrink-0 rounded-control"
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-body-sm font-medium text-ink">
            {vehicle.productionYear} {vehicle.brand} {vehicle.model}
          </span>
          <span className="block text-caption text-ink-3">
            {formatPriceWithUnit(vehicle.price)}
            {vehicle.status === "SOLD" && " · Sold"}
            {meta && ` · ${meta}`}
          </span>
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-ink-3"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border border-line bg-surface p-5">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <h2 className="text-body font-semibold text-ink">{title}</h2>
        {action && (
          <Link
            href={action.href}
            className="text-body-sm font-medium text-brand-strong hover:underline"
          >
            {action.label}
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Empty({
  children,
  href,
  cta,
}: {
  children: React.ReactNode;
  href: string;
  cta: string;
}) {
  return (
    <div className="py-6 text-center">
      <p className="text-body-sm text-ink-3">{children}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center gap-1.5 rounded-control bg-brand px-4 py-2 text-body-sm font-semibold text-brand-ink hover:bg-brand-hover"
      >
        {cta}
      </Link>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireAuth();

  if (user.role === "ADMIN") {
    const stats = await getAdminOverview();
    if (!stats) return null;

    return (
      <div className="space-y-6">
        <h1 className="font-display text-h1 text-ink">Overview</h1>
        <Figures
          items={[
            { label: "listings", value: stats.vehicles },
            { label: "on sale", value: stats.onSale },
            { label: "sold", value: stats.sold },
            { label: "dealerships", value: stats.dealerships },
            { label: "users", value: stats.users },
          ]}
        />
        <Panel
          title="Latest listings"
          action={{ href: "/dashboard/admin/vehicles", label: "All listings" }}
        >
          {stats.recent.length === 0 ? (
            <p className="py-6 text-center text-body-sm text-ink-3">
              No listings yet.
            </p>
          ) : (
            <ul className="-mx-2">
              {stats.recent.map((v) => (
                <ListingRow
                  key={v.id}
                  vehicle={v}
                  href={`/dashboard/admin/vehicles/${v.id}/edit`}
                  meta={v.user?.name ?? undefined}
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    );
  }

  if (user.role === "DEALER") {
    const stats = await getDealerOverview();
    if (!stats) return null;

    return (
      <div className="space-y-6">
        <h1 className="font-display text-h1 text-ink">Overview</h1>

        <Figures
          items={[
            { label: "on sale", value: stats.onSale },
            { label: "sold", value: stats.sold },
            { label: "saves from buyers", value: stats.totalSaves },
          ]}
        />

        <Panel
          title="Your latest listings"
          action={{ href: "/dashboard/vehicles", label: "All listings" }}
        >
          {stats.recent.length === 0 ? (
            <Empty href="/dashboard/vehicles/new" cta="Add your first car">
              Nothing listed yet. A listing needs photos, a price in JOD and
              the mileage — the rest is optional.
            </Empty>
          ) : (
            <ul className="-mx-2">
              {stats.recent.map((v) => (
                <ListingRow
                  key={v.id}
                  vehicle={v}
                  href={`/dashboard/vehicles/${v.id}/edit`}
                  meta={
                    v._count.savedBy > 0
                      ? `${v._count.savedBy} ${v._count.savedBy === 1 ? "save" : "saves"}`
                      : undefined
                  }
                />
              ))}
            </ul>
          )}
        </Panel>
      </div>
    );
  }

  const [saved, searches] = await Promise.all([
    getSavedVehicles(),
    getSavedSearches(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-h1 text-ink">
        {user.name ? `Hello, ${user.name.split(" ")[0]}` : "Your account"}
      </h1>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel
          title="Saved cars"
          action={
            saved.length > 0
              ? { href: "/dashboard/saved", label: "See all" }
              : undefined
          }
        >
          {saved.length === 0 ? (
            <Empty href="/cars" cta="Browse cars">
              Tap the heart on any listing to keep it here for later.
            </Empty>
          ) : (
            <ul className="-mx-2">
              {saved.slice(0, 4).map((s) => (
                <ListingRow
                  key={s.id}
                  vehicle={s.vehicle}
                  href={`/cars/${s.vehicleId}`}
                />
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Saved searches"
          action={
            searches.length > 0
              ? { href: "/dashboard/searches", label: "See all" }
              : undefined
          }
        >
          {searches.length === 0 ? (
            <Empty href="/cars" cta="Start searching">
              Save a set of filters and come back to it without rebuilding the
              search.
            </Empty>
          ) : (
            <ul className="-mx-2 divide-y divide-line">
              {searches.slice(0, 5).map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/cars?${s.query}`}
                    className="flex items-center justify-between gap-3 rounded-control px-2 py-2.5 transition-colors hover:bg-surface-2"
                  >
                    <span className="truncate text-body-sm text-ink">
                      {s.name}
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-ink-3"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
