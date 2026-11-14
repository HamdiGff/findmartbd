import Link from "next/link";
import { Logo } from "./Logo";
import { Cash, Facebook, Instagram, Phone, Pin, Return, Shield, Truck, Whatsapp, Youtube } from "./Icons";
import { CATEGORIES } from "@/lib/categories";
import { PHONE, PHONE_INTL, WHATSAPP } from "@/lib/format";

const perks = [
  { icon: <Cash size={26} />, t: "Cash on delivery", d: "Pay after you check the parcel" },
  { icon: <Truck size={26} />, t: "Delivery in 1–4 days", d: "To all 64 districts" },
  { icon: <Shield size={26} />, t: "7-day warranty", d: "Replacement for faulty items" },
  { icon: <Return size={26} />, t: "Easy returns", d: "Simple return requests" },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="perks">
        <div className="wrap perks__in">
          {perks.map((p) => (
            <div key={p.t} className="perk">
              <span className="perk__ic">{p.icon}</span>
              <div>
                <b>{p.t}</b>
                <span>{p.d}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap footer__grid">
        <div className="footer__about">
          <Logo dark />
          <p>
            Gadgets and everyday tech at fair prices, delivered anywhere in Bangladesh. Open the parcel, check it, then
            pay the rider.
          </p>
          <a href={`tel:${PHONE_INTL}`} className="footer__line">
            <Phone size={17} /> {PHONE}
          </a>
          <p className="footer__line">
            <Pin size={17} /> Munshipara, Gaibandha 5700
          </p>
        </div>
        <div>
          <h3>Categories</h3>
          <ul>
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Help</h3>
          <ul>
            <li><Link href="/track-order">Track your order</Link></li>
            <li><Link href="/page/delivery">Delivery information</Link></li>
            <li><Link href="/page/returns">Returns and refunds</Link></li>
            <li><Link href="/page/warranty">Warranty</Link></li>
            <li><Link href="/page/contact">Contact us</Link></li>
          </ul>
        </div>
        <div>
          <h3>Follow us</h3>
          <div className="footer__social">
            <a href="https://www.facebook.com/" aria-label="Facebook"><Facebook /></a>
            <a href="https://www.instagram.com/" aria-label="Instagram"><Instagram /></a>
            <a href="https://www.youtube.com/" aria-label="YouTube"><Youtube /></a>
            <a href={WHATSAPP} aria-label="WhatsApp"><Whatsapp size={18} /></a>
          </div>
          <h3 className="footer__h3b">We accept</h3>
          <div className="footer__pay">
            <span>Cash on delivery</span>
            <span className="is-soon">bKash · Nagad soon</span>
          </div>
        </div>
      </div>
      <div className="wrap footer__base">
        <p>© 2026 FindMart Bangladesh. All rights reserved.</p>
        <p>
          <Link href="/page/privacy">Privacy</Link> · <Link href="/page/terms">Terms</Link>
        </p>
      </div>
    </footer>
  );
}
