"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { ProductCard } from "./ProductCard";
import {
  Bolt,
  Cart,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Phone,
  Pin,
  Plus,
  Share,
  Truck,
  Whatsapp,
  X,
} from "./Icons";
import { DISTRICTS, PHONE, PHONE_INTL, WHATSAPP, deliveryCharge, taka } from "@/lib/format";
import type { CardProduct } from "@/lib/catalog";

type P = { slug: string; name: string; price: number; image: string; stock: number };

/* ---------------- Gallery ---------------- */
export function Gallery({ images, name, badge }: { images: string[]; name: string; badge?: string }) {
  const [i, setI] = useState(0);
  const [origin, setOrigin] = useState<string | null>(null);
  const [full, setFull] = useState(false);
  const touch = useRef<number | null>(null);
  const n = images.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    if (!full) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [full]);

  return (
    <div className="gal">
      <div
        className="gal__stage"
        onMouseMove={(e) => {
          if (window.matchMedia("(hover: none)").matches) return;
          const r = e.currentTarget.getBoundingClientRect();
          setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
        }}
        onMouseLeave={() => setOrigin(null)}
        onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touch.current === null) return;
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touch.current = null;
        }}
      >
        <button className="gal__open" onClick={() => setFull(true)} aria-label="Open full-screen photos">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={images[i]}
            src={images[i]}
            alt={`${name}, photo ${i + 1}`}
            width={800}
            height={800}
            style={origin ? { transform: "scale(1.9)", transformOrigin: origin } : undefined}
          />
        </button>
        {badge && <span className="gal__badge">{badge}</span>}
        {n > 1 && (
          <>
            <button className="gal__nav gal__nav--prev" aria-label="Previous photo" onClick={() => go(-1)}>
              <ChevronLeft size={20} />
            </button>
            <button className="gal__nav gal__nav--next" aria-label="Next photo" onClick={() => go(1)}>
              <ChevronRight size={20} />
            </button>
            <span className="gal__count">
              {i + 1} / {n}
            </span>
          </>
        )}
        <span className="gal__hint">Hover to zoom · click for full screen</span>
      </div>
      {n > 1 && (
        <div className="gal__thumbs" role="tablist" aria-label="Product photos">
          {images.map((src, k) => (
            <button
              key={src}
              role="tab"
              aria-selected={k === i}
              aria-label={`Photo ${k + 1}`}
              className="gal__thumb"
              onClick={() => setI(k)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" width={90} height={90} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {full && (
        <div className="lightbox" role="dialog" aria-label="Product photos" onClick={() => setFull(false)}>
          <button className="lightbox__close" aria-label="Close" onClick={() => setFull(false)}>
            <X size={24} />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[i]} alt={name} onClick={(e) => e.stopPropagation()} />
          {n > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
              >
                <ChevronLeft size={26} />
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
              >
                <ChevronRight size={26} />
              </button>
              <span className="lightbox__count">
                {i + 1} / {n}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- Delivery estimate ---------------- */
function dhakaNow() {
  return new Date(Date.now() + 6 * 3600 * 1000);
}
function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x;
}
const fmt = (d: Date) => d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

function DeliveryEstimate() {
  const [district, setDistrict] = useState("Dhaka");
  useEffect(() => {
    try {
      const saved = localStorage.getItem("fm-district");
      if (saved && DISTRICTS.includes(saved)) setDistrict(saved);
    } catch {}
  }, []);
  const inside = district === "Dhaka";
  const now = dhakaNow();
  const late = now.getUTCHours() >= 17; // orders after 5pm are confirmed next day
  const start = addDays(now, (inside ? 1 : 2) + (late ? 1 : 0));
  const end = addDays(now, (inside ? 2 : 4) + (late ? 1 : 0));

  return (
    <div className="eta">
      <div className="eta__row">
        <span className="eta__ic">
          <Pin size={18} />
        </span>
        <label htmlFor="eta-district">Deliver to</label>
        <select
          id="eta-district"
          value={district}
          onChange={(e) => {
            setDistrict(e.target.value);
            try {
              localStorage.setItem("fm-district", e.target.value);
            } catch {}
          }}
        >
          {DISTRICTS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>
      <div className="eta__row eta__row--info">
        <span className="eta__ic">
          <Truck size={18} />
        </span>
        <p>
          Arrives <b>{fmt(start)} – {fmt(end)}</b>
          <span>
            Delivery charge {taka(deliveryCharge(district))} · Pay cash when it arrives
          </span>
        </p>
      </div>
    </div>
  );
}

/* ---------------- Buy panel ---------------- */
export function BuyPanel({ p, highlights }: { p: P; highlights: string[] }) {
  const { add, wishlist, toggleWish, notify } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const out = p.stock < 1;
  const max = Math.max(1, Math.min(10, p.stock));
  const saved = wishlist.includes(p.slug);
  const item = { slug: p.slug, name: p.name, price: p.price, image: p.image };
  const waText = encodeURIComponent(`Hi FindMart, I want to order:\n${p.name}\nPrice: ${taka(p.price)}\nQuantity: ${qty}`);
  const actions = useRef<HTMLDivElement>(null);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const el = actions.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const buyNow = () => {
    add(item, qty, false);
    router.push("/checkout");
  };
  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: p.name, url: location.href });
      else {
        await navigator.clipboard.writeText(location.href);
        notify("Link copied");
      }
    } catch {}
  }

  return (
    <>
      {highlights.length > 0 && (
        <ul className="hl">
          {highlights.map((h) => (
            <li key={h}>
              <Check size={16} />
              {h}
            </li>
          ))}
          <li className="hl__more">
            <a href="#details">See full details</a>
          </li>
        </ul>
      )}

      <DeliveryEstimate />

      <div className="buyact" ref={actions}>
        <div className="buyact__row">
          <div className="qty qty--lg" role="group" aria-label="Quantity">
            <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>
              <Minus size={16} />
            </button>
            <span>{qty}</span>
            <button type="button" aria-label="Increase quantity" disabled={qty >= max} onClick={() => setQty(qty + 1)}>
              <Plus size={16} />
            </button>
          </div>
          <button className="btn btn--dark btn--lg buyact__add" disabled={out} onClick={() => add(item, qty)}>
            <Cart size={18} /> Add to cart
          </button>
        </div>
        <button className="btn btn--brand btn--xl btn--block" disabled={out} onClick={buyNow}>
          <Bolt size={19} /> {out ? "Out of stock" : `Buy now · ${taka(p.price * qty)}`}
        </button>
        <div className="buyact__alt">
          <a className="btn btn--wa-soft btn--lg" href={`${WHATSAPP}?text=${waText}`} target="_blank" rel="noopener">
            <Whatsapp size={19} /> WhatsApp order
          </a>
          <a className="btn btn--ghost btn--lg" href={`tel:${PHONE_INTL}`}>
            <Phone size={18} /> {PHONE}
          </a>
        </div>
        <div className="buyact__links">
          <button onClick={() => toggleWish(p.slug)} aria-pressed={saved}>
            <Heart size={17} filled={saved} /> {saved ? "Saved" : "Save for later"}
          </button>
          <button onClick={share}>
            <Share size={16} /> Share
          </button>
        </div>
      </div>

      <div className="stickybuy" data-show={showBar} aria-hidden={!showBar}>
        <div className="wrap stickybuy__in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt="" width={48} height={48} />
          <div className="stickybuy__t">
            <b>{p.name}</b>
            <span>{taka(p.price)} · Cash on delivery</span>
          </div>
          <button className="btn btn--dark stickybuy__add" disabled={out} onClick={() => add(item, qty)} tabIndex={showBar ? 0 : -1}>
            <Cart size={17} /> <span>Add to cart</span>
          </button>
          <button className="btn btn--brand" disabled={out} onClick={buyNow} tabIndex={showBar ? 0 : -1}>
            Buy now
          </button>
        </div>
      </div>
    </>
  );
}

/* ---------------- Description with read more ---------------- */
export function Expandable({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [tall, setTall] = useState(false);
  useEffect(() => {
    if (ref.current) setTall(ref.current.scrollHeight > 720);
  }, [html]);
  return (
    <div className={`expand${tall && !open ? " is-clamped" : ""}`}>
      <div ref={ref} className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      {tall && (
        <button className="btn btn--ghost expand__btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          {open ? "Show less" : "Read full description"} <ChevronDown size={16} style={open ? { transform: "rotate(180deg)" } : undefined} />
        </button>
      )}
    </div>
  );
}

/* ---------------- Recently viewed ---------------- */
const RV = "fm-recent";
export function RecentlyViewed({ current }: { current: CardProduct }) {
  const [items, setItems] = useState<CardProduct[]>([]);
  useEffect(() => {
    try {
      const list: CardProduct[] = JSON.parse(localStorage.getItem(RV) ?? "[]");
      setItems(list.filter((x) => x.slug !== current.slug).slice(0, 10));
      const next = [current, ...list.filter((x) => x.slug !== current.slug)].slice(0, 16);
      localStorage.setItem(RV, JSON.stringify(next));
    } catch {}
  }, [current]);
  if (!items.length) return null;
  return (
    <section className="block">
      <div className="wrap">
        <div className="block__head">
          <h2>Recently viewed</h2>
          <Link href="/shop" className="seeall">
            Keep shopping
          </Link>
        </div>
        <div className="rowtrack">
          {items.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Section tabs ---------------- */
export function PdpTabs({ tabs }: { tabs: { id: string; label: string }[] }) {
  const [on, setOn] = useState(tabs[0]?.id);
  useEffect(() => {
    const els = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setOn(vis.target.id);
      },
      { rootMargin: "-200px 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [tabs]);
  return (
    <nav className="ptabs" aria-label="Product sections">
      {tabs.map((t) => (
        <a key={t.id} href={`#${t.id}`} className={on === t.id ? "is-on" : ""}>
          {t.label}
        </a>
      ))}
    </nav>
  );
}
