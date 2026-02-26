import { Shield, Users, Globe, Car, MapPin, Phone, Mail, FileCheck } from "lucide-react";

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
    <div className="pt-24 pb-16 bg-zinc-950">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center mb-20">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6">
          About <span className="text-amber-500">Royal Cars</span>
        </h1>
        <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
          Royal Cars is Jordan&apos;s premier online marketplace for luxury and
          performance vehicles. Founded in Amman, we connect discerning buyers
          with the finest cars from trusted dealers and private sellers across
          the Kingdom.
        </p>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-20 text-center">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-amber-500 mb-4">
            Our Mission
          </h2>
          <p className="text-xl text-zinc-300 leading-relaxed max-w-2xl mx-auto font-light">
            &ldquo;Bringing transparency to the Jordanian auto market.&rdquo;
          </p>
          <p className="text-zinc-500 mt-4 max-w-xl mx-auto">
            We believe every car tells a story — and every buyer deserves to know
            the full truth before making a decision. No hidden damage, no
            inflated prices, no surprises.
          </p>
        </div>
      </section>

      {/* Why Trust Us */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">
          Why Trust Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustReasons.map((reason) => (
            <div
              key={reason.title}
              className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800"
            >
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4">
                <reason.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {reason.title}
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact / Location */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Visit Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Main Office</h3>
              <p className="text-sm text-zinc-400">
                Mecca Street, Building 47<br />
                Amman, Jordan 11183
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Phone</h3>
              <p className="text-sm text-zinc-400">
                +962 6 593 1000<br />
                +962 79 123 4567
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">Email</h3>
              <p className="text-sm text-zinc-400">
                info@royalcars.jo<br />
                support@royalcars.jo
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
