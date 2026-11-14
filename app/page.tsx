import Link from "next/link";
import { HeroSlider, type Slide } from "@/components/HeroSlider";
import { ProductRow } from "@/components/ProductRow";
import { ProductCard } from "@/components/ProductCard";
import { Arrow, CategoryIcon } from "@/components/Icons";
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
      title: "Hear more. Hear less noise.",
      text: "Active noise cancelling earbuds from QCY, CMF, Acefast and Hoco, delivered with cash on delivery.",
      href: "/category/earbuds-headphones",
      cta: "Shop earbuds",
      ...slideFrom(pick(audio, /anc|melobuds|cmf/i)),
      theme: "night" as const,
    },
    smart.length && {
      kicker: "Smart watches",
      title: "Calls, steps and sleep on your wrist.",
      text: "Bluetooth calling, AMOLED screens and week-long battery life, starting at a price that makes sense.",
      href: "/category/smart-watches",
      cta: "Shop smart watches",
      ...slideFrom(pick(smart, /calling|amoled|hoco y4/i)),
      theme: "ocean" as const,
    },
    creator.length && {
      kicker: "For creators",
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

      <section className="block">
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
            <h2>Browse all categories</h2>
            <Link href="/shop" className="seeall">
              See all products <Arrow size={16} />
            </Link>
          </div>
          <div className="chips">
            {CATEGORIES.map((c) => {
              const first = by(c.slug)[0];
              return (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="chip"
                  style={{ ["--tint" as string]: c.tint }}
                >
                  <span className="chip__txt">
                    <b>{c.name}</b>
                    <small>{by(c.slug).length} items</small>
                  </span>
                  {first && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={first.image} alt="" width={56} height={56} loading="lazy" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <ProductRow title="New arrivals" href="/shop?sort=new" products={all.slice(0, 12).map(toCard)} />

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
            <Link href="/category/solar-power-backup" className="banner">
              <div className="banner__copy">
                <span className="banner__kicker">Solar &amp; power backup</span>
                <h2>Keep the lights on through load-shedding</h2>
                <p>MPPT charge controllers, portable power stations, DC breakers and solar-ready appliances.</p>
                <span className="btn btn--brand btn--lg">
                  Shop solar <Arrow size={18} />
                </span>
              </div>
              <div className="banner__art">
                {solar.slice(0, 3).map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.slug} src={p.image} alt="" width={220} height={220} loading="lazy" />
                ))}
              </div>
            </Link>
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
