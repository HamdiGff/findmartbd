"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { ArrowUp, Cart, Whatsapp } from "./Icons";
import { WHATSAPP } from "@/lib/format";

export function Floating() {
  const { count, setDrawerOpen } = useCart();
  const [top, setTop] = useState(false);
  useEffect(() => {
    const on = () => setTop(window.scrollY > 900);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <>
      <div className="fab fab--left">
        <button className="fab__btn fab__btn--dark" aria-label="Open cart" onClick={() => setDrawerOpen(true)}>
          <Cart size={20} />
          {count > 0 && <b className="dot dot--brand">{count}</b>}
        </button>
        <a className="fab__btn fab__btn--wa" href={WHATSAPP} aria-label="Chat on WhatsApp">
          <Whatsapp size={24} />
        </a>
      </div>
      <button
        className="fab__btn fab__btn--brand fab--right"
        data-show={top}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={20} />
      </button>
    </>
  );
}
