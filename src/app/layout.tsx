import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { auth } from "@/lib/auth";
import { SessionProvider } from "@/lib/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Royal Cars — Jordan's Premium Car Marketplace",
  description:
    "Browse luxury and performance vehicles from trusted dealers across Amman, Jordan. Mercedes, BMW, Porsche, Toyota and more.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider user={session?.user ?? null}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
