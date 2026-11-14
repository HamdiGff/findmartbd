"use client";

import Link from "next/link";
import { useRef } from "react";
import { ProductCard } from "./ProductCard";
import { ChevronLeft, ChevronRight } from "./Icons";
import type { CardProduct } from "@/lib/catalog";

export function ProductRow({ title, href, products, linkText = "See all" }: { title: string; href: string; products: CardProduct[]; linkText?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const go = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.9, behavior: "smooth" });
  if (!products.length) return null;
  return (
    <section className="sec">
      <div className="wrap">
        <div className="sec__head">
          <h2 className="disp sec__t">{title}</h2>
          <div className="sec__tools">
            <Link href={href} className="sec__link">
              {linkText}
            </Link>
            <button className="circle" aria-label={`Scroll ${title} left`} onClick={() => go(-1)}>
              <ChevronLeft size={18} />
            </button>
            <button className="circle" aria-label={`Scroll ${title} right`} onClick={() => go(1)}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
        <div className="strip" ref={track}>
          {products.map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
