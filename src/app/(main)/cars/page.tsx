export const metadata = {
  title: "Browse Cars — Royal Cars",
};

export default function CarsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Browse Cars
        </h1>
        <p className="text-neutral-500 mb-8">
          Search and filter through our curated collection of luxury vehicles.
        </p>
        <div className="flex items-center justify-center h-64 rounded-2xl bg-neutral-50 border border-dashed border-neutral-300">
          <p className="text-neutral-400 text-sm">
            Search engine & car cards coming in Step 5
          </p>
        </div>
      </div>
    </div>
  );
}
