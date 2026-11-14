"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { Bag, Minus, Plus, Trash, Truck, X } from "./Icons";
import { taka } from "@/lib/format";

export function QtyStepper({ slug, qty }: { slug: string; qty: number }) {
  const { setQty } = useCart();
  return (
    <div className="qty" role="group" aria-label="Quantity">
      <button type="button" aria-label="Decrease quantity" onClick={() => setQty(slug, qty - 1)} disabled={qty <= 1}>
        <Minus size={15} />
      </button>
      <span aria-live="polite">{qty}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => setQty(slug, qty + 1)} disabled={qty >= 10}>
        <Plus size={15} />
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { items, subtotal, drawerOpen, setDrawerOpen, remove } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDrawerOpen]);

  return (
    <div className="sheet" data-open={drawerOpen} aria-hidden={!drawerOpen}>
      <div className="sheet__scrim" onClick={() => setDrawerOpen(false)} />
      <aside className="sheet__panel sheet__panel--right cartd" role="dialog" aria-label="Your cart">
        <div className="sheet__head">
          <h2>Your cart</h2>
          <button className="iconbtn" aria-label="Close cart" onClick={() => setDrawerOpen(false)}>
            <X />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="empty">
            <span className="empty__ic">
              <Bag size={30} />
            </span>
            <p>Your cart is empty. Browse the catalog and add something you like.</p>
            <Link href="/shop" className="btn btn--dark" onClick={() => setDrawerOpen(false)}>
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <ul className="cartd__list">
              {items.map((i) => (
                <li key={i.slug} className="citem">
                  <Link href={`/product/${i.slug}`} className="citem__img" onClick={() => setDrawerOpen(false)}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.image} alt="" width={80} height={80} />
                  </Link>
                  <div className="citem__body">
                    <Link href={`/product/${i.slug}`} className="citem__name" onClick={() => setDrawerOpen(false)}>
                      {i.name}
                    </Link>
                    <div className="citem__row">
                      <QtyStepper slug={i.slug} qty={i.qty} />
                      <b>{taka(i.price * i.qty)}</b>
                    </div>
                  </div>
                  <button className="citem__rm" aria-label={`Remove ${i.name}`} onClick={() => remove(i.slug)}>
                    <Trash size={17} />
                  </button>
                </li>
              ))}
            </ul>
            <div className="cartd__foot">
              <p className="cartd__note">
                <Truck size={17} /> Delivery charge is added at checkout
              </p>
              <div className="cartd__sum">
                <span>Subtotal</span>
                <b>{taka(subtotal)}</b>
              </div>
              <Link href="/checkout" className="btn btn--brand btn--block btn--lg" onClick={() => setDrawerOpen(false)}>
                Checkout · Cash on delivery
              </Link>
              <Link href="/cart" className="btn btn--ghost btn--block" onClick={() => setDrawerOpen(false)}>
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
