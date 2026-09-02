import {
  Shield,
  Users,
  Globe,
  Car,
  MapPin,
  Phone,
  Mail,
  FileCheck,
} from "lucide-react";

export const metadata = {
  title: "About Us",
  description:
    "Royal Cars is Jordan's premier online marketplace for luxury and performance vehicles. Founded in Amman, we connect discerning buyers with the finest cars.",
};

const features = [
  {
    icon: Shield,
    title: "Verified Listings",
    description:
      "Every vehicle is inspected and verified before listing. We ensure full transparency on condition, history, and origin spec.",
  },
  {
    icon: Users,
    title: "Trusted Dealers",
    description:
      "We partner with Jordan's most reputable dealerships. Each dealer is vetted for quality and customer service.",
  },
  {
    icon: Globe,
    title: "Global Imports",
    description:
      "European, Gulf, American, and Korean spec vehicles — all available in one curated marketplace tailored for Jordan.",
  },
  {
    icon: Car,
    title: "Premium Selection",
    description:
      "From Mercedes G-Class to Toyota Land Cruiser, our inventory spans every segment of the luxury and performance market.",
  },
];

const trustReasons = [
  {
    icon: FileCheck,
    title: "Verified Carseer Reports",
    description:
      "Every listed vehicle comes with a verified Carseer inspection report, covering mechanical condition, accident history, and paint thickness readings.",
  },
  {
    icon: Shield,
    title: "Strict Dealer Vetting",
    description:
      "We personally vet every dealer on our platform. Only licensed, established dealerships with proven track records are approved.",
  },
  {
    icon: Car,
    title: "Accurate JOD Pricing",
    description:
      "No hidden fees, no inflated numbers. Every price is listed in Jordanian Dinars and reflects the true market value including customs clearance.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-canvas pb-20">
      {/* Hero — matches the home hero aesthetic (gradient + grid, no image) */}
      <section
        className="relative overflow-hidden bg-inverse"
      >

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <span className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand-soft px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-caption font-semibold uppercase tracking-[0.08em] text-brand-strong">
              About Us
            </span>
          </span>
          <h1 className="mb-5 text-balance font-display text-display text-inverse-ink sm:text-hero">
            About <span className="text-brand-strong">Royal Cars</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lead leading-relaxed text-inverse-ink-2">
            Royal Cars is Jordan&apos;s premier online marketplace for luxury
            and performance vehicles. Founded in Amman, we connect discerning
            buyers with the finest cars from trusted dealers and private
            sellers across the Kingdom.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-page px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-caption font-bold uppercase tracking-[0.1em] text-brand-strong">
            What We Offer
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Everything you need, in one place
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-line-control"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft text-brand-strong">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-body font-bold text-ink">
                {feature.title}
              </h3>
              <p className="text-meta leading-relaxed text-ink-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-line bg-surface p-10 text-center">
          <p className="mb-4 text-caption font-bold uppercase tracking-[0.1em] text-brand-strong">
            Our Mission
          </p>
          <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-ink-2 sm:text-2xl">
            &ldquo;Bringing transparency to the Jordanian auto market.&rdquo;
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-3">
            We believe every car tells a story — and every buyer deserves to
            know the full truth before making a decision. No hidden damage, no
            inflated prices, no surprises.
          </p>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="mx-auto max-w-page px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-caption font-bold uppercase tracking-[0.1em] text-brand-strong">
            Why Trust Us
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Built on verification and trust
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {trustReasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-2xl border border-line bg-surface p-7"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft text-brand-strong">
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-body font-bold text-ink">
                {reason.title}
              </h3>
              <p className="text-meta leading-relaxed text-ink-3">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Location */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-line bg-surface p-8 sm:p-10">
          <div className="mb-8 text-center">
            <p className="mb-2 text-caption font-bold uppercase tracking-[0.1em] text-brand-strong">
              Get in Touch
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              Visit Us
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
            {[
              {
                icon: MapPin,
                title: "Main Office",
                lines: ["Mecca Street, Building 47", "Amman, Jordan 11183"],
              },
              {
                icon: Phone,
                title: "Phone",
                lines: ["+962 6 593 1000", "+962 79 123 4567"],
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["info@royalcars.jo", "support@royalcars.jo"],
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center gap-3"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft text-brand-strong">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-ink">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-3">
                  {item.lines.map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < item.lines.length - 1 && <br />}
                    </span>
                  ))}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
