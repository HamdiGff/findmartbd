import type { Metadata, Viewport } from "next";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Floating } from "@/components/Floating";

export const metadata: Metadata = {
  metadataBase: new URL("https://findmartbd.com"),
  title: {
    default: "FindMart — Gadgets & Electronics with Cash on Delivery in Bangladesh",
    template: "%s | FindMart",
  },
  description:
    "Shop earbuds, smart watches, power banks, microphones, solar backup and home gadgets at fair prices. Cash on delivery across all 64 districts of Bangladesh.",
  // Not launched yet: keep out of search engines until the store is ready.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#FFB800" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skiplink" href="#main">
          Skip to content
        </a>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <Floating />
        </CartProvider>
      </body>
    </html>
  );
}
