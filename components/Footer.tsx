import { Logo } from "./Logo";
import { FacebookIcon, PhoneIcon, WhatsappIcon, YoutubeIcon } from "./Icons";
import { SITE, categories, categoryUrl } from "@/lib/catalog";

const help = [
  ["Track your order", "/track-order/"],
  ["Delivery charges and times", "/delivery/"],
  ["Returns and refunds", "/returns/"],
  ["Warranty claims", "/warranty/"],
  ["FAQ", "/faq/"],
];
const company = [
  ["About FindMart", "/about/"],
  ["Contact us", "/contact/"],
  ["Privacy policy", "/privacy-policy/"],
  ["Terms and conditions", "/terms/"],
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo light />
          <p>
            Gadgets and everyday tech, priced fairly and delivered across Bangladesh. Check your parcel when it
            arrives, then pay.
          </p>
          <a className="footer__phone" href="tel:+8801757756651">
            <PhoneIcon /> 01757-756651
          </a>
          <p className="footer__hours">Saturday to Thursday, 10am to 8pm</p>
          <div className="footer__social">
            <a href="https://www.facebook.com/" aria-label="FindMart on Facebook"><FacebookIcon /></a>
            <a href="https://wa.me/8801757756651" aria-label="Chat on WhatsApp"><WhatsappIcon /></a>
            <a href="https://www.youtube.com/" aria-label="FindMart on YouTube"><YoutubeIcon /></a>
          </div>
        </div>

        <div>
          <h2 className="footer__title">Shop</h2>
          <ul>
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}><a href={categoryUrl(c.slug)}>{c.name}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer__title">Help</h2>
          <ul>
            {help.map(([t, h]) => (
              <li key={h}><a href={SITE + h}>{t}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="footer__title">Company</h2>
          <ul>
            {company.map(([t, h]) => (
              <li key={h}><a href={SITE + h}>{t}</a></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="wrap footer__base">
        <p>© 2026 FindMart BD. Gaibandha, Bangladesh.</p>
        <div className="footer__pay" aria-label="Payment methods">
          <span>Cash on delivery</span>
          <span className="footer__soon">bKash and Nagad coming soon</span>
        </div>
      </div>
    </footer>
  );
}
