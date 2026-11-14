"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { Cart, Heart, Share } from "./Icons";
import { isNew, taka } from "@/lib/format";
import type { CardProduct } from "@/lib/catalog";

export function ProductCard({ p, priority = false }: { p: CardProduct; priority?: boolean }) {
  const { add, wishlist, toggleWish, notify } = useCart();
  const saved = wishlist.includes(p.slug);
  const url = `/product/${p.slug}`;
  const low = p.stock > 0 && p.stock <= 5;

  async function share() {
    const full = `${location.origin}${url}`;
    try {
      if (navigator.share) await navigator.share({ title: p.name, url: full });
      else {
        await navigator.clipboard.writeText(full);
        notify("Link copied");
      }
    } catch {}
  }

  return (
    <article className="pcard">
      <Link href={url} className="pcard__media" prefetch={false}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.name} loading={priority ? "eager" : "lazy"} width={400} height={400} />
        {p.hover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pcard__alt" src={p.hover} alt="" loading="lazy" width={400} height={400} />
        )}
        {isNew(p.createdAt) && <span className="pcard__badge">New</span>}
      </Link>
      <div className="pcard__tools">
        <button
          type="button"
          className="pcard__tool"
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={() => toggleWish(p.slug)}
        >
          <Heart size={17} filled={saved} />
        </button>
        <button type="button" className="pcard__tool" aria-label="Share" onClick={share}>
          <Share size={16} />
        </button>
      </div>
      <div className="pcard__body">
        <div className="pcard__meta">
          <span className="pcard__brand">{p.brand || "FindMart"}</span>
          {p.stock > 0 ? (
            <span className={`stock${low ? " stock--low" : ""}`}>{low ? `Only ${p.stock} left` : "In stock"}</span>
          ) : (
            <span className="stock stock--out">Out of stock</span>
          )}
        </div>
        <Link href={url} className="pcard__name" prefetch={false}>
          {p.name}
        </Link>
        <div className="pcard__price">{taka(p.price)}</div>
        <button
          type="button"
          className="btn btn--brand btn--block pcard__add"
          disabled={p.stock < 1}
          onClick={() => add({ slug: p.slug, name: p.name, price: p.price, image: p.image })}
        >
          <Cart size={17} /> Add to cart
        </button>
      </div>
    </article>
  );
}
