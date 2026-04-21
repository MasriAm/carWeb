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
    <div className="bg-zinc-950 pt-24 pb-20">
      {/* Hero — matches the home hero aesthetic (gradient + grid, no image) */}
      <section
        className="relative overflow-hidden border-b border-zinc-900"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #1C1C1E 0%, #050505 65%)",
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8 lg:py-24">
          <span className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-500">
              About Us
            </span>
          </span>
          <h1 className="mb-5 text-balance text-4xl font-extrabold tracking-tight text-zinc-50 sm:text-5xl md:text-6xl">
            About <span className="text-amber-500">Royal Cars</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Royal Cars is Jordan&apos;s premier online marketplace for luxury
            and performance vehicles. Founded in Amman, we connect discerning
            buyers with the finest cars from trusted dealers and private
            sellers across the Kingdom.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-amber-500">
            What We Offer
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
            Everything you need, in one place
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7 transition-colors hover:border-zinc-700"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-[15px] font-bold text-zinc-50">
                {feature.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-zinc-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.1em] text-amber-500">
            Our Mission
          </p>
          <p className="mx-auto max-w-2xl text-xl font-light leading-relaxed text-zinc-200 sm:text-2xl">
            &ldquo;Bringing transparency to the Jordanian auto market.&rdquo;
          </p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-500">
            We believe every car tells a story — and every buyer deserves to
            know the full truth before making a decision. No hidden damage, no
            inflated prices, no surprises.
          </p>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-amber-500">
            Why Trust Us
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-50 sm:text-4xl">
            Built on verification and trust
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {trustReasons.map((reason) => (
            <div
              key={reason.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-7"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-[15px] font-bold text-zinc-50">
                {reason.title}
              </h3>
              <p className="text-[13px] leading-relaxed text-zinc-500">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Location */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 sm:p-10">
          <div className="mb-8 text-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.1em] text-amber-500">
              Get in Touch
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-50 sm:text-3xl">
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
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-zinc-50">{item.title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">
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
