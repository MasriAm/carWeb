import type { Metadata } from "next";
import { Geist, Geist_Mono, Archivo } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Display face. Loaded with the width axis so headings and prices can use
 * the semi-expanded cut (112.5%) that gives the marketplace its voice.
 */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Royal Cars — Buy and sell cars in Jordan",
    template: "%s | Royal Cars",
  },
  description:
    "Browse cars for sale across Jordan. Filter by price in JOD, mileage, year and agency import, then message the seller directly on WhatsApp.",
  keywords: [
    "cars Jordan",
    "cars for sale Amman",
    "buy car Jordan",
    "سيارات للبيع",
    "وارد وكالة",
    "used cars Jordan",
    "car marketplace Jordan",
    "Royal Cars",
  ],
  openGraph: {
    title: "Royal Cars — Buy and sell cars in Jordan",
    description:
      "Browse cars for sale across Jordan, with agency-import status and mileage on every listing.",
    url: siteConfig.url,
    siteName: "Royal Cars",
    locale: "en_JO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Royal Cars — Buy and sell cars in Jordan",
    description:
      "Browse cars for sale across Jordan, with agency-import status and mileage on every listing.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * The root layout does no data fetching.
 *
 * It previously awaited `auth()`, which made every route in the app dynamic —
 * marketing pages included — and put a session lookup in front of every
 * request. The session is now read only by the components that need it, each
 * inside its own Suspense boundary, so the rest of the page prerenders.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} antialiased`}
      >
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
