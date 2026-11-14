import Link from "next/link";
import { Stage, type StageSlide } from "@/components/Stage";
import { AisleBand } from "@/components/AisleBand";
import { ProductCard } from "@/components/ProductCard";
import { Cash, Phone, Return, Truck, Whatsapp } from "@/components/Icons";
import { categoryBySlug } from "@/lib/categories";
import { getAllProducts, toCard, type Product } from "@/lib/catalog";
import { PHONE, PHONE_INTL, WHATSAPP, taka } from "@/lib/format";

export const revalidate = 3600;

const byNewest = (a: Product, b: Product) => b.createdAt.localeCompare(a.createdAt);
const inStock = (p: Product) => p.stock > 0 && !!p.image;

/** Three in-stock products from different brands, with the one matching `lead` in the middle of the stage. */
function pickItems(list: Product[], lead: RegExp): Product[] {
  const pool = list.filter(inStock).sort(byNewest);
  const first = pool.find((p) => lead.test(p.name)) ?? pool[0];
  if (!first) return [];
  const out = [first];
  for (const p of pool) {
    if (out.length === 3) break;
    if (!out.includes(p) && (!p.brand || !out.some((o) => o.brand === p.brand))) out.push(p);
  }
  for (const p of pool) if (out.length < 3 && !out.includes(p)) out.push(p);
  return out;
}

const STAGES: { slug: string; ghost: string; headline: string; blurb: string; lead: RegExp }[] = [
  {
    slug: "smart-watches",
    ghost: "Watches",
    headline: "Calls, steps and sleep on your wrist.",
    blurb: "Bluetooth calling, AMOLED screens and week-long battery life, at prices that make sense.",
    lead: /calling|amoled|hoco y4/i,
  },
  {
    slug: "earbuds-headphones",
    ghost: "Earbuds",
    headline: "Hear more. Hear less noise.",
    blurb: "Noise cancelling earbuds from QCY, CMF, Acefast and Hoco, with cash on delivery.",
    lead: /anc|melobuds|cmf/i,
  },
  {
    slug: "power-charging",
    ghost: "Power",
    headline: "One charge for the whole day.",
    blurb: "Power banks, fast chargers and cables from brands you can check on the box.",
    lead: /power bank/i,
  },
  {
    slug: "solar-power-backup",
    ghost: "Solar",
    headline: "Load-shedding, handled.",
    blurb: "MPPT controllers, DC breakers and power stations to keep lights, Wi-Fi and fans running.",
    lead: /mppt|power station|cooker/i,
  },
  {
    slug: "creator-gear",
    ghost: "Studio",
    headline: "Studio sound from your bedroom.",
    blurb: "USB, XLR and wireless mics for YouTube, Facebook Live, gaming and online classes.",
    lead: /fifine k|condenser|wireless mic/i,
  },
  {
    slug: "speakers",
    ghost: "Speakers",
    headline: "Loud enough for the whole roof.",
    blurb: "Portable Bluetooth speakers and soundbars for gatherings, picnics and everyday listening.",
    lead: /speaker|soundbar/i,
  },
  {
    slug: "computer-networking",
    ghost: "Network",
    headline: "Faster Wi-Fi. Fewer dropouts.",
    blurb: "Routers, adapters and storage from TP-Link, Tenda, Ruijie and Lexar.",
    lead: /router|wifi|wi-fi/i,
  },
];

const BANDS = ["smart-watches", "earbuds-headphones", "power-charging", "solar-power-backup", "creator-gear"];

const STEPS = [
  { t: "Pick it", d: "Add what you like and type your name, phone and address. No account needed." },
  { t: "We call you", d: "We confirm the order and the delivery charge by phone before anything is sent." },
  { t: "Check, then pay", d: "Open the parcel in front of the rider. Pay only if you are happy with it." },
];

