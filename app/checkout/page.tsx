"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { Bag } from "@/components/Icons";
import { DISTRICTS, deliveryCharge, taka } from "@/lib/format";

type Errors = Record<string, string>;

export default function Checkout() {
  const { items, subtotal, ready, clear } = useCart();
  const router = useRouter();
  const [district, setDistrict] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const delivery = district ? deliveryCharge(district) : 0;

  if (ready && items.length === 0) {
    return (
      <div className="wrap">
        <div className="noresults" style={{ marginTop: 32 }}>
          <span className="empty__ic" style={{ margin: "0 auto 14px" }}>
            <Bag size={30} />
          </span>
          <h2>Your cart is empty</h2>
          <p>Add products to your cart, then come back here to place your order.</p>
          <Link href="/shop" className="btn btn--dark">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    setErrors({});
    const f = new FormData(e.currentTarget);
    const customer = Object.fromEntries(["name", "phone", "email", "district", "area", "address", "note"].map((k) => [k, String(f.get(k) ?? "")]));
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer, items: items.map((i) => ({ slug: i.slug, qty: i.qty })), website: f.get("website") }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors ?? {});
        setMsg(data.error ?? "Something went wrong. Please try again.");
        setBusy(false);
        return;
      }
      clear();
      router.push(`/order/${data.id}?t=${data.token}&new=1`);
    } catch {
      setMsg("No internet connection. Check your connection and try again.");
      setBusy(false);
    }
  }

  const err = (k: string) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-err` } : {});

  return (
    <div className="wrap">
      <h1 className="page-title">Checkout</h1>
      <form className="co" onSubmit={submit} noValidate>
        <div>
          <section className="panel">
            <h2>Delivery details</h2>
            {msg && <p className="alert" role="alert">{msg}</p>}
            <div className="form">
              <div className="field field--full">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" autoComplete="name" required {...err("name")} />
                {errors.name && <span id="name-err" className="field__err">{errors.name}</span>}
              </div>
              <div className="field">
                <label htmlFor="phone">Mobile number</label>
                <input id="phone" name="phone" type="tel" inputMode="numeric" autoComplete="tel" placeholder="01XXXXXXXXX" required {...err("phone")} />
                {errors.phone && <span id="phone-err" className="field__err">{errors.phone}</span>}
              </div>
              <div className="field">
                <label htmlFor="email">
                  Email <small>(optional)</small>
                </label>
                <input id="email" name="email" type="email" autoComplete="email" {...err("email")} />
                {errors.email && <span id="email-err" className="field__err">{errors.email}</span>}
              </div>
              <div className="field">
                <label htmlFor="district">District</label>
                <select id="district" name="district" required value={district} onChange={(e) => setDistrict(e.target.value)} {...err("district")}>
                  <option value="" disabled>
                    Choose your district
                  </option>
                  {DISTRICTS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <span id="district-err" className="field__err">{errors.district}</span>}
              </div>
              <div className="field">
                <label htmlFor="area">
                  Area / Thana <small>(optional)</small>
                </label>
                <input id="area" name="area" autoComplete="address-level3" />
              </div>
              <div className="field field--full">
                <label htmlFor="address">Full address</label>
                <textarea id="address" name="address" autoComplete="street-address" placeholder="House, road, village or area" required {...err("address")} />
                {errors.address && <span id="address-err" className="field__err">{errors.address}</span>}
              </div>
              <div className="field field--full">
                <label htmlFor="note">
                  Order note <small>(optional)</small>
                </label>
                <input id="note" name="note" placeholder="For example, call before delivery" />
              </div>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden />
            </div>
          </section>

          <section className="panel">
            <h2>Payment</h2>
            <div className="pay">
              <label>
                <input type="radio" name="payment" value="cod" defaultChecked />
                <span>
                  Cash on delivery
                  <small>Pay the rider in cash after you check the parcel</small>
                </span>
              </label>
              <label className="is-off">
                <input type="radio" name="payment" value="bkash" disabled />
                <span>
                  bKash / Nagad
                  <small>Coming soon</small>
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="panel summary">
          <h2>Order summary</h2>
          {items.map((i) => (
            <div key={i.slug} className="sline">
              <span className="sline__img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={i.image} alt="" width={56} height={56} />
                <b>{i.qty}</b>
              </span>
              <span className="sline__name">{i.name}</span>
              <b>{taka(i.price * i.qty)}</b>
            </div>
          ))}
          <div className="totals">
            <div>
              <span>Subtotal</span>
              <b>{taka(subtotal)}</b>
            </div>
            <div>
              <span>Delivery {district ? `(${district === "Dhaka" ? "inside Dhaka" : "outside Dhaka"})` : ""}</span>
              <b>{district ? taka(delivery) : "Choose district"}</b>
            </div>
            <div className="grand">
              <span>Total to pay on delivery</span>
              <span>{taka(subtotal + delivery)}</span>
            </div>
          </div>
          <button className="btn btn--brand btn--lg btn--block" disabled={busy || !ready}>
            {busy ? "Placing your order…" : "Place order"}
          </button>
          <p style={{ marginTop: 10, fontSize: 12.5, color: "var(--muted)", textAlign: "center" }}>
            We will call you to confirm before sending the parcel.
          </p>
        </aside>
      </form>
    </div>
  );
}
