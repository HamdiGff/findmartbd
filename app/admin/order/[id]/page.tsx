import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyButton } from "@/components/CopyButton";
import { OrderItems, OrderTimeline } from "@/components/OrderView";
import { requireAdmin } from "@/lib/admin";
import { STATUSES, getOrder } from "@/lib/orders";
import { taka } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order · Admin", robots: { index: false } };

export default async function AdminOrder({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const { saved } = await searchParams;
  const c = order.customer;
  const dropshopText = [
    `Name: ${c.name}`,
    `Mobile: ${c.phone}`,
    `Address: ${c.address}${c.area ? ", " + c.area : ""}, ${c.district}`,
    `Items:`,
    ...order.items.map((i) => `- ${i.name} (SKU ${i.sku}) x ${i.qty} @ ${taka(i.price)}`),
    `Collect on delivery: ${taka(order.total)}`,
    c.note ? `Note: ${c.note}` : "",
    `Ref: ${order.id}`,
  ].filter(Boolean).join("\n");

  return (
    <div className="wrap admin">
      <div className="admin__bar">
        <div>
          <Link href="/admin" className="seeall">← All orders</Link>
          <h1 className="page-title" style={{ margin: "6px 0 0" }}>{order.id}</h1>
        </div>
        <a href={`tel:${c.phone}`} className="btn btn--dark btn--lg">Call {c.phone}</a>
      </div>
      {saved && <p className="alert" style={{ background: "#dcfce7", color: "#166534" }}>Saved.</p>}
      <div className="co">
        <div>
          <section className="panel">
            <h2>Customer</h2>
            <p><b>{c.name}</b> · {c.phone}{c.email ? ` · ${c.email}` : ""}</p>
            <p style={{ marginTop: 6 }}>{c.address}{c.area ? `, ${c.area}` : ""}, {c.district}</p>
            {c.note && <p style={{ marginTop: 6, color: "var(--muted)" }}>Note: {c.note}</p>}
          </section>
          <section className="panel">
            <h2>Place this order on Dropshop</h2>
            <pre className="copybox">{dropshopText}</pre>
            <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
              <CopyButton text={dropshopText} label="Copy for Dropshop" />
              <a className="btn btn--ghost" href="https://dropshop.com.bd/dpanel/orders" target="_blank" rel="noopener">Open Dropshop panel</a>
            </div>
          </section>
          <section className="panel">
            <h2>Items</h2>
            <OrderItems order={order} />
          </section>
        </div>
        <aside>
          <form method="post" action="/api/admin/status" className="panel">
            <h2>Update order</h2>
            <input type="hidden" name="id" value={order.id} />
            <div className="form" style={{ gridTemplateColumns: "1fr" }}>
              <div className="field">
                <label htmlFor="status">Status</label>
                <select id="status" name="status" defaultValue={order.status}>
                  {STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="dropshopRef">Dropshop order number</label>
                <input id="dropshopRef" name="dropshopRef" defaultValue={order.dropshopRef ?? ""} placeholder="ORD-…" />
              </div>
              <div className="field">
                <label htmlFor="adminNote">Private note</label>
                <textarea id="adminNote" name="adminNote" defaultValue={order.adminNote ?? ""} />
              </div>
              <button className="btn btn--dark btn--lg btn--block">Save changes</button>
            </div>
          </form>
          <section className="panel">
            <h2>Timeline</h2>
            <OrderTimeline order={order} />
          </section>
        </aside>
      </div>
    </div>
  );
}
