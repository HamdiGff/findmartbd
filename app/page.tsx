import { PriceTag, ProductCard } from "@/components/ProductCard";
import { Shelf } from "@/components/Shelf";
import { ArrowIcon, CashIcon, ReturnIcon, ShieldIcon, TruckIcon, WhatsappIcon } from "@/components/Icons";
import {
  SITE,
  brands,
  categories,
  categoryUrl,
  creatorGear,
  heroShelf,
  newArrivals,
  productUrl,
  solarPick,
  taka,
  underBudget,
} from "@/lib/catalog";

const promises = [
  { icon: <CashIcon />, title: "Cash on delivery", text: "Pay the rider after you check the parcel." },
  { icon: <TruckIcon />, title: "All 64 districts", text: "Dhaka in 1 to 2 days, elsewhere in 2 to 4." },
  { icon: <ShieldIcon />, title: "7-day warranty", text: "Faulty on arrival? We replace it." },
  { icon: <ReturnIcon />, title: "Easy returns", text: "Request a return from your account." },
];

const heroLabels = ["QCY MeloBuds N65", "Titan Urban Edge", "Hoco DS89 speaker"];

const steps = [
  { title: "Place your order", text: "Add products to your cart and check out with your name, phone and address. No advance payment." },
  { title: "We call to confirm", text: "Our team calls within a few hours to confirm the order and the delivery charge." },
  { title: "Check it, then pay", text: "The courier brings the parcel to your door. Open it, check it, and pay in cash." },
];

export default function Home() {
  return (
    <>
      {/* Hero: products on a shop shelf, each with a market price tag */}
      <section className="hero">
        <div className="wrap hero__inner">
          <div className="hero__copy">
            <h1>Good gadgets at fair prices. Pay when they reach your door.</h1>
            <p className="hero__lead">
              Earbuds, watches, power banks, mics and home gadgets from Hoco, QCY, Baseus, Fifine and more, delivered to
              all 64 districts.
            </p>
            <div className="hero__cta">
              <a className="btn btn--primary" href={SITE + "/shop/?sort=new"}>
                Shop new arrivals
              </a>
              <a className="btn btn--ghost" href="#categories">
                Browse categories
              </a>
            </div>
            <p className="hero__proof">1,300+ products in stock, all with a 7-day warranty.</p>
          </div>

          <div className="hero__stage" aria-label="Featured products">
            {heroShelf.map((p, i) => (
              <a key={p.slug} href={productUrl(p.slug)} className={`plinth plinth--${i + 1}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} width={360} height={360} />
                <span className="plinth__tag">
                  <span className="plinth__string" aria-hidden />
                  <PriceTag price={p.price} size="lg" />
                </span>
                <span className="plinth__name">{heroLabels[i]}</span>
              </a>
            ))}
            <div className="hero__board" aria-hidden />
          </div>
        </div>
      </section>

      <section className="promises" aria-label="Our promises">
        <div className="wrap promises__grid">
          {promises.map((x) => (
            <div key={x.title} className="promise">
              <span className="promise__icon">{x.icon}</span>
              <div>
                <h2>{x.title}</h2>
                <p>{x.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="categories">
        <div className="wrap">
          <div className="section__head">
            <h2>Shop by category</h2>
            <a className="link-more" href={SITE + "/shop/"}>
              See all products <ArrowIcon size={18} />
            </a>
          </div>
          <div className="cats">
            {categories.map((c) => (
              <a key={c.slug} href={categoryUrl(c.slug)} className="cat">
                <span className="cat__text">
                  <strong>{c.name}</strong>
                  <small>{c.note}</small>
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" loading="lazy" width={160} height={160} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div>
              <h2>New this week</h2>
              <p className="section__sub">Fresh stock that landed in the last few days.</p>
            </div>
          </div>
          <Shelf products={newArrivals} label="new arrivals" />
        </div>
      </section>

      <section className="studio">
        <div className="wrap studio__inner">
          <div className="studio__copy">
            <h2>Sound like a studio from your bedroom</h2>
            <p>
              USB and wireless microphones for YouTube, Facebook Live, gaming and online classes. Plug in, open your app,
              start recording.
            </p>
            <a className="btn btn--marigold" href={categoryUrl("creator-gear")}>
              Shop creator gear
            </a>
          </div>
          <div className="studio__grid">
            {creatorGear.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section__head">
            <div>
              <h2>Under {taka(1500)}</h2>
              <p className="section__sub">Small things that make every day easier.</p>
            </div>
            <a className="link-more" href={SITE + "/shop/?max=1500"}>
              See more under {taka(1500)} <ArrowIcon size={18} />
            </a>
          </div>
          <div className="grid">
            {underBudget.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <a className="solar" href={productUrl(solarPick.slug)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={solarPick.image} alt={solarPick.name} loading="lazy" width={520} height={520} />
            <div className="solar__copy">
              <h2>Cook straight from a 24V solar battery</h2>
              <p>
                The GearUP DC induction cooker runs on your solar system&apos;s battery bank, so you can cook through
                load-shedding without an inverter.
              </p>
              <span className="solar__price">
                <PriceTag price={solarPick.price} size="lg" />
                <span className="solar__go">
                  See the cooker <ArrowIcon size={18} />
                </span>
              </span>
            </div>
          </a>
        </div>
      </section>

      <section className="section how">
        <div className="wrap">
          <h2 className="how__title">How ordering works</h2>
          <ol className="steps">
            {steps.map((s) => (
              <li key={s.title} className="step">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section brands" aria-label="Brands we carry">
        <div className="wrap">
          <h2 className="brands__title">Brands we carry</h2>
          <ul className="brands__list">
            {brands.map((b) => (
              <li key={b}>
                <a href={`${SITE}/brand/${b.toLowerCase()}/`}>{b}</a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="help">
        <div className="wrap help__inner">
          <div>
            <h2>Not sure which one to buy?</h2>
            <p>Message us on WhatsApp with what you need and your budget. We reply with two or three good options.</p>
          </div>
          <a className="btn btn--wa" href="https://wa.me/8801757756651">
            <WhatsappIcon /> Chat on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
