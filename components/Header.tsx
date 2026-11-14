"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { Logo } from "./Logo";
import { Cart, CategoryIcon, Grid, Heart, Menu, Phone, Search, User, X } from "./Icons";
import { CATEGORIES } from "@/lib/categories";
import { PHONE, PHONE_INTL } from "@/lib/format";

const PLACEHOLDERS = ["ANC earbuds", "smart watch", "power bank", "wireless mic", "Wi-Fi router", "MPPT controller"];

function SearchBox() {
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
      className="hsearch"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      }}
    >
      <Search size={19} />
      <label htmlFor="q" className="sr-only">
        Search products
      </label>
      <input
        id="q"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`Search "${PLACEHOLDERS[hint]}"`}
        autoComplete="off"
        enterKeyHint="search"
      />
      <button type="submit" className="hsearch__go">
        Search
      </button>
    </form>
  );
}

export function Header() {
  const { count, wishlist, setDrawerOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const pathname = usePathname();
  useEffect(() => setMenu(false), [pathname]);

  return (
    <header className="header">
      <div className="topline">
        <div className="wrap topline__in">
          <a href={`tel:${PHONE_INTL}`} className="topline__item">
            <Phone size={14} /> {PHONE}
          </a>
          <p className="topline__msg">Cash on delivery across Bangladesh · Open the parcel, then pay</p>
          <Link href="/track-order" className="topline__item">
            Track order
          </Link>
        </div>
      </div>

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
        <nav className="hact" aria-label="Account">
          <Link href="/account" className="hact__item hact__item--account">
            <User size={22} />
            <span>Account</span>
          </Link>
          <Link href="/wishlist" className="hact__item">
            <Heart size={22} />
            <span>Wishlist</span>
            {wishlist.length > 0 && <b className="dot">{wishlist.length}</b>}
          </Link>
          <button className="hact__item" onClick={() => setDrawerOpen(true)}>
            <Cart size={22} />
            <span>Cart</span>
            {count > 0 && (
              <b className="dot dot--brand" key={count}>
                {count}
              </b>
            )}
          </button>
        </nav>
      </div>

      <nav className="catbar" aria-label="Categories">
        <div className="wrap catbar__in">
          <Link href="/shop" className={`catbar__item${pathname === "/shop" ? " is-on" : ""}`}>
            <span className="catbar__ic">
              <Grid size={20} />
            </span>
            All
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={`catbar__item${pathname === `/category/${c.slug}` ? " is-on" : ""}`}
              style={{ ["--tint" as string]: c.tint, ["--acc" as string]: c.accent }}
            >
              <span className="catbar__ic">
                <CategoryIcon name={c.icon} size={20} />
              </span>
              {c.short}
            </Link>
          ))}
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
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} tabIndex={menu ? 0 : -1}>
                  <span className="mnav__ic" style={{ background: c.tint, color: c.accent }}>
                    <CategoryIcon name={c.icon} size={20} />
                  </span>
                  {c.name}
                </Link>
              </li>
            ))}
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
