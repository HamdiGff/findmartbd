"use client";

import { useRef } from "react";
import { ArrowIcon } from "./Icons";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/catalog";

// A horizontally scrolling row of products with previous/next buttons.
export function Shelf({ products, label }: { products: Product[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };
  return (
    <div className="shelf">
      <div className="shelf__nav">
        <button className="round-btn" aria-label={`Previous ${label}`} onClick={() => move(-1)}>
          <ArrowIcon left />
        </button>
        <button className="round-btn" aria-label={`Next ${label}`} onClick={() => move(1)}>
          <ArrowIcon />
        </button>
      </div>
      <div className="shelf__track" ref={ref}>
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}