export default async function Home() {
  const all = await getAllProducts();
  const by = (slug: string) => all.filter((p) => p.category === slug);
  const from = (list: Product[]) => (list.length ? Math.min(...list.map((p) => p.price)) : 0);

  const slides: StageSlide[] = STAGES.map((st) => {
    const cat = categoryBySlug(st.slug);
    const list = by(st.slug);
    const items = pickItems(list, st.lead);
    if (!cat || items.length < 2) return null;
    return {
      slug: st.slug,
      name: cat.name.replace(" & Headphones", "").replace("Power & Charging", "Power & charging"),
      ghost: st.ghost,
      headline: st.headline,
      blurb: st.blurb,
      tint: cat.tint,
      accent: cat.accent,
      from: from(list),
      count: list.length,
      items: items.map((p) => ({ slug: p.slug, name: p.name, price: p.price, image: p.image })),
    };
  }).filter(Boolean) as StageSlide[];

  const TECH = new Set(["smart-watches", "earbuds-headphones", "speakers", "power-charging", "solar-power-backup", "creator-gear", "computer-networking", "watches"]);
  const fresh = all.filter((p) => inStock(p) && TECH.has(p.category)).sort(byNewest).slice(0, 10);
  const budget = all.filter((p) => p.price <= 999 && inStock(p)).sort(byNewest).slice(0, 10);

  const bands = BANDS.map((slug) => {
    const cat = categoryBySlug(slug);
    const list = by(slug);
    const show = list.filter(inStock).sort(byNewest).slice(0, 10);
    return cat && show.length ? { cat, count: list.length, from: from(list), show } : null;
  }).filter(Boolean) as { cat: NonNullable<ReturnType<typeof categoryBySlug>>; count: number; from: number; show: Product[] }[];

  const brandCount = new Map<string, number>();
  for (const p of all) if (p.brand) brandCount.set(p.brand, (brandCount.get(p.brand) ?? 0) + 1);
  const brands = [...brandCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14);

  return (
    <>
      <h1 className="sr-only">FindMart BD: gadgets and electronics with cash on delivery in Bangladesh</h1>
      {slides.length > 0 && <Stage slides={slides} />}

      <section className="promise" aria-label="Why shop here">
        <ul className="wrap promise__in">
          <li>
            <Cash size={24} />
            <p>
              <b>Cash on delivery</b>
              Pay after you check the parcel
            </p>
          </li>
          <li>
            <Truck size={24} />
            <p>
              <b>1 to 4 day delivery</b>
              All 64 districts, from ৳70
            </p>
          </li>
          <li>
            <Return size={24} />
            <p>
              <b>7-day replacement</b>
              If it arrives faulty, we swap it
            </p>
          </li>
          <li>
            <Phone size={24} />
            <p>
              <b>We call to confirm</b>
              No surprise orders, no hidden fees
            </p>
          </li>
        </ul>
      </section>

      {fresh.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec__head">
              <h2 className="disp sec__t">Just landed</h2>
              <Link href="/shop?sort=new" className="sec__link">
                See all new arrivals
              </Link>
            </div>
            <div className="pgrid pgrid--5">
              {fresh.map((p, i) => (
                <ProductCard key={p.slug} p={toCard(p)} priority={i < 5} />
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="bands">
        {bands.map((b) => (
          <AisleBand
            key={b.cat.slug}
            aisle={{ slug: b.cat.slug, name: b.cat.name, blurb: b.cat.blurb, tint: b.cat.tint, accent: b.cat.accent }}
            count={b.count}
            from={b.from}
            products={b.show.map(toCard)}
          />
        ))}
      </div>

      {budget.length > 0 && (
        <section className="sec">
          <div className="wrap">
            <div className="sec__head">
              <h2 className="disp sec__t">Under ৳999</h2>
              <Link href="/shop?max=999" className="sec__link">
                See everything under ৳999
              </Link>
            </div>
            <div className="pgrid pgrid--5">
              {budget.map((p) => (
                <ProductCard key={p.slug} p={toCard(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="how" aria-label="How ordering works">
        <div className="how__in">
          <div className="how__head">
            <h2 className="disp how__t">Order in two minutes. Pay when it arrives.</h2>
            <p>Nothing to pay online and nothing to sign up for. Ordering from FindMart BD works like this.</p>
            <div className="how__cta">
              <a className="btn btn--brand btn--lg" href={WHATSAPP} target="_blank" rel="noopener">
                <Whatsapp size={20} /> Order on WhatsApp
              </a>
              <a className="btn btn--line btn--lg" href={`tel:${PHONE_INTL}`}>
                <Phone size={18} /> {PHONE}
              </a>
            </div>
          </div>
          <ol className="how__steps">
            {STEPS.map((s, k) => (
              <li key={s.t}>
                <span className="how__n">{k + 1}</span>
                <b>{s.t}</b>
                <p>{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {brands.length > 0 && (
        <section className="sec sec--brands">
          <div className="wrap">
            <div className="sec__head">
              <h2 className="disp sec__t">Brands on the shelf</h2>
            </div>
            <ul className="brands">
              {brands.map(([b, n]) => (
                <li key={b}>
                  <Link href={`/search?q=${encodeURIComponent(b)}`}>
                    {b}
                    <sup>{n}</sup>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="brands__note">
              Prices shown in Bangladeshi taka. Delivery from {taka(70)} inside Dhaka and {taka(130)} outside.
            </p>
          </div>
        </section>
      )}
    </>
  );
}
