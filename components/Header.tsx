"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { Logo } from "./Logo";
import { Arrow, Cart, CategoryIcon, ChevronDown, Grid, Heart, Menu, Phone, Search, Truck, User, X } from "./Icons";
import { CATEGORIES } from "@/lib/categories";
import { PHONE, PHONE_INTL, taka } from "@/lib/format";

export type CatMeta = { slug: string; count: number; image?: string };

const PLACEHOLDERS = ["ANC earbuds", "smart watch", "power bank", "wireless mic", "Wi-Fi router", "MPPT controller"];
const NOTICES = [
  "Cash on delivery in all 64 districts — open the parcel, then pay",
  "7-day replacement warranty on every product",
  `Need help choosing? Call or WhatsApp ${PHONE}`,
];
const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop all" },
  { href: "/category/smart-watches", label: "Smart watches" },
  { href: "/category/earbuds-headphones", label: "Earbuds" },
  { href: "/category/power-charging", label: "Power banks" },
  { href: "/category/creator-gear", label: "Creator gear" },
  { href: "/category/solar-power-backup", label: "Solar & backup", hot: true },
];

function SearchBox() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [cat, setCat] = useState(params.get("cat") ?? "");
  const [hint, setHint] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % PLACEHOLDERS.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <form
      className="hsearch"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        if (!term && cat) return router.push(`/category/${cat}`);
        if (term) router.push(`/search?q=${encodeURIComponent(term)}${cat ? `&cat=${cat}` : ""}`);
      }}
    >
      <label htmlFor="hcat" className="sr-only">
        Category
      </label>
      <select id="hcat" className="hsearch__cat" value={cat} onChange={(e) => setCat(e.target.value)}>
        <option value="">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.short === "Audio" ? "Earbuds" : c.short}
          </option>
        ))}
      </select>
      <label htmlFor="q" className="sr-only">
        Search products
      </label>
      <input
        id="q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Search for "${PLACEHOLDERS[hint]}"`}
        autoComplete="off"
        enterKeyHint="search"
      />
      <button type="submit" className="hsearch__go" aria-label="Search">
        <Search size={20} />
        <span>Search</span>
      </button>
    </form>
  );
}

