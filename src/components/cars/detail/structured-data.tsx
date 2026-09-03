import { siteConfig } from "@/lib/site-config";
import {
  BODY_LABEL,
  FUEL_LABEL,
  SPEC_ORIGIN_LABEL,
  TRANSMISSION_LABEL,
  vehicleTitle,
} from "@/lib/vehicle-format";

/**
 * Schema.org markup.
 *
 * The site had no structured data of any kind, which keeps a car marketplace
 * out of Google's vehicle and shopping surfaces entirely. Emitted as inline
 * JSON, which the existing CSP already allows.
 */

type JsonLdVehicle = {
  id: string;
  brand: string;
  model: string;
  productionYear: number;
  price: number;
  mileageKm: number;
  condition: string;
  bodyType: string;
  fuelType: string;
  transmission: string;
  engineCapacityCC: number;
  specOrigin: string | null;
  status: string;
  shortDescription: string;
  imageUrls: string[];
  dealership: { name: string } | null;
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Serialised server-side from our own database rows, and `<` is escaped
      // so a description can never close the script element.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function VehicleJsonLd({ vehicle }: { vehicle: JsonLdVehicle }) {
  const url = `${siteConfig.url}/cars/${vehicle.id}`;
  const name = vehicleTitle(vehicle);

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Vehicle",
        name,
        url,
        description: vehicle.shortDescription,
        image: vehicle.imageUrls.slice(0, 6),
        brand: { "@type": "Brand", name: vehicle.brand },
        model: vehicle.model,
        vehicleModelDate: String(vehicle.productionYear),
        productionDate: String(vehicle.productionYear),
        itemCondition:
          vehicle.condition === "NEW"
            ? "https://schema.org/NewCondition"
            : "https://schema.org/UsedCondition",
        bodyType: BODY_LABEL[vehicle.bodyType] ?? vehicle.bodyType,
        fuelType: FUEL_LABEL[vehicle.fuelType] ?? vehicle.fuelType,
        vehicleTransmission:
          TRANSMISSION_LABEL[vehicle.transmission] ?? vehicle.transmission,
        vehicleConfiguration: vehicle.specOrigin
          ? SPEC_ORIGIN_LABEL[vehicle.specOrigin]
          : undefined,
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: vehicle.mileageKm,
          unitCode: "KMT",
        },
        vehicleEngine: vehicle.engineCapacityCC
          ? {
              "@type": "EngineSpecification",
              engineDisplacement: {
                "@type": "QuantitativeValue",
                value: vehicle.engineCapacityCC,
                unitCode: "CMQ",
              },
            }
          : undefined,
        offers: {
          "@type": "Offer",
          url,
          price: vehicle.price,
          priceCurrency: "JOD",
          availability:
            vehicle.status === "SOLD"
              ? "https://schema.org/SoldOut"
              : "https://schema.org/InStock",
          itemCondition:
            vehicle.condition === "NEW"
              ? "https://schema.org/NewCondition"
              : "https://schema.org/UsedCondition",
          seller: vehicle.dealership
            ? { "@type": "AutoDealer", name: vehicle.dealership.name }
            : { "@type": "Organization", name: siteConfig.name },
        },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; href: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${siteConfig.url}${item.href}`,
        })),
      }}
    />
  );
}

export function DealerJsonLd({
  dealer,
}: {
  dealer: {
    name: string;
    slug: string;
    description: string | null;
    address: string | null;
    phone: string | null;
    website: string | null;
    logoUrl: string | null;
  };
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AutoDealer",
        name: dealer.name,
        url: `${siteConfig.url}/dealers/${dealer.slug}`,
        description: dealer.description ?? undefined,
        telephone: dealer.phone ?? undefined,
        image: dealer.logoUrl ?? undefined,
        sameAs: dealer.website ?? undefined,
        address: dealer.address
          ? {
              "@type": "PostalAddress",
              streetAddress: dealer.address,
              addressCountry: "JO",
            }
          : undefined,
      }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteConfig.url}/cars?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}
