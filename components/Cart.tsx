"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Front-end only cart for the design preview. It remembers items in this browser.
type CartState = {
  count: number;
  wishlist: string[];
  add: (name: string) => void;
  toggleWish: (slug: string) => void;
  toast: string | null;
};

const Ctx = createContext<CartState | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCount(read("fm-cart", 0));
    setWishlist(read("fm-wish", []));
  }, []);

  const add = useCallback((name: string) => {
    setCount((c) => {
      write("fm-cart", c + 1);
      return c + 1;
    });
    setToast(`Added to cart: ${name}`);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const toggleWish = useCallback((slug: string) => {
    setWishlist((w) => {
      const next = w.includes(slug) ? w.filter((s) => s !== slug) : [...w, slug];
      write("fm-wish", next);
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ count, wishlist, add, toggleWish, toast }}>
      {children}
      <div className="toast" role="status" aria-live="polite" data-show={toast ? "true" : "false"}>
        {toast}
      </div>
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
