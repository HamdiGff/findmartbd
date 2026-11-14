import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/catalog";
import { DISTRICTS, deliveryCharge } from "@/lib/format";
import { newOrderId, newToken, saveOrder, type Order, type OrderItem } from "@/lib/orders";

export const dynamic = "force-dynamic";

type Body = {
  items?: { slug?: string; qty?: number }[];
  customer?: Record<string, string>;
  website?: string; // honeypot
};

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const c = body.customer ?? {};
  const customer = {
    name: clean(c.name, 80),
    phone: clean(c.phone, 20).replace(/[^\d]/g, "").replace(/^880/, "0"),
    district: clean(c.district, 40),
    area: clean(c.area, 80),
    address: clean(c.address, 300),
    note: clean(c.note, 300),
    email: clean(c.email, 120),
  };

  const errors: Record<string, string> = {};
  if (customer.name.length < 2) errors.name = "Enter your full name.";
  if (!/^01[3-9]\d{8}$/.test(customer.phone)) errors.phone = "Enter an 11-digit mobile number, like 017XXXXXXXX.";
  if (!DISTRICTS.includes(customer.district)) errors.district = "Choose your district.";
  if (customer.address.length < 8) errors.address = "Enter your full address with road and house.";
  if (customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)) errors.email = "Check the email address.";
  if (Object.keys(errors).length) return NextResponse.json({ error: "Please fix the highlighted fields.", errors }, { status: 422 });

  const wanted = (body.items ?? []).filter((i) => i.slug && i.qty).slice(0, 30);
  if (!wanted.length) return NextResponse.json({ error: "Your cart is empty." }, { status: 422 });

  // Prices and stock always come from the catalog, never from the browser.
  const catalog = await getAllProducts();
  const items: OrderItem[] = [];
  const problems: string[] = [];
  for (const w of wanted) {
    const p = catalog.find((x) => x.slug === w.slug);
    const qty = Math.max(1, Math.min(10, Math.floor(Number(w.qty))));
    if (!p) {
      problems.push(`${w.slug} is no longer available`);
      continue;
    }
    if (p.stock < qty) {
      problems.push(`${p.name} has only ${p.stock} in stock`);
      continue;
    }
    items.push({ slug: p.slug, name: p.name, image: p.image, price: p.price, qty, sku: p.sku });
  }
  if (problems.length) return NextResponse.json({ error: problems.join(". ") + "." }, { status: 409 });

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const delivery = deliveryCharge(customer.district);
  const now = new Date().toISOString();
  const order: Order = {
    id: newOrderId(),
    token: newToken(),
    createdAt: now,
    status: "pending",
    history: [{ status: "pending", at: now }],
    customer,
    items,
    subtotal,
    delivery,
    total: subtotal + delivery,
    payment: "cod",
  };

  try {
    await saveOrder(order);
  } catch (e) {
    console.error("Order save failed", e);
    return NextResponse.json(
      { error: "We could not save your order. Please try again, or call us to order by phone." },
      { status: 500 },
    );
  }
  return NextResponse.json({ id: order.id, token: order.token });
}
