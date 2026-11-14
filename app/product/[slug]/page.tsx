import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPanel, Expandable, Gallery, PdpTabs, RecentlyViewed } from "@/components/ProductBuy";
import { ProductRow } from "@/components/ProductRow";
import { Cash, CategoryIcon, Return, Shield, Truck } from "@/components/Icons";
import { categoryBySlug } from "@/lib/categories";
import { extractHighlights, extractSpecs, getAllProducts, getProduct, toCard } from "@/lib/catalog";
import { DELIVERY, PHONE, SITE, isNew, taka } from "@/lib/format";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return { title: "Product not found" };
  return {
    title: `${p.name} price in Bangladesh`,
    description: `Buy ${p.name} at ${taka(p.price)} with cash on delivery anywhere in Bangladesh.${p.warranty ? ` ${p.warranty} warranty.` : ""}`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: { images: [p.image], title: p.name },
  };
}

const FAQ = (warranty: string) => [
  {
    q: "Can I pay when the product arrives?",
    a: "Yes. Every order is cash on delivery. Open the parcel in front of the rider, check the product, then pay.",
  },
  {
    q: "How long does delivery take?",
    a: `Inside Dhaka it usually takes 1 to 2 days (${taka(DELIVERY.insideDhaka)}). Outside Dhaka it takes 2 to 4 days (${taka(DELIVERY.outsideDhaka)}).`,
  },
  {
    q: "What if the product is faulty?",
    a: `It is covered by a ${warranty || "7-day"} warranty. Call or WhatsApp ${PHONE} with your order number and a short video of the problem, and we will replace it.`,
  },
  {
    q: "Will you call before sending the parcel?",
    a: "Yes. We call to confirm every order and the delivery charge before it is sent.",
  },
];

