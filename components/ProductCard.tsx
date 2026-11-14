"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { Heart, Plus } from "./Icons";
import { categoryBySlug } from "@/lib/categories";
import { isNew, taka } from "@/lib/format";
import type { CardProduct } from "@/lib/catalog";

export function ProductCard({ p, priority = false, float = false }: { p: CardProduct; priority?: boolean; float?: boolean }) {
  const { add, wishlist, toggleWish } = useCart();
  const saved = wishlist.includes(p.slug);
  const url = `/product/${p.slug}`;
  const out = p.stock < 1;
  const low = p.stock > 0 && p.stock <= 5;
  const tint = categoryBySlug(p.category ?? "")?.tint ?? "#E9EEEB";
  const badge = out ? "Sold out" : low ? `Only ${p.stock} left` : isNew(p.createdAt) ? "New" : "";

  return (
    <article className={`pc${float ? " pc--float" : ""}${out ? " pc--out" : ""}`} style={{ ["--tint" as string]: tint }}>
      <div className="pc__media">
        <Link href={url} prefetch={false} className="pc__link" aria-label={p.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt="" loading={priority ? "eager" : "lazy"} width={400} height={400} />
          {p.hover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pc__alt" src={p.hover} alt="" loading="lazy" width={400} height={400} />
          )}
        </Link>
        {badge && <span className={`pc__badge${out || low ? " pc__badge--warn" : ""}`}>{badge}</span>}
        <button
          type="button"
          className="pc__heart"
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={() => toggleWish(p.slug)}
        >
          <Heart size={18} filled={saved} />
        </button>
        {!out && (
          <button
            type="button"
            className="pc__add"
            aria-label={`Add ${p.name} to cart`}
            onClick={() => add({ slug: p.slug, name: p.name, price: p.price, image: p.image })}
          >
            <Plus size={22} />
          </button>
        )}
      </div>
      <Link href={url} className="pc__name" prefetch={false}>
        {p.name}
      </Link>
      <p className="pc__row">
        <b className="pc__price">{taka(p.price)}</b>
        {p.brand && <span className="pc__brand">{p.brand}</span>}
      </p>
    </article>
  );
}
