"use client";

import Link from "next/link";
import { useRef } from "react";
import { ProductCard } from "./ProductCard";
import { Arrow, ChevronLeft, ChevronRight } from "./Icons";
import type { CardProduct } from "@/lib/catalog";

export function ProductRow({ title, href, products }: { title: string; href: string; products: CardProduct[] }) {
  const track = useRef<HTMLDivElement>(null);
  const go = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.9, behavior: "smooth" });
  if (!products.length) return null;
  return (
    <section className="block">
      <div className="wrap">
        <div className="block__head">
          <h2>{title}</h2>
          <div className="block__tools">
            <Link href={href} className="seeall">
              See all <Arrow size={16} />
            </Link>
            <button className="circle" aria-label={`Scroll ${title} left`} onClick={() => go(-1)}>
              <ChevronLeft size={18} />
            </button>
            <button className="circle" aria-label={`Scroll ${title} right`} onClick={() => go(1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="rowtrack" ref={track}>
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
