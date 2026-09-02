import { BadgeCheck, ShieldCheck, MessageCircle, Globe } from "lucide-react";

const reasons = [
  {
    icon: BadgeCheck,
    title: "100% Verified",
    description:
      "Every listing passes our multi-step dealer verification process.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent Pricing",
    description:
      "Full JOD pricing with no hidden fees or surprise charges.",
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    description:
      "Connect instantly via WhatsApp with verified dealers.",
  },
  {
    icon: Globe,
    title: "All Specs Available",
    description: "Agency, US, Korean, Gulf, and European spec vehicles.",
  },
];

export default function WhySection() {
  return (
    <section className="border-t border-line bg-canvas py-16">
      <div className="mx-auto max-w-page px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-2 text-caption font-bold uppercase tracking-[0.1em] text-brand-strong">
            Why Royal Cars
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            Built for Jordan&apos;s Auto Market
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-line-control"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-brand/30 bg-brand-soft text-brand-strong">
                <r.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-body font-bold text-ink">
                {r.title}
              </h3>
              <p className="text-meta leading-relaxed text-ink-3">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
