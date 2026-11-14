"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { Bolt, Cart, Cash, Heart, Minus, Plus, Return, Shield, Truck, Whatsapp } from "./Icons";
import { DELIVERY, taka, WHATSAPP } from "@/lib/format";

type P = { slug: string; name: string; price: number; image: string; stock: number };

export function Gallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<string | null>(null);
  return (
    <div className="gallery">
      <div className="gallery__thumbs">
        {images.map((src, n) => (
          <button
            key={src}
            className="gallery__thumb"
            aria-current={n === i}
            aria-label={`Show photo ${n + 1}`}
            onClick={() => setI(n)}
            onMouseEnter={() => setI(n)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" width={76} height={76} />
          </button>
        ))}
      </div>
      <div
        className="gallery__main"
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          setZoom(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
        }}
        onMouseLeave={() => setZoom(null)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[i]}
          alt={name}
          width={700}
          height={700}
          style={zoom ? { transform: "scale(1.8)", transformOrigin: zoom } : undefined}
        />
      </div>
    </div>
  );
}

export function BuyBox({ p }: { p: P }) {
  const { add, wishlist, toggleWish } = useCart();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const out = p.stock < 1;
  const saved = wishlist.includes(p.slug);
  const item = { slug: p.slug, name: p.name, price: p.price, image: p.image };
  const waText = encodeURIComponent(`Hi FindMart, I want to order: ${p.name} (${taka(p.price)}). Quantity: ${qty}`);

  return (
    <>
      <div className="buy__row">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>
            <Minus size={16} />
          </button>
          <span>{qty}</span>
          <button type="button" aria-label="Increase quantity" disabled={qty >= Math.min(10, p.stock)} onClick={() => setQty(qty + 1)}>
            <Plus size={16} />
          </button>
        </div>
        <button className="btn btn--dark btn--lg" disabled={out} onClick={() => add(item, qty)}>
          <Cart size={18} /> Add to cart
        </button>
        <button
          className="circle"
          style={{ width: 52, height: 52, flex: "none" }}
          aria-pressed={saved}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          onClick={() => toggleWish(p.slug)}
        >
          <Heart size={20} filled={saved} />
        </button>
      </div>
      <button
        className="btn btn--brand btn--lg btn--block buy__now"
        disabled={out}
        onClick={() => {
          add(item, qty, false);
          router.push("/checkout");
        }}
      >
        <Bolt size={18} /> Buy now · Cash on delivery
      </button>
      <a className="btn btn--lg btn--block buy__wa" href={`${WHATSAPP}?text=${waText}`} target="_blank" rel="noopener">
        <Whatsapp size={20} /> Order on WhatsApp
      </a>

      <div className="assure">
        <div>
          <Cash size={22} />
          <span><b>Cash on delivery</b>Check the parcel, then pay</span>
        </div>
        <div>
          <Truck size={22} />
          <span><b>Delivery {taka(DELIVERY.insideDhaka)}–{taka(DELIVERY.outsideDhaka)}</b>Dhaka 1–2 days, others 2–4</span>
        </div>
        <div>
          <Shield size={22} />
          <span><b>7-day warranty</b>Faulty items replaced</span>
        </div>
        <div>
          <Return size={22} />
          <span><b>Easy returns</b>Request within 7 days</span>
        </div>
      </div>

      <div className="mobilebar">
        <button className="btn btn--dark btn--lg" disabled={out} onClick={() => add(item, qty)}>
          Add to cart
        </button>
        <button
          className="btn btn--brand btn--lg"
          disabled={out}
          onClick={() => {
            add(item, qty, false);
            router.push("/checkout");
          }}
        >
          Buy now
        </button>
      </div>
    </>
  );
}
