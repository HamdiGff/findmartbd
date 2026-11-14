import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox, Gallery } from "@/components/ProductBuy";
import { ProductRow } from "@/components/ProductRow";
import { categoryBySlug } from "@/lib/categories";
import { getAllProducts, getProduct, toCard } from "@/lib/catalog";
import { SITE, taka } from "@/lib/format";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.name} price in Bangladesh`,
    description: `Buy ${p.name} at ${taka(p.price)} with cash on delivery anywhere in Bangladesh. ${p.warranty ? p.warranty + " warranty." : ""}`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { images: [p.image], title: p.name },
  };
}

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const cat = categoryBySlug(p.category);
  const related = (await getAllProducts()).filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 12);
  const images = [p.image, ...p.gallery.filter((g) => g !== p.image)].slice(0, 8);
  const low = p.stock > 0 && p.stock <= 5;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    image: images,
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE}/product/${p.slug}`,
      priceCurrency: "BDT",
      price: p.price,
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
    <div className="wrap has-mobilebar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> /{" "}
        {cat && (
          <>
            <Link href={`/category/${cat.slug}`}>{cat.name}</Link> /{" "}
          </>
        )}
        <span aria-current="page">{p.name}</span>
      </nav>

      <div className="pdp">
        <Gallery images={images} name={p.name} />
        <div className="buy">
          <span className="buy__brand">{p.brand || "FindMart"}</span>
          <h1>{p.name}</h1>
          <div className="buy__facts">
            {p.stock > 0 ? (
              <span className={`stock${low ? " stock--low" : ""}`}>{low ? `Only ${p.stock} left` : "In stock"}</span>
            ) : (
              <span className="stock stock--out">Out of stock</span>
            )}
            {p.warranty && <span>Warranty: {p.warranty}</span>}
            <span>SKU: {p.sku}</span>
          </div>
          <div className="buy__price">{taka(p.price)}</div>
          <p className="buy__cod">Pay in cash when it arrives. Delivery charge is shown at checkout.</p>
          <BuyBox p={{ slug: p.slug, name: p.name, price: p.price, image: p.image, stock: p.stock }} />
        </div>
      </div>

      <div className="desc">
        <section className="desc__body">
          <h2>Product details</h2>
          {p.description ? (
            <div className="prose" dangerouslySetInnerHTML={{ __html: p.description }} />
          ) : (
            <p className="prose">Full details for this product are coming soon. Call or WhatsApp us for specifications.</p>
          )}
        </section>
        <aside className="specs">
          <h2>At a glance</h2>
          <dl>
            <dt>Brand</dt>
            <dd>{p.brand || "—"}</dd>
            <dt>Category</dt>
            <dd>{cat?.name}</dd>
            <dt>Warranty</dt>
            <dd>{p.warranty || "—"}</dd>
            <dt>Payment</dt>
            <dd>Cash on delivery</dd>
            <dt>Delivery</dt>
            <dd>All 64 districts</dd>
          </dl>
        </aside>
      </div>

    </div>
    <ProductRow title="You may also like" href={`/category/${p.category}`} products={related.map(toCard)} />
    </>
  );
}
