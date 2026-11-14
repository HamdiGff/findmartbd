import "server-only";
import { unstable_cache } from "next/cache";
import { categorize } from "./categories";

// Live catalog from Dropshop's public storefront feed.
// The list is cached for an hour, so the site keeps prices and stock fresh
// without calling Dropshop on every page view.

const FEED = "https://dropshop.com.bd/api/v1/storefront/products";
const ORIGIN = "https://dropshop.com.bd";

export type Product = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  gallery: string[];
  warranty: string;
  createdAt: string;
};

export type ProductDetail = Product & { description: string };

type Raw = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description?: string;
  min_price: number;
  max_price: number;
  suggested_price: number;
  stock: number;
  thumbnail: string;
  gallery: string[] | null;
  warranty_value: number;
  warranty_unit: string;
  status: string;
  created_at: string;
};

/** Selling price rule: Dropshop's suggested price + 15%, ending in 9, kept inside Dropshop's allowed range. */
export function sellingPrice(r: Pick<Raw, "suggested_price" | "min_price" | "max_price">): number {
  const target = Math.ceil((r.suggested_price * 1.15) / 10) * 10 - 1;
  return Math.max(r.min_price, Math.min(r.max_price, target));
}

const KNOWN_BRANDS = [
  "Hoco", "QCY", "Baseus", "Anker", "Joyroom", "Fifine", "Maono", "Titan", "Fastrack", "Xiaomi", "Ugreen", "Kemei",
  "Awei", "Lenovo", "Valdus", "Colmi", "Havit", "Vention", "Mcdodo", "Acefast", "Boya", "Ulanzi", "Jmary", "Geeoo",
  "GearUP", "Lexar", "Remax", "Neepho", "Ruijie", "Cudy", "TP-Link", "Tenda", "Philips", "Inphic", "Jisulife",
  "Momax", "CMF", "Realme", "Haylou", "Kieslect", "Soundpeats", "Edifier", "Lavvi", "Mibro", "Amazfit", "Tomzn",
];

function brandOf(name: string): string {
  const lower = name.toLowerCase();
  for (const b of KNOWN_BRANDS) {
    const re = new RegExp(`(^|[^a-z])${b.toLowerCase().replace("-", "\\-")}([^a-z]|$)`);
    if (re.test(lower)) return b;
  }
  return "";
}

const img = (path: string) => (path?.startsWith("http") ? path : ORIGIN + path);

function toProduct(r: Raw): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name.replace(/\s+/g, " ").trim(),
    sku: r.sku,
    brand: brandOf(r.name),
    category: categorize(r.name),
    price: sellingPrice(r),
    stock: r.stock,
    image: img(r.thumbnail),
    gallery: (r.gallery ?? []).map(img),
    warranty: r.warranty_value ? `${r.warranty_value} ${r.warranty_unit}` : "",
    createdAt: r.created_at,
  };
}

async function fetchPage(page: number, limit: number) {
  const res = await fetch(`${FEED}?page=${page}&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Feed page ${page} failed: ${res.status}`);
  const json = await res.json();
  return json.data as { items: Raw[]; total: number };
}

const cachedCatalog = unstable_cache(
  async (): Promise<Product[]> => {
    // Throws on failure so an empty result is never cached.
    const limit = 100;
    const first = await fetchPage(1, limit);
    const pages = Math.ceil(first.total / limit);
    const rest = await Promise.all(Array.from({ length: pages - 1 }, (_, i) => fetchPage(i + 2, limit)));
    const raw = [first, ...rest].flatMap((p) => p.items);
    const list = raw
      .filter((r) => r.status === "active" && r.thumbnail)
      .map(toProduct)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (!list.length) throw new Error("Empty catalog");
    return list;
  },
  ["catalog-v1"],
  { revalidate: 3600, tags: ["catalog"] },
);

export async function getAllProducts(): Promise<Product[]> {
  try {
    return await cachedCatalog();
  } catch (e) {
    console.error("Catalog fetch failed", e);
    return [];
  }
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const res = await fetch(`${FEED}/${encodeURIComponent(slug)}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    const r = (json.data?.product ?? json.data) as Raw | undefined;
    if (!r || r.status !== "active") return null;
    return { ...toProduct(r), description: cleanHtml(r.description ?? "") };
  } catch {
    return null;
  }
}

/** Strip scripts, styles, inline handlers and iframes from supplier HTML. */
function cleanHtml(html: string): string {
  return html
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|iframe|object|embed)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, "")
    .replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"')
    .replace(/<a\s[^>]*href="https?:\/\/(?:www\.)?(?:dropshop|bdshop)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi, "$1");
}

export async function getByCategory(slug: string) {
  return (await getAllProducts()).filter((p) => p.category === slug);
}

export async function searchProducts(q: string) {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return (await getAllProducts()).filter((p) => {
    const hay = `${p.name} ${p.brand} ${p.sku}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export type SortKey = "new" | "price-asc" | "price-desc";
export function sortProducts(list: Product[], sort: SortKey) {
  const l = [...list];
  if (sort === "price-asc") l.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") l.sort((a, b) => b.price - a.price);
  return l;
}

/** Lightweight shape sent to the browser for product cards. */
export type CardProduct = Pick<Product, "slug" | "name" | "brand" | "price" | "image" | "stock" | "createdAt"> & {
  hover?: string;
  category?: string;
};
export const toCard = (p: Product): CardProduct => ({
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  price: p.price,
  image: p.image,
  stock: p.stock,
  createdAt: p.createdAt,
  hover: p.gallery.find((g) => g !== p.image),
  category: p.category,
});

const strip = (h: string) =>
  h
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

/** Short feature bullets from the first list in the description ("24V DC power: ..." -> "24V DC power"). */
export function extractHighlights(html: string, max = 5): string[] {
  const list = html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i)?.[1] ?? "";
  const items = [...list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => {
    const bold = m[1].match(/<(strong|b)>([\s\S]*?)<\/\1>/i)?.[2];
    const text = strip(bold ?? m[1]).replace(/[:：]\s*$/, "");
    return text.length > 70 ? text.slice(0, 68).replace(/\s\S*$/, "") + "…" : text;
  });
  return items.filter((t) => t.length > 2).slice(0, max);
}

/** Key/value rows from tables in the description, if the supplier included a spec table. */
export function extractSpecs(html: string, max = 14): [string, string][] {
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)]
    .map((m) => [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) => strip(c[1])))
    .filter((c) => c.length === 2 && c[0] && c[1] && c[0].length < 40 && c[1].length < 120) as [string, string][];
  return rows.slice(0, max);
}
