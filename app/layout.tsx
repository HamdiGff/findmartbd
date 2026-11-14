import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque";
import "@fontsource/hind-siliguri/400.css";
import "@fontsource/hind-siliguri/500.css";
import "@fontsource/hind-siliguri/600.css";
import "./globals.css";
import { CartProvider } from "@/components/Cart";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://findmartbd.com"),
  title: "FindMart BD: gadgets and everyday tech with cash on delivery",
  description:
    "Shop earbuds, smart watches, power banks, microphones and home gadgets at fair prices. Cash on delivery across all 64 districts of Bangladesh.",
  // Design preview with sample products: keep it out of Google until launch.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0B5D4B",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to products</a>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
