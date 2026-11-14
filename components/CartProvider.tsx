"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type CartItem = { slug: string; name: string; price: number; image: string; qty: number };
type AddInput = Omit<CartItem, "qty">;

type Ctx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  ready: boolean;
  add: (p: AddInput, qty?: number, openDrawer?: boolean) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  notify: (msg: string) => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "fm-cart-v2";
const WKEY = "fm-wish-v2";

function load<T>(k: string, d: T): T {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : d;
  } catch {
    return d;
  }
}
function save(k: string, v: unknown) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [wishlist, setWish] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setItems(load(KEY, []));
    setWish(load(WKEY, []));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) save(KEY, items);
  }, [items, ready]);
  useEffect(() => {
    if (ready) save(WKEY, wishlist);
  }, [wishlist, ready]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const add = useCallback(
    (p: AddInput, qty = 1, openDrawer = true) => {
      setItems((cur) => {
        const found = cur.find((i) => i.slug === p.slug);
        if (found) return cur.map((i) => (i.slug === p.slug ? { ...i, qty: Math.min(10, i.qty + qty) } : i));
        return [...cur, { ...p, qty }];
      });
      if (openDrawer) setDrawerOpen(true);
      else notify("Added to cart");
    },
    [notify],
  );
  const setQty = useCallback((slug: string, qty: number) => {
    setItems((cur) => cur.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(10, qty)) } : i)));
  }, []);
  const remove = useCallback((slug: string) => setItems((cur) => cur.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);
  const toggleWish = useCallback(
    (slug: string) => {
      setWish((w) => {
        const has = w.includes(slug);
        notify(has ? "Removed from wishlist" : "Saved to wishlist");
        return has ? w.filter((s) => s !== slug) : [...w, slug];
      });
    },
    [notify],
  );

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((n, i) => n + i.qty * i.price, 0),
      ready,
      add,
      setQty,
      remove,
      clear,
      wishlist,
      toggleWish,
      drawerOpen,
      setDrawerOpen,
      notify,
    }),
    [items, ready, add, setQty, remove, clear, wishlist, toggleWish, drawerOpen, notify],
  );

  return (
    <CartCtx.Provider value={value}>
      {children}
      <div className="toast" role="status" aria-live="polite" data-show={toast ? "true" : "false"}>
        {toast}
      </div>
    </CartCtx.Provider>
  );
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}
