import Link from "next/link";
import { HeroSlider, type Slide } from "@/components/HeroSlider";
import { ProductRow } from "@/components/ProductRow";
import { ProductCard } from "@/components/ProductCard";
import { BackupPlanner } from "@/components/BackupPlanner";
import { Arrow, Cash, CategoryIcon, Return, Shield, Truck } from "@/components/Icons";
import { CATEGORIES } from "@/lib/categories";
import { getAllProducts, toCard, type Product } from "@/lib/catalog";
import { taka } from "@/lib/format";

export const revalidate = 3600;

const pick = (list: Product[], re: RegExp) => list.find((p) => re.test(p.name)) ?? list[0];

export default async function Home() {
  const all = await getAllProducts();
  const by = (slug: string) => all.filter((p) => p.category === slug);
  const minPrice = (slug: string) => Math.min(...by(slug).map((p) => p.price));

  const audio = by("earbuds-headphones");
  const smart = by("smart-watches");
  const creator = by("creator-gear");
  const power = by("power-charging");
  const solar = by("solar-power-backup");

  const slides: Slide[] = [
    audio.length && {
      kicker: "New in audio",
      tab: "Audio",
      title: "Hear more. Hear less noise.",
      text: "Active noise cancelling earbuds from QCY, CMF, Acefast and Hoco, delivered with cash on delivery.",
      href: "/category/earbuds-headphones",
      cta: "Shop earbuds",
      ...slideFrom(pick(audio, /anc|melobuds|cmf/i)),
      theme: "night" as const,
    },
    smart.length && {
      kicker: "Smart watches",
      tab: "Watches",
      title: "Calls, steps and sleep on your wrist.",
      text: "Bluetooth calling, AMOLED screens and week-long battery life, starting at a price that makes sense.",
      href: "/category/smart-watches",
      cta: "Shop smart watches",
      ...slideFrom(pick(smart, /calling|amoled|hoco y4/i)),
      theme: "ocean" as const,
    },
    creator.length && {
      kicker: "For creators",
      tab: "Creators",
      title: "Studio sound from your bedroom.",
      text: "USB, XLR and wireless mics for YouTube, Facebook Live, gaming and online classes.",
      href: "/category/creator-gear",
      cta: "Shop creator gear",
      ...slideFrom(pick(creator, /fifine k|condenser|wireless mic/i)),
      theme: "plum" as const,
    },
  ].filter(Boolean) as Slide[];

  const sideA = power.length ? pick(power, /power bank/i) : null;
  const sideB = solar.length ? pick(solar, /mppt|power station|cooker/i) : null;

  const tiles = ["smart-watches", "earbuds-headphones", "power-charging", "creator-gear", "solar-power-backup", "home-kitchen"]
    .map((slug) => CATEGORIES.find((c) => c.slug === slug)!)
    .map((c) => ({ ...c, image: pick(by(c.slug), /./)?.image, from: minPrice(c.slug), count: by(c.slug).length }))
    .filter((c) => c.count > 0);

  const budget = all.filter((p) => p.price <= 999 && p.stock > 0).slice(0, 10);

  const inStock = all.filter((p) => p.stock > 0);
  const gadgets = all.filter((p) => p.category !== "home-kitchen" && p.category !== "personal-care");
  const mix = (items: Product[]) => {
    const seen = new Set<string>();
    const out: Product[] = [];
    for (const p of items) {
      if (seen.has(p.category)) continue;
      seen.add(p.category);
      out.push(p);
      if (out.length === 3) break;
    }
    return out;
  };
  const bands = [
    { big: "৳500", lead: "Under", href: "/shop?max=500", from: 0, to: 500, tone: "mint" },
    { big: "৳1,000", lead: "Under", href: "/shop?max=1000", from: 500, to: 1000, tone: "sun" },
    { big: "৳2,500", lead: "Under", href: "/shop?max=2500", from: 1000, to: 2500, tone: "sky" },
    { big: "৳5,000+", lead: "Premium picks", href: "/shop?min=5000", from: 4999, to: Infinity, tone: "ink" },
  ].map((b) => {
    const within = inStock.filter((p) => (b.lead === "Under" ? p.price <= b.to : p.price >= 5000));
    const band = inStock.filter((p) => p.price > b.from && p.price <= b.to);
    return { ...b, count: within.length, imgs: mix(band.length >= 3 ? band : within) };
  });

  const gear = [...solar]
    .filter((p) => p.stock > 0)
    .sort((a, b) => Number(/power station|lifepo4|battery|inverter|ips/i.test(b.name)) - Number(/power station|lifepo4|battery|inverter|ips/i.test(a.name)))
    .slice(0, 3)
    .map((p) => ({ slug: p.slug, name: shortName(p.name), price: p.price, image: p.image }));
  const studioPicks = creator.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid">
          <HeroSlider slides={slides} />
          <div className="hero__side">
            {sideA && (
              <Link href={`/product/${sideA.slug}`} className="hcard hcard--sun">
                <div>
                  <span className="hcard__kicker">Never run out</span>
                  <h2>Power banks and fast chargers</h2>
                  <span className="hcard__from">From {taka(Math.min(...power.filter((p) => /power bank/i.test(p.name)).map((p) => p.price), sideA.price))}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sideA.image} alt={sideA.name} width={220} height={220} />
              </Link>
            )}
            {sideB && (
              <Link href="/category/solar-power-backup" className="hcard hcard--mint">
                <div>
                  <span className="hcard__kicker">Load-shedding ready</span>
                  <h2>Solar and power backup</h2>
                  <span className="hcard__from">From {taka(minPrice("solar-power-backup"))}</span>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={sideB.image} alt={sideB.name} width={220} height={220} />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="block block--tight">
        <div className="wrap">
          <div className="circles">
            {CATEGORIES.map((c) => {
              const items = by(c.slug);
              return (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="circle-cat"
                  style={{ ["--tint" as string]: c.tint, ["--acc" as string]: c.accent }}
                >
                  <span className="circle-cat__img">
                    {items[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={items[0].image} alt="" width={80} height={80} loading="lazy" />
                    ) : (
                      <CategoryIcon name={c.icon} size={30} />
                    )}
                  </span>
                  <span>
                    {c.short === "Audio" ? "Earbuds" : c.name.split(" & ")[0]}
                    <small>{items.length} items</small>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="block block--tight">
        <div className="wrap">
          <div className="trust">
            <div className="trust__item">
              <span className="trust__ic"><Cash size={24} /></span>
              <div><b>Cash on delivery</b><span>Open the parcel, then pay</span></div>
            </div>
            <div className="trust__item">
              <span className="trust__ic"><Truck size={24} /></span>
              <div><b>All 64 districts</b><span>Dhaka 1–2 days, others 2–4</span></div>
            </div>
            <div className="trust__item">
              <span className="trust__ic"><Shield size={24} /></span>
              <div><b>7-day warranty</b><span>Faulty items replaced</span></div>
            </div>
            <div className="trust__item">
              <span className="trust__ic"><Return size={24} /></span>
              <div><b>Easy returns</b><span>Simple return requests</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap block__head"><div><h2>Shop by category</h2><p className="block__sub">Pick a category to see everything in stock</p></div></div>
        <div className="wrap">
          <div className="tiles">
            {tiles.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="tile"
                style={{ ["--tint" as string]: c.tint, ["--acc" as string]: c.accent }}
              >
                <span className="tile__img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt="" width={200} height={200} loading="lazy" />
                </span>
                <span className="tile__body">
                  <span className="tile__ic">
                    <CategoryIcon name={c.icon} size={20} />
                  </span>
                  <strong>{c.name}</strong>
                  <small>{c.blurb}</small>
                  <span className="tile__from">From {taka(c.from)}</span>
                  <span className="tile__btn">
                    Shop now <Arrow size={15} />
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="block__head">
            <div>
              <h2>Shop by budget</h2>
              <p className="block__sub">Pick a price and see what is in stock</p>
            </div>
            <Link href="/shop" className="seeall">
              See all products <Arrow size={16} />
            </Link>
          </div>
          <div className="budget">
            {bands.map((b) => (
              <Link key={b.big} href={b.href} className={`bcard bcard--${b.tone}`}>
                <span className="bcard__lead">{b.lead}</span>
                <span className="bcard__big">{b.big}</span>
                <span className="bcard__count">{b.count.toLocaleString("en-IN")} products in stock</span>
                <span className="bcard__imgs" aria-hidden>
                  {b.imgs.map((p) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={p.slug} src={p.image} alt="" width={96} height={96} loading="lazy" />
                  ))}
                </span>
                <span className="bcard__go">
                  <Arrow size={18} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ProductRow title="New arrivals" href="/shop?sort=new" products={gadgets.slice(0, 12).map(toCard)} />

      {studioPicks.length === 4 && (
        <section className="block">
          <div className="wrap">
            <div className="showcase">
              <div className="showcase__head">
                <h2>Creator Studio</h2>
                <p>Microphones and gear for clear sound on every video and live stream</p>
              </div>
              <Link href="/category/creator-gear" className="showcase__cta">
                Explore the studio <Arrow size={18} />
              </Link>
              <div className="showcase__stage">
                {studioPicks.map((p, n) => (
                  <Link key={p.slug} href={`/product/${p.slug}`} className={`podium podium--${n + 1}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image} alt={p.name} width={260} height={260} loading="lazy" />
                    <span className="podium__label">
                      <span className="podium__name">{shortName(p.name)}</span>
                      <b>{taka(p.price)}</b>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <ProductRow title="Earbuds & headphones" href="/category/earbuds-headphones" products={audio.slice(0, 12).map(toCard)} />
      <ProductRow title="Smart watches" href="/category/smart-watches" products={smart.slice(0, 12).map(toCard)} />

      {sideB && (
        <section className="block">
          <div className="wrap">
            <BackupPlanner gear={gear} />
          </div>
        </section>
      )}

      <ProductRow title="Power banks & chargers" href="/category/power-charging" products={power.slice(0, 12).map(toCard)} />

      {budget.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="block__head">
              <h2>Great finds under {taka(999)}</h2>
              <Link href="/shop?max=999" className="seeall">
                See all <Arrow size={16} />
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

      <section className="block">
        <div className="wrap">
          <div className="block__head">
            <h2>Top brands</h2>
          </div>
          <div className="brands">
            {["Hoco", "QCY", "Baseus", "Anker", "Joyroom", "Fifine", "Maono", "Titan", "Fastrack", "Xiaomi", "Ugreen", "Awei"].map(
              (b) => (
                <Link key={b} href={`/search?q=${encodeURIComponent(b)}`} className="brand">
                  {b}
                </Link>
              ),
            )}
          </div>
        </div>
      </section>
      <section className="block">
        <div className="wrap">
          <div className="block__head">
            <div>
              <h2>How ordering works</h2>
              <p className="block__sub">You pay only when the parcel is in your hands</p>
            </div>
            <Link href="/track-order" className="seeall">
              Track an order <Arrow size={16} />
            </Link>
          </div>
          <ol className="steps">
            <li>
              <span className="steps__n">1</span>
              <h3>Choose your gadgets</h3>
              <p>Add items to the cart and enter your name, phone number and address. You pay nothing now.</p>
            </li>
            <li>
              <span className="steps__n">2</span>
              <h3>We call to confirm</h3>
              <p>We phone you to check the address and delivery time. The parcel leaves only after you say yes.</p>
            </li>
            <li>
              <span className="steps__n">3</span>
              <h3>Check, then pay the rider</h3>
              <p>Open the parcel in front of the rider. Pay in cash only if the product is right.</p>
            </li>
          </ol>
        </div>
      </section>
    </>
  );
}

function slideFrom(p: Product) {
  return { image: p.image, price: p.price, name: shortName(p.name) };
}

function shortName(name: string) {
  const n = name.split(/\s[-–|]\s|[,(]/)[0].trim();
  return n.length > 34 ? n.slice(0, 32).trim() + "…" : n;
}
