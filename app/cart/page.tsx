"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { QtyStepper } from "@/components/CartDrawer";
import { Bag, Trash } from "@/components/Icons";
import { DELIVERY, taka } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, remove, ready } = useCart();
  return (
    <div className="wrap cartpage">
      <h1 className="page-title">Shopping cart</h1>
      {ready && items.length === 0 ? (
        <div className="noresults">
          <span className="empty__ic" style={{ margin: "0 auto 14px" }}>
            <Bag size={30} />
          </span>
          <h2>Your cart is empty</h2>
          <p>Browse the catalog and add something you like.</p>
          <Link href="/shop" className="btn btn--dark">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="co">
          <section className="panel">
            <ul>
              {items.map((i) => (
                <li key={i.slug} className="citem">
                  <Link href={`/product/${i.slug}`} className="citem__img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={i.image} alt="" width={96} height={96} />
                  </Link>
                  <div>
                    <Link href={`/product/${i.slug}`} className="citem__name">
                      {i.name}
                    </Link>
                    <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>{taka(i.price)} each</p>
                    <div className="citem__row">
                      <QtyStepper slug={i.slug} qty={i.qty} />
                      <b>{taka(i.price * i.qty)}</b>
                    </div>
                  </div>
                  <button className="citem__rm" aria-label={`Remove ${i.name}`} onClick={() => remove(i.slug)}>
                    <Trash size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <aside className="panel summary">
            <h2>Summary</h2>
            <div className="totals">
              <div>
                <span>Subtotal</span>
                <b>{taka(subtotal)}</b>
              </div>
              <div>
                <span>Delivery</span>
                <span>
                  {taka(DELIVERY.insideDhaka)} Dhaka · {taka(DELIVERY.outsideDhaka)} outside
                </span>
              </div>
            </div>
            <Link href="/checkout" className="btn btn--brand btn--lg btn--block">
              Proceed to checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
