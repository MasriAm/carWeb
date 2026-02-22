import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import StickySocials from "@/components/layout/sticky-socials";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <StickySocials />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}
