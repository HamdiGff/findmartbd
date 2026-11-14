"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { Logo } from "./Logo";
import { Arrow, Cart, Grid, Heart, Phone, Search, User, X } from "./Icons";
import { CATEGORIES } from "@/lib/categories";
import { PHONE, PHONE_INTL, taka } from "@/lib/format";

export type CatMeta = { slug: string; count: number; image?: string };

const PLACEHOLDERS = ["ANC earbuds", "smart watch", "power bank", "wireless mic", "Wi-Fi router", "MPPT controller"];
const QUICK = ["smart-watches", "earbuds-headphones", "power-charging", "solar-power-backup", "creator-gear", "home-kitchen"];

function SearchBox({ id = "q" }: { id?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [hint, setHint] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % PLACEHOLDERS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <form
      className="hs"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
      }}
    >
      <Search size={20} className="hs__ic" />
      <label htmlFor={id} className="sr-only">
        Search products
      </label>
      <input
        id={id}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Search "${PLACEHOLDERS[hint]}" and 1,300+ more`}
        autoComplete="off"
        enterKeyHint="search"
      />
      <button type="submit" className="hs__go">
        Search
      </button>
    </form>
  );
}

/** Full-screen index of every aisle. */
function AisleIndex({ meta, open, onClose }: { meta: CatMeta[]; open: boolean; onClose: () => void }) {
  const [on, setOn] = useState(0);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", k);
    closeBtn.current?.focus();
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", k);
    };
  }, [open, onClose]);

  const cur = CATEGORIES[on];
  const curMeta = meta.find((m) => m.slug === cur.slug);

  return (
    <div className="ai" data-open={open} aria-hidden={!open} role="dialog" aria-label="All aisles">
      <div className="ai__top">
        <Logo />
        <button ref={closeBtn} className="ai__close" onClick={onClose} aria-label="Close aisles" tabIndex={open ? 0 : -1}>
          <X size={22} /> <span>Close</span>
        </button>
      </div>
      <div className="ai__body">
        <ul className="ai__list">
          {CATEGORIES.map((c, i) => {
            const m = meta.find((x) => x.slug === c.slug);
            return (
              <li key={c.slug}>
                <Link
                  href={`/category/${c.slug}`}
                  className="ai__row"
                  data-on={i === on}
                  onMouseEnter={() => setOn(i)}
                  onFocus={() => setOn(i)}
                  onClick={onClose}
                  tabIndex={open ? 0 : -1}
                >
                  <span className="ai__dot" style={{ background: c.tint, boxShadow: `inset 0 0 0 3px ${c.accent}` }} />
                  <span className="ai__name">{c.name}</span>
                  {m && <span className="ai__count">{m.count}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href={`/category/${cur.slug}`}
          className="ai__peek"
          style={{ background: cur.tint, color: cur.accent }}
          onClick={onClose}
          tabIndex={open ? 0 : -1}
        >
          {curMeta?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={cur.slug} src={curMeta.image} alt="" width={420} height={420} />
          )}
          <span className="ai__peek-t">{cur.blurb}</span>
          <span className="ai__peek-go">
            Walk this aisle <Arrow size={18} />
          </span>
        </Link>
      </div>
      <div className="ai__foot">
        <Link href="/shop" onClick={onClose} tabIndex={open ? 0 : -1}>Shop everything</Link>
        <Link href="/track-order" onClick={onClose} tabIndex={open ? 0 : -1}>Track your order</Link>
        <Link href="/wishlist" onClick={onClose} tabIndex={open ? 0 : -1}>Wishlist</Link>
        <Link href="/account" onClick={onClose} tabIndex={open ? 0 : -1}>Sign in</Link>
        <a href={`tel:${PHONE_INTL}`} tabIndex={open ? 0 : -1}>
          <Phone size={16} /> {PHONE}
        </a>
      </div>
    </div>
  );
}

export function Header({ meta }: { meta: CatMeta[] }) {
  const { count, subtotal, wishlist, setDrawerOpen } = useCart();
  const [aisles, setAisles] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setAisles(false);
  }, [pathname]);

  return (
    <>
      <div className="hd__strip">
        <div className="wrap hd__strip-in">
          <p>
            Cash on delivery in all 64 districts<span className="hd__long">. Open the parcel, check it, then pay the rider.</span>
          </p>
          <p className="hd__strip-r">
            <a href={`tel:${PHONE_INTL}`}>Hotline {PHONE}</a>
            <Link href="/track-order">Track order</Link>
            <Link href="/page/contact">Help</Link>
          </p>
        </div>
      </div>

      <header className="hd">
        <div className="wrap hd__row">
          <button className="hd__aisles" aria-expanded={aisles} onClick={() => setAisles(true)}>
            <Grid size={20} /> <span>Aisles</span>
          </button>
          <Link href="/" aria-label="FindMart home" className="hd__logo">
            <Logo />
          </Link>
          <Suspense fallback={<div className="hs" />}>
            <SearchBox />
          </Suspense>
          <nav className="hd__acts" aria-label="Your account">
            <button
              className="hd__ico hd__ico--search"
              aria-label="Search"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setTimeout(() => document.getElementById("qm")?.focus(), 250);
              }}
            >
              <Search size={22} />
            </button>
            <Link href="/account" className="hd__ico hd__ico--account" aria-label="Account">
              <User size={22} />
            </Link>
            <Link href="/wishlist" className="hd__ico" aria-label="Wishlist">
              <Heart size={22} />
              {wishlist.length > 0 && <b className="hd__n">{wishlist.length}</b>}
            </Link>
            <button className="hd__cart" onClick={() => setDrawerOpen(true)} aria-label="Open cart">
              <Cart size={20} />
              <span className="hd__cart-t">{count > 0 ? taka(subtotal) : "Cart"}</span>
              {count > 0 && (
                <b className="hd__cart-n" key={count}>
                  {count}
                </b>
              )}
            </button>
          </nav>
        </div>
      </header>

      <nav className="hd__sub" aria-label="Aisles">
        <div className="wrap hd__msearch">
          <Suspense fallback={<div className="hs" />}>
            <SearchBox id="qm" />
          </Suspense>
        </div>
        <div className="wrap hd__sub-in">
          <ul>
            {QUICK.map((slug) => {
              const c = CATEGORIES.find((x) => x.slug === slug)!;
              return (
                <li key={slug}>
                  <Link href={`/category/${slug}`} className={pathname === `/category/${slug}` ? "is-on" : ""}>
                    <i style={{ background: c.tint, boxShadow: `inset 0 0 0 2px ${c.accent}` }} />
                    {c.name.replace(" & Headphones", "").replace(" & Backup", "")}
                  </Link>
                </li>
              );
            })}
            <li>
              <button className="hd__more" onClick={() => setAisles(true)}>
                All {CATEGORIES.length} aisles
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <AisleIndex meta={meta} open={aisles} onClose={() => setAisles(false)} />
    </>
  );
}
