import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://iniyazhl.shop"),
  title: {
    default: "N.INIYAZHL — Handloom & Silk Sarees",
    template: "%s",
  },
  description:
    "Shop authentic handloom cotton, silk cotton and printed sarees. Cash on delivery available, pan-India shipping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-ink">
        <noscript>
          <style>{`.reveal { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        <Header />
        <main className="animate-fade-in flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
