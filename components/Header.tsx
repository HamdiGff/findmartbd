"use client";

import { useState } from "react";
import { useCart } from "./Cart";
import { Logo } from "./Logo";
import { BagIcon, CloseIcon, HeartIcon, MenuIcon, PhoneIcon, SearchIcon, UserIcon } from "./Icons";
import { SITE, categories, categoryUrl } from "@/lib/catalog";

export function Header() {
  const { count, wishlist } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="wrap topbar__inner">
          <p>Cash on delivery in all 64 districts. Check the parcel, then pay.</p>
          <a href="tel:+8801757756651" className="topbar__phone">
            <PhoneIcon size={15} /> 01757-756651
          </a>
        </div>
      </div>

      <div className="wrap masthead">
        <button className="icon-btn masthead__menu" aria-label="Open categories" onClick={() => setOpen(true)}>
          <MenuIcon />
        </button>
        <a href={SITE + "/"} aria-label="FindMart BD home">
          <Logo />
        </a>

        <form className="search" role="search" action={SITE + "/search/"}>
          <label className="sr-only" htmlFor="search-cat">Category</label>
          <select id="search-cat" name="cat" className="search__cat" defaultValue="">
            <option value="">All products</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor="search-q">Search products</label>
          <input id="search-q" name="q" type="search" placeholder="Search earbuds, watches, power banks…" />
          <button type="submit" className="search__go" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        <nav className="actions" aria-label="Your account">
          <a href={SITE + "/login/"} className="action">
            <UserIcon />
            <span className="action__label">Sign in</span>
          </a>
          <a href={SITE + "/wishlist/"} className="action">
            <HeartIcon />
            <span className="action__label">Wishlist</span>
            {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
          </a>
          <a href={SITE + "/cart/"} className="action">
            <BagIcon />
            <span className="action__label">Cart</span>
            <span className="badge badge--cart" key={count} data-bump={count > 0}>{count}</span>
          </a>
        </nav>
      </div>

      <nav className="catrail" aria-label="Categories">
        <div className="wrap catrail__inner">
          {categories.map((c) => (
            <a key={c.slug} href={categoryUrl(c.slug)}>{c.name}</a>
          ))}
          <a href={SITE + "/shop/"} className="catrail__all">All products</a>
        </div>
      </nav>

      <div className="drawer" data-open={open} aria-hidden={!open}>
        <div className="drawer__scrim" onClick={() => setOpen(false)} />
        <div className="drawer__panel" role="dialog" aria-label="Categories">
          <div className="drawer__head">
            <Logo />
            <button className="icon-btn" aria-label="Close categories" onClick={() => setOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <ul>
            {categories.map((c) => (
              <li key={c.slug}>
                <a href={categoryUrl(c.slug)} tabIndex={open ? 0 : -1}>
                  <span>{c.name}</span>
                  <small>{c.note}</small>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
