import { NextResponse, type NextRequest } from "next/server";
import { countVehicles } from "@/lib/data/vehicles";
import { filtersFromSearchParams } from "@/lib/filter-params";

/**
 * Live result count for the current filter set.
 *
 * Used by the mobile filter sheet, which covers the results while it is open,
 * so its primary button can say how many cars the current selection actually
 * returns. Reads public data only, and goes through the same cached data
 * layer as the listing page, so a burst of filter taps costs no extra
 * queries.
 */
export async function GET(request: NextRequest) {
  const raw = Object.fromEntries(request.nextUrl.searchParams.entries());
  const count = await countVehicles(filtersFromSearchParams(raw));

  return NextResponse.json(
    { count },
    { headers: { "Cache-Control": "no-store" } }
  );
}
