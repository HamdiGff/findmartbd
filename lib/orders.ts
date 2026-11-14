import "server-only";
import { get, list, put } from "@vercel/blob";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

export const STATUSES = [
  { key: "pending", label: "Order placed", note: "We received your order." },
  { key: "confirmed", label: "Confirmed", note: "We called you and confirmed the order." },
  { key: "sent", label: "Processing", note: "Your order is being packed." },
  { key: "shipped", label: "Shipped", note: "Handed to the courier." },
  { key: "delivered", label: "Delivered", note: "Delivered and paid. Thank you!" },
  { key: "cancelled", label: "Cancelled", note: "This order was cancelled." },
  { key: "returned", label: "Returned", note: "This order was returned." },
] as const;
export type StatusKey = (typeof STATUSES)[number]["key"];
export const statusLabel = (k: string) => STATUSES.find((s) => s.key === k)?.label ?? k;

export type OrderItem = { slug: string; name: string; image: string; price: number; qty: number; sku: string };
export type Order = {
  id: string;
  token: string;
  createdAt: string;
  status: StatusKey;
  history: { status: StatusKey; at: string; note?: string }[];
  customer: { name: string; phone: string; district: string; area: string; address: string; note: string; email?: string };
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  total: number;
  payment: "cod";
  dropshopRef?: string;
  adminNote?: string;
};

const path = (id: string) => `orders/${id}.json`;

export function newOrderId() {
  const d = new Date(Date.now() + 6 * 3600 * 1000); // Bangladesh time
  const ymd = d.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `FM${ymd}${rand}`;
}
export const newToken = () => randomBytes(12).toString("hex");

export async function saveOrder(o: Order) {
  await put(path(o.id), JSON.stringify(o), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function getOrder(id: string): Promise<Order | null> {
  if (!/^FM\d{10}$/.test(id)) return null;
  try {
    const res = await get(path(id), { access: "private", useCache: false });
    if (!res) return null;
    const text = await new Response(res.stream).text();
    return JSON.parse(text) as Order;
  } catch {
    return null;
  }
}

export async function listOrders(limit = 200): Promise<Order[]> {
  const { blobs } = await list({ prefix: "orders/", limit: 1000 });
  const latest = blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)).slice(0, limit);
  const orders = await Promise.all(latest.map((b) => getOrder(b.pathname.replace(/^orders\/|\.json$/g, ""))));
  return (orders.filter(Boolean) as Order[]).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// ---------- admin session ----------
export const ADMIN_COOKIE = "fm_admin";
const secret = () => process.env.ADMIN_SESSION_SECRET || "";

export function adminToken() {
  return createHmac("sha256", secret()).update("findmart-admin-v1").digest("hex");
}
export function isAdminToken(v: string | undefined) {
  if (!v || !secret()) return false;
  const a = Buffer.from(v);
  const b = Buffer.from(adminToken());
  return a.length === b.length && timingSafeEqual(a, b);
}
export function checkPassword(pw: string) {
  const real = process.env.ADMIN_PASSWORD || "";
  if (!real) return false;
  const a = Buffer.from(pw);
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}
