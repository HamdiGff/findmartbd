"use client";

import Link from "next/link";
import { useState } from "react";
import { taka } from "@/lib/format";

export type StageSlide = {
  slug: string;
  name: string;
  ghost: string;
  headline: string;
  blurb: string;
  tint: string;
  accent: string;
  from: number;
  count: number;
  items: { slug: string; name: string; price: number; image: string }[];
};

/** The home page's opening scene. Choosing an aisle repaints the whole stage and puts that aisle's products on it. */
export function Stage({ slides }: { slides: StageSlide[] }) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  const s = slides[i];
  const next = () => setI((x) => (x + 1) % slides.length);

  return (
    <section className="stage" aria-roledescription="carousel" aria-label="Featured aisles">
      <div
        className="stage__panel"
        style={{ ["--tint" as string]: s.tint, ["--deep" as string]: s.accent }}
        data-hold={hold}
        onMouseEnter={() => setHold(true)}
        onMouseLeave={() => setHold(false)}
        onFocus={() => setHold(true)}
        onBlur={() => setHold(false)}
      >
        <span className="stage__ghost" aria-hidden key={`g-${s.slug}`}>
          {s.ghost}
        </span>

        <div className="stage__copy" key={`c-${s.slug}`}>
          <p className="disp stage__h">{s.headline}</p>
          <p className="stage__p">{s.blurb}</p>
          <div className="stage__cta">
            <Link href={`/category/${s.slug}`} className="btn btn--brand btn--lg">
              Shop {s.name.toLowerCase()}
            </Link>
            <span className="stage__from">
              From <b>{taka(s.from)}</b>
              <br />
              {s.count} products
            </span>
          </div>
        </div>

        <div className="stage__art" key={`a-${s.slug}`}>
          {s.items.map((it, k) => (
            <Link key={it.slug} href={`/product/${it.slug}`} className={`stage__item stage__item--${k + 1}`} prefetch={false}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.image} alt={it.name} width={520} height={520} loading={i === 0 ? "eager" : "lazy"} />
              <span className="stage__tag">
                <b>{taka(it.price)}</b>
                <span>{it.name}</span>
              </span>
            </Link>
          ))}
        </div>

        <div className="stage__tabs" role="tablist" aria-label="Choose an aisle">
          {slides.map((x, k) => (
            <button
              key={x.slug}
              role="tab"
              aria-selected={k === i}
              className="stage__tab"
              onClick={() => setI(k)}
            >
              <i style={{ background: x.tint, boxShadow: `inset 0 0 0 2.5px ${x.accent}` }} />
              {x.name}
              {k === i && <span className="stage__bar" onAnimationEnd={next} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