export default async function ProductPage({ params }: Props) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const cat = categoryBySlug(p.category);
  const all = await getAllProducts();
  const related = all.filter((x) => x.category === p.category && x.slug !== p.slug).slice(0, 12);
  const sameBrand = p.brand ? all.filter((x) => x.brand === p.brand && x.slug !== p.slug && x.category !== p.category).slice(0, 12) : [];
  const images = [p.image, ...p.gallery.filter((g) => g !== p.image)].slice(0, 10);
  const low = p.stock > 0 && p.stock <= 5;
  const highlights = extractHighlights(p.description);
  const specs = extractSpecs(p.description);
  const faq = FAQ(p.warranty);

  const baseSpecs: [string, string][] = [
    ["Brand", p.brand || "Generic"],
    ["Model / SKU", p.sku],
    ["Category", cat?.name ?? ""],
    ["Warranty", p.warranty || "7 days replacement"],
    ["Availability", p.stock > 0 ? `In stock (${p.stock})` : "Out of stock"],
    ["Payment", "Cash on delivery"],
  ];

  const schema = [
    {
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
        itemCondition: "https://schema.org/NewCondition",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        cat && { "@type": "ListItem", position: 2, name: cat.name, item: `${SITE}/category/${cat.slug}` },
        { "@type": "ListItem", position: cat ? 3 : 2, name: p.name, item: `${SITE}/product/${p.slug}` },
      ].filter(Boolean),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="wrap pdp-page">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {cat && (
            <>
              <span aria-hidden>/</span>
              <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
            </>
          )}
          <span aria-hidden>/</span>
          <span aria-current="page">{p.name}</span>
        </nav>

        <div className="pdp2">
          <Gallery images={images} name={p.name} badge={isNew(p.createdAt) ? "New arrival" : undefined} />

          <div className="pinfo">
            <div className="pinfo__tags">
              {p.brand && (
                <Link href={`/search?q=${encodeURIComponent(p.brand)}`} className="ptag ptag--brand">
                  {p.brand}
                </Link>
              )}
              {cat && (
                <Link href={`/category/${cat.slug}`} className="ptag" style={{ background: cat.tint, color: cat.accent }}>
                  <CategoryIcon name={cat.icon} size={14} /> {cat.name}
                </Link>
              )}
            </div>
            <h1 className="pinfo__title">{p.name}</h1>
            <div className="pinfo__meta">
              {p.stock > 0 ? (
                <span className={`stock${low ? " stock--low" : ""}`}>{low ? `Only ${p.stock} left in stock` : "In stock, ready to ship"}</span>
              ) : (
                <span className="stock stock--out">Out of stock</span>
              )}
              <span>SKU {p.sku}</span>
              {p.warranty && <span>{p.warranty} warranty</span>}
            </div>

            <div className="pricebox">
              <div>
                <span className="pricebox__label">Price</span>
                <div className="pricebox__price">{taka(p.price)}</div>
              </div>
              <div className="pricebox__cod">
                <Cash size={22} />
                <span>
                  <b>Cash on delivery</b>
                  No advance payment
                </span>
              </div>
            </div>

            <BuyPanel p={{ slug: p.slug, name: p.name, price: p.price, image: p.image, stock: p.stock }} highlights={highlights} />
          </div>
        </div>

        <div className="assure2">
          <div>
            <span><Cash size={22} /></span>
            <p><b>Cash on delivery</b>Open the parcel, then pay</p>
          </div>
          <div>
            <span><Truck size={22} /></span>
            <p><b>Fast delivery</b>All 64 districts in 1–4 days</p>
          </div>
          <div>
            <span><Shield size={22} /></span>
            <p><b>{p.warranty || "7-day"} warranty</b>Faulty items replaced</p>
          </div>
          <div>
            <span><Return size={22} /></span>
            <p><b>Easy returns</b>Within 7 days of delivery</p>
          </div>
        </div>

        <PdpTabs
          tabs={[
            { id: "details", label: "Details" },
            { id: "specs", label: "Specifications" },
            { id: "delivery", label: "Delivery & returns" },
            { id: "faq", label: "FAQ" },
          ]}
        />

        <div className="pdetail">
          <div className="pdetail__main">
            <section id="details" className="psec">
              <h2>Product details</h2>
              {p.description ? (
                <Expandable html={p.description} />
              ) : (
                <p className="prose">Full details are coming soon. Call or WhatsApp {PHONE} and we will send you the specifications.</p>
              )}
            </section>

            <section id="specs" className="psec">
              <h2>Specifications</h2>
              <table className="spec">
                <tbody>
                  {[...baseSpecs, ...specs].map(([k, v], i) => (
                    <tr key={`${k}${i}`}>
                      <th scope="row">{k}</th>
                      <td>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section id="delivery" className="psec">
              <h2>Delivery &amp; returns</h2>
              <div className="dcards">
                <div>
                  <b>Inside Dhaka</b>
                  <span className="dcards__big">{taka(DELIVERY.insideDhaka)}</span>
                  <span>Usually 1–2 days</span>
                </div>
                <div>
                  <b>Outside Dhaka</b>
                  <span className="dcards__big">{taka(DELIVERY.outsideDhaka)}</span>
                  <span>Usually 2–4 days</span>
                </div>
                <div>
                  <b>Returns</b>
                  <span className="dcards__big">7 days</span>
                  <span>For faulty or wrong items</span>
                </div>
              </div>
              <p className="psec__note">
                We call to confirm every order before it ships. Check the product in front of the rider before paying. Read the full{" "}
                <Link href="/page/delivery">delivery</Link> and <Link href="/page/returns">returns</Link> policies.
              </p>
            </section>

            <section id="faq" className="psec">
              <h2>Frequently asked questions</h2>
              <div className="faq">
                {faq.map((f, i) => (
                  <details key={f.q} open={i === 0}>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="pdetail__side">
            <div className="helpcard">
              <b>Questions about this product?</b>
              <p>We reply on WhatsApp within minutes, 10am to 8pm.</p>
              <a
                className="btn btn--wa-soft btn--block"
                href={`https://wa.me/8801757756651?text=${encodeURIComponent(`Question about: ${p.name}`)}`}
                target="_blank"
                rel="noopener"
              >
                Ask on WhatsApp
              </a>
              <a className="btn btn--ghost btn--block" href="tel:+8801757756651">
                Call {PHONE}
              </a>
            </div>
            {related.length > 0 && (
              <div className="minilist">
                <b>More in {cat?.name}</b>
                {related.slice(0, 4).map((r) => (
                  <Link key={r.slug} href={`/product/${r.slug}`} className="minilist__item">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.image} alt="" width={64} height={64} loading="lazy" />
                    <span>
                      <span className="minilist__name">{r.name}</span>
                      <b>{taka(r.price)}</b>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>

      <ProductRow title="You may also like" href={`/category/${p.category}`} products={related.map(toCard)} />
      {sameBrand.length > 3 && (
        <ProductRow title={`More from ${p.brand}`} href={`/search?q=${encodeURIComponent(p.brand)}`} products={sameBrand.map(toCard)} />
      )}
      <RecentlyViewed current={toCard(p)} />
    </>
  );
}
