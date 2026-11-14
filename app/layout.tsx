import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo/wdth.css";
import "./globals.css";
import "./design.css";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Floating } from "@/components/Floating";
import { CATEGORIES } from "@/lib/categories";
import { getAllProducts } from "@/lib/catalog";

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

export const revalidate = 3600;
export const viewport: Viewport = { themeColor: "#FFB800" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const all = await getAllProducts();
  const meta = CATEGORIES.map((c) => {
    const items = all.filter((p) => p.category === c.slug);
    return { slug: c.slug, count: items.length, image: items[0]?.image };
  });
  return (
    <html lang="en">
      <body>
        <a className="skiplink" href="#main">
          Skip to content
        </a>
        <CartProvider>
          <Header meta={meta} />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
          <Floating />
        </CartProvider>
      </body>
    </html>
  );
}
