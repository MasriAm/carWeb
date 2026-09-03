import { vehicleTitle } from "@/lib/vehicle-format";

type ContactSource = {
  specificWhatsapp?: string | null;
  dealership?: { whatsappNumber?: string | null; phone?: string | null } | null;
  user?: { phone?: string | null } | null;
};

/**
 * WhatsApp is the primary contact channel in this market, so a listing falls
 * back through every number it might have: the one set on the car, then the
 * dealership's WhatsApp, then its landline, then the seller's own number.
 */
export function contactNumberFor(vehicle: ContactSource): string | null {
  const raw =
    vehicle.specificWhatsapp ||
    vehicle.dealership?.whatsappNumber ||
    vehicle.dealership?.phone ||
    vehicle.user?.phone ||
    null;

  if (!raw) return null;
  const digits = raw.replace(/[^0-9]/g, "");
  return digits.length >= 7 ? digits : null;
}

export function whatsappVehicleLink(
  digits: string,
  vehicle: { productionYear: number; brand: string; model: string; id: string },
  appUrl?: string
): string {
  const title = vehicleTitle(vehicle);
  const link = appUrl ? `\n${appUrl}/cars/${vehicle.id}` : "";
  const message = `Hi, I'm interested in the ${title} listed on Royal Cars.${link}`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