function MegaMenu({ meta, open, onClose }: { meta: CatMeta[]; open: boolean; onClose: () => void }) {
  return (
    <div className="mega" data-open={open} onMouseLeave={onClose}>
      <div className="wrap mega__in">
        <ul className="mega__grid">
          {CATEGORIES.map((c) => {
            const m = meta.find((x) => x.slug === c.slug);
            return (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="mega__item" onClick={onClose} tabIndex={open ? 0 : -1}>
                  <span className="mega__thumb" style={{ background: c.tint }}>
                    {m?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.image} alt="" width={64} height={64} loading="lazy" />
                    ) : (
                      <CategoryIcon name={c.icon} size={24} style={{ color: c.accent }} />
                    )}
                  </span>
                  <span>
                    <b>{c.name}</b>
                    <small>{m ? `${m.count} products` : c.blurb}</small>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/category/solar-power-backup" className="mega__promo" onClick={onClose} tabIndex={open ? 0 : -1}>
          <span className="mega__promo-k">Load-shedding ready</span>
          <b>Solar &amp; power backup</b>
          <span>MPPT controllers, power stations and DC breakers</span>
          <span className="mega__promo-cta">
            Shop now <Arrow size={16} />
          </span>
        </Link>
      </div>
    </div>
  );
}

export function Header({ meta }: { meta: CatMeta[] }) {
  const { count, subtotal, wishlist, setDrawerOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notice, setNotice] = useState(0);
  const pathname = usePathname();
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMenu(false);
    setMega(false);
  }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    const id = setInterval(() => setNotice((n) => (n + 1) % NOTICES.length), 4500);
    return () => {
      window.removeEventListener("scroll", on);
      clearInterval(id);
    };
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setMega(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMega(true);
  };
  const closeMega = () => {
    megaTimer.current = setTimeout(() => setMega(false), 120);
  };

  return (
    <header className="header" data-scrolled={scrolled}>
      <div className="announce">
        <div className="wrap announce__in">
          <span className="announce__left">
            <Truck size={15} /> Delivery all over Bangladesh
          </span>
          <p className="announce__msg" aria-live="polite">
            <span key={notice}>{NOTICES[notice]}</span>
          </p>
          <span className="announce__right">
            <Link href="/track-order">Track order</Link>
            <Link href="/page/contact">Help</Link>
          </span>
        </div>
      </div>

      <div className="hbar">
        <div className="wrap hmain">
          <button className="iconbtn hmain__menu" aria-label="Open menu" onClick={() => setMenu(true)}>
            <Menu size={24} />
          </button>
          <Link href="/" aria-label="FindMart home" className="hmain__logo">
            <Logo />
          </Link>
          <Suspense fallback={<div className="hsearch" />}>
            <SearchBox />
          </Suspense>
          <a href={`tel:${PHONE_INTL}`} className="hotline">
            <span className="hotline__ic">
              <Phone size={20} />
            </span>
            <span>
              <small>Hotline, 10am–8pm</small>
              <b>{PHONE}</b>
            </span>
          </a>
          <nav className="hact" aria-label="Your account">
            <Link href="/account" className="hact__item hact__item--account" aria-label="Account">
              <span className="hact__ic">
                <User size={22} />
              </span>
              <span className="hact__txt">
                <small>Hello, sign in</small>
                <b>Account</b>
              </span>
            </Link>
            <Link href="/wishlist" className="hact__item hact__item--wish" aria-label="Wishlist">
              <span className="hact__ic">
                <Heart size={22} />
                {wishlist.length > 0 && <b className="dot">{wishlist.length}</b>}
              </span>
            </Link>
            <button className="hact__item hact__item--cart" onClick={() => setDrawerOpen(true)} aria-label="Open cart">
              <span className="hact__ic hact__ic--cart">
                <Cart size={22} />
                {count > 0 && (
                  <b className="dot dot--brand" key={count}>
                    {count}
                  </b>
                )}
              </span>
              <span className="hact__txt">
                <small>My cart</small>
                <b>{taka(subtotal)}</b>
              </span>
            </button>
          </nav>
        </div>
      </div>

      <nav className="hnav" aria-label="Main">
        <div className="wrap hnav__in">
          <div className="hnav__cats" onMouseEnter={openMega} onMouseLeave={closeMega}>
            <button className="hnav__all" aria-expanded={mega} onClick={() => setMega((m) => !m)}>
              <Grid size={18} /> All categories <ChevronDown size={16} />
            </button>
          </div>
          <ul className="hnav__links">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={pathname === n.href ? "is-on" : ""}>
                  {n.label}
                  {n.hot && <span className="hnav__hot">Hot</span>}
                </Link>
              </li>
            ))}
          </ul>
          <p className="hnav__cod">
            <span aria-hidden>৳</span> Cash on delivery
          </p>
        </div>
        <div onMouseEnter={openMega} onMouseLeave={closeMega}>
          <MegaMenu meta={meta} open={mega} onClose={() => setMega(false)} />
        </div>
      </nav>

      <div className="sheet" data-open={menu} aria-hidden={!menu}>
        <div className="sheet__scrim" onClick={() => setMenu(false)} />
        <div className="sheet__panel sheet__panel--left" role="dialog" aria-label="Menu">
          <div className="sheet__head">
            <Logo />
            <button className="iconbtn" aria-label="Close menu" onClick={() => setMenu(false)}>
              <X />
            </button>
          </div>
          <ul className="mnav">
            {CATEGORIES.map((c) => {
              const m = meta.find((x) => x.slug === c.slug);
              return (
                <li key={c.slug}>
                  <Link href={`/category/${c.slug}`} tabIndex={menu ? 0 : -1}>
                    <span className="mnav__ic" style={{ background: c.tint, color: c.accent }}>
                      <CategoryIcon name={c.icon} size={20} />
                    </span>
                    <span className="mnav__t">
                      {c.name}
                      {m && <small>{m.count} products</small>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mnav__foot">
            <Link href="/account" tabIndex={menu ? 0 : -1}>Sign in / Register</Link>
            <Link href="/track-order" tabIndex={menu ? 0 : -1}>Track your order</Link>
            <a href={`tel:${PHONE_INTL}`} tabIndex={menu ? 0 : -1}>Call {PHONE}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
