"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Arrow } from "./Icons";
import { taka } from "@/lib/format";

export type Slide = {
  kicker: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  image: string;
  price: number;
  name: string;
  theme: "night" | "ocean" | "plum";
};

export function HeroSlider({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, [paused, slides.length]);

  return (
    <div
      className="hslider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, n) => (
        <div
          key={s.href}
          className={`hslide hslide--${s.theme}`}
          data-active={n === i}
          aria-hidden={n !== i}
          role="group"
          aria-roledescription="slide"
          aria-label={`${n + 1} of ${slides.length}`}
        >
          <div className="hslide__copy">
            <span className="hslide__kicker">{s.kicker}</span>
            <h1 className="hslide__title">{s.title}</h1>
            <p className="hslide__text">{s.text}</p>
            <Link href={s.href} className="btn btn--brand btn--lg" tabIndex={n === i ? 0 : -1}>
              {s.cta} <Arrow size={18} />
            </Link>
          </div>
          <div className="hslide__art">
            <span className="hslide__glow" aria-hidden />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.image} alt={s.name} width={520} height={520} loading={n === 0 ? "eager" : "lazy"} />
            <span className="hslide__price">
              <small>{s.name}</small>
              {taka(s.price)}
            </span>
          </div>
        </div>
      ))}
      <div className="hslider__dots" role="tablist" aria-label="Choose slide">
        {slides.map((s, n) => (
          <button
            key={s.href}
            role="tab"
            aria-selected={n === i}
            aria-label={`Show slide ${n + 1}`}
            className="hslider__dot"
            data-on={n === i}
            onClick={() => setI(n)}
          >
            <span style={{ animationPlayState: paused ? "paused" : "running" }} />
          </button>
        ))}
      </div>
    </div>
  );
}
