"use client";

import { useCart } from "./Cart";
import { HeartIcon } from "./Icons";
import { Product, productUrl, taka } from "@/lib/catalog";

export function PriceTag({ price, size = "md" }: { price: number; size?: "md" | "lg" }) {
  return (
    <span className={`tag tag--${size}`}>
      <span className="tag__hole" aria-hidden />
      {taka(price)}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { add, wishlist, toggleWish } = useCart();
  const saved = wishlist.includes(product.slug);
  return (
    <article className="card">
      <a className="card__media" href={productUrl(product.slug)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={product.image} alt={product.name} loading="lazy" width={400} height={400} />
        {product.isNew && <span className="card__new">New</span>}
      </a>
      <button
        type="button"
        className="card__wish"
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
        onClick={() => toggleWish(product.slug)}
      >
        <HeartIcon size={18} filled={saved} />
      </button>
      <div className="card__body">
        <span className="card__brand">{product.brand}</span>
        <a className="card__name" href={productUrl(product.slug)}>
          {product.name}
        </a>
        <div className="card__foot">
          <PriceTag price={product.price} />
          <button type="button" className="card__add" onClick={() => add(product.name)}>
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
