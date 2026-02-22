import { Car, Shield, Users, Globe } from "lucide-react";

export const metadata = {
  title: "About Us — Royal Cars",
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
      "European, Gulf, American, and Chinese spec vehicles — all available in one curated marketplace tailored for Jordan.",
  },
  {
    icon: Car,
    title: "Premium Selection",
    description:
      "From Mercedes G-Class to Toyota Land Cruiser, our inventory spans every segment of the luxury and performance market.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center mb-20">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-neutral-900 mb-6">
          About Royal Cars
        </h1>
        <p className="text-lg text-neutral-500 leading-relaxed max-w-2xl mx-auto">
          Royal Cars is Jordan&apos;s premier online marketplace for luxury and
          performance vehicles. Founded in Amman, we connect discerning buyers
          with the finest cars from trusted dealers and private sellers across
          the Kingdom.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="text-center p-6 rounded-2xl bg-neutral-50 border border-neutral-100"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-4">
          Our Mission
        </h2>
        <p className="text-neutral-500 leading-relaxed max-w-2xl mx-auto">
          To make buying and selling premium vehicles in Jordan a seamless,
          transparent, and enjoyable experience. We believe every car tells a
          story — and every buyer deserves to find the perfect one.
        </p>
      </section>
    </div>
  );
}
