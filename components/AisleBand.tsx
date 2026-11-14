"use client";

import Link from "next/link";
import { useRef } from "react";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "./Icons";
import { taka } from "@/lib/format";
import type { CardProduct } from "@/lib/catalog";

export type Aisle = { slug: string; name: string; blurb: string; tint: string; accent: string };

/** One aisle of the store: a colour panel with big type and the products sitting on it. */
export function AisleBand({ aisle, count, from, products }: { aisle: Aisle; count: number; from: number; products: CardProduct[] }) {
  const track = useRef<HTMLDivElement>(null);
  const go = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: "smooth" });
  if (!products.length) return null;
  return (
    <section className="band" style={{ ["--tint" as string]: aisle.tint, ["--deep" as string]: aisle.accent }} aria-label={aisle.name}>
      <div className="band__head">
        <h2 className="disp band__name">{aisle.name}</h2>
        <p className="band__blurb">{aisle.blurb}</p>
        <p className="band__meta">
          {count} products, from {taka(from)}
        </p>
        <div className="band__tools">
          <Link href={`/category/${aisle.slug}`} className="btn btn--dark">
            Walk this aisle
          </Link>
          <button className="circle" aria-label={`Scroll ${aisle.name} left`} onClick={() => go(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button className="circle" aria-label={`Scroll ${aisle.name} right`} onClick={() => go(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="band__strip strip" ref={track}>
        {products.map((p) => (
          <ProductCard key={p.slug} p={p} float />
        ))}
      </div>
    </section>
  );
}
