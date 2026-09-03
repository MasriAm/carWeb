import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Keyboard users land here first. The listing page carries a filter
          sidebar with dozens of controls in front of the results, so without
          this it took about 70 Tab presses to reach the first car. */}
      <a
        href="#main-content"
        className="sr-only rounded-control bg-brand text-body-sm font-semibold text-brand-ink focus:not-sr-only focus:px-4 focus:py-2 focus:absolute focus:start-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
