import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyPanel, Expandable, Gallery, PdpTabs, RecentlyViewed } from "@/components/ProductBuy";
import { ProductRow } from "@/components/ProductRow";
import { AisleBand } from "@/components/AisleBand";
import { Phone, Whatsapp } from "@/components/Icons";
import { categoryBySlug } from "@/lib/categories";
import { extractHighlights, extractSpecs, getAllProducts, getProduct, toCard } from "@/lib/catalog";
import { DELIVERY, PHONE, PHONE_INTL, SITE, WHATSAPP, isNew, taka } from "@/lib/format";

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

  const aisle = cat ? { slug: cat.slug, name: cat.name, accent: cat.accent, tint: cat.tint } : undefined;
  const relatedAll = all.filter((x) => x.category === p.category && x.slug !== p.slug);
  const relatedFrom = relatedAll.length ? Math.min(...relatedAll.map((x) => x.price)) : 0;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="wrap pdp3-top">
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

        <div className="pdp3" style={{ ["--tint" as string]: cat?.tint ?? "#E9EEEB", ["--deep" as string]: cat?.accent ?? "#3A4756" }}>
          <Gallery
            images={images}
            name={p.name}
            badge={isNew(p.createdAt) ? "New arrival" : undefined}
            ghost={p.brand || cat?.short}
            aisle={aisle}
          />

          <div className="buyside">
            <h1 className="buyside__title">{p.name}</h1>
            <p className="buyside__meta">
              {p.stock > 0 ? (
                <span className={`stock${low ? " stock--low" : ""}`}>{low ? `Only ${p.stock} left` : "In stock"}</span>
              ) : (
                <span className="stock stock--out">Out of stock</span>
              )}
              {p.brand && (
                <Link href={`/search?q=${encodeURIComponent(p.brand)}`} className="buyside__brand">
                  {p.brand}
                </Link>
              )}
              <span>SKU {p.sku}</span>
              {p.warranty && <span>{p.warranty} warranty</span>}
            </p>
            <p className="buyside__price">{taka(p.price)}</p>

            <BuyPanel p={{ slug: p.slug, name: p.name, price: p.price, image: p.image, stock: p.stock }} highlights={highlights} />
          </div>
        </div>

        <div className="pbody">
          <aside className="rail">
            <PdpTabs
              tabs={[
                { id: "details", label: "Details" },
                { id: "specs", label: "Specifications" },
                { id: "delivery", label: "Delivery and returns" },
                { id: "faq", label: "Questions" },
              ]}
            />
            <div className="rail__help">
              <b>Not sure it fits what you need?</b>
              <p>Ask us before you order. We answer on WhatsApp, 10am to 8pm.</p>
              <a
                className="btn btn--brand btn--block"
                href={`${WHATSAPP}?text=${encodeURIComponent(`Question about: ${p.name}`)}`}
                target="_blank"
                rel="noopener"
              >
                <Whatsapp size={18} /> Ask on WhatsApp
              </a>
              <a className="btn btn--line btn--block" href={`tel:${PHONE_INTL}`}>
                <Phone size={17} /> {PHONE}
              </a>
            </div>
          </aside>

          <div className="pbody__main">
            <section id="details" className="psec">
              <h2 className="disp psec__t">Details</h2>
              {p.description ? (
                <Expandable html={p.description} />
              ) : (
                <p className="prose">Full details are coming soon. Call or WhatsApp {PHONE} and we will send you the specifications.</p>
              )}
            </section>

            <section id="specs" className="psec">
              <h2 className="disp psec__t">Specifications</h2>
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
              <h2 className="disp psec__t">Delivery and returns</h2>
              <div className="dl3">
                <div>
                  <span>Inside Dhaka</span>
                  <b className="disp">{taka(DELIVERY.insideDhaka)}</b>
                  <small>Usually 1 to 2 days</small>
                </div>
                <div>
                  <span>Outside Dhaka</span>
                  <b className="disp">{taka(DELIVERY.outsideDhaka)}</b>
                  <small>Usually 2 to 4 days</small>
                </div>
                <div>
                  <span>Returns</span>
                  <b className="disp">7 days</b>
                  <small>For faulty or wrong items</small>
                </div>
              </div>
              <p className="psec__note">
                We call to confirm every order before it ships. Check the product in front of the rider before paying. Read the full{" "}
                <Link href="/page/delivery">delivery</Link> and <Link href="/page/returns">returns</Link> policies.
              </p>
            </section>

            <section id="faq" className="psec">
              <h2 className="disp psec__t">Questions</h2>
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
        </div>
      </div>

      {cat && relatedAll.length > 3 ? (
        <div className="bands bands--pdp">
          <AisleBand
            aisle={{ slug: cat.slug, name: `More ${cat.name.toLowerCase()}`, blurb: cat.blurb, tint: cat.tint, accent: cat.accent }}
            count={relatedAll.length}
            from={relatedFrom}
            products={related.map(toCard)}
          />
        </div>
      ) : (
        <ProductRow title="You may also like" href={`/category/${p.category}`} products={related.map(toCard)} />
      )}
      {sameBrand.length > 3 && (
        <ProductRow title={`More from ${p.brand}`} href={`/search?q=${encodeURIComponent(p.brand)}`} products={sameBrand.map(toCard)} />
      )}
      <RecentlyViewed current={toCard(p)} />
    </>
  );
}
