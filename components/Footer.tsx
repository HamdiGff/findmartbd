import Link from "next/link";
import { LogoMark } from "./Logo";
import { Facebook, Instagram, Phone, Pin, Whatsapp, Youtube } from "./Icons";
import { CATEGORIES } from "@/lib/categories";
import { PHONE, PHONE_INTL, WHATSAPP } from "@/lib/format";

export function Footer() {
  return (
    <footer className="ft">
      <div className="wrap ft__grid">
        <div className="ft__about">
          <p className="disp ft__lead">Gadgets you can check before you pay.</p>
          <a href={`tel:${PHONE_INTL}`} className="ft__line">
            <Phone size={18} /> {PHONE}
          </a>
          <a href={WHATSAPP} className="ft__line" target="_blank" rel="noopener">
            <Whatsapp size={18} /> WhatsApp us
          </a>
          <p className="ft__line">
            <Pin size={18} /> Munshipara, Gaibandha 5700
          </p>
        </div>
        <div>
          <h3>Aisles</h3>
          <ul>
            {CATEGORIES.slice(0, 7).map((c) => (
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
          <h3>Follow</h3>
          <div className="ft__social">
            <a href="https://www.facebook.com/" aria-label="Facebook"><Facebook /></a>
            <a href="https://www.instagram.com/" aria-label="Instagram"><Instagram /></a>
            <a href="https://www.youtube.com/" aria-label="YouTube"><Youtube /></a>
          </div>
          <h3 className="ft__h3b">Payment</h3>
          <p className="ft__pay">Cash on delivery. bKash and Nagad are coming soon.</p>
        </div>
      </div>
      <div className="ft__mark" aria-hidden>
        <LogoMark size={120} />
        <span className="disp">FindMart</span>
      </div>
      <div className="wrap ft__base">
        <p>© 2026 FindMart BD. All rights reserved.</p>
        <p>
          <Link href="/page/privacy">Privacy</Link>
          <Link href="/page/terms">Terms</Link>
        </p>
      </div>
    </footer>
  );
}
