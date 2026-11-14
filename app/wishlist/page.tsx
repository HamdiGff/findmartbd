"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { ProductCard } from "@/components/ProductCard";
import { Heart } from "@/components/Icons";
import type { CardProduct } from "@/lib/catalog";

export default function Wishlist() {
  const { wishlist, ready } = useCart();
  const [items, setItems] = useState<CardProduct[] | null>(null);

  useEffect(() => {
    if (!ready) return;
    if (!wishlist.length) return setItems([]);
    fetch(`/api/products?slugs=${wishlist.join(",")}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items))
      .catch(() => setItems([]));
  }, [ready, wishlist]);

  return (
    <div className="wrap">
      <h1 className="page-title">Wishlist</h1>
      {items && items.length === 0 ? (
        <div className="noresults">
          <span className="empty__ic" style={{ margin: "0 auto 14px" }}>
            <Heart size={28} />
          </span>
          <h2>No saved products yet</h2>
          <p>Tap the heart on any product to save it here.</p>
          <Link href="/shop" className="btn btn--dark">Browse products</Link>
        </div>
      ) : (
        <div className="pgrid">{(items ?? []).map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      )}
    </div>
  );
}
