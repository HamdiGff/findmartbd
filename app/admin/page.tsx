import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { listOrders, statusLabel } from "@/lib/orders";
import { taka } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders · Admin", robots: { index: false } };

export default async function Admin({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireAdmin();
  const { status } = await searchParams;
  let orders: Awaited<ReturnType<typeof listOrders>> = [];
  let failed = false;
  try {
    orders = await listOrders();
  } catch (e) {
    console.error(e);
    failed = true;
  }
  const today = new Date(Date.now() + 6 * 3600e3).toISOString().slice(0, 10);
  const isToday = (iso: string) => new Date(Date.parse(iso) + 6 * 3600e3).toISOString().slice(0, 10) === today;
  const shown = status ? orders.filter((o) => o.status === status) : orders;
  const live = orders.filter((o) => !["cancelled", "returned"].includes(o.status));
  const filters = ["pending", "confirmed", "sent", "shipped", "delivered", "cancelled"];

  return (
    <div className="wrap admin">
      <div className="admin__bar">
        <h1 className="page-title" style={{ margin: 0 }}>Orders</h1>
        <form method="post" action="/api/admin/login">
          <input type="hidden" name="logout" value="1" />
          <button className="btn btn--ghost">Sign out</button>
        </form>
      </div>
      {failed && <p className="alert">Could not load orders from storage. Refresh in a minute.</p>}
      <div className="stats">
        <div className="stat"><small>Orders today</small><b>{orders.filter((o) => isToday(o.createdAt)).length}</b></div>
        <div className="stat"><small>Waiting for your call</small><b>{orders.filter((o) => o.status === "pending").length}</b></div>
        <div className="stat"><small>Active order value</small><b>{taka(live.reduce((n, o) => n + o.total, 0))}</b></div>
        <div className="stat"><small>All orders</small><b>{orders.length}</b></div>
      </div>
      <div className="toolbar__opts" style={{ marginBottom: 14 }}>
        <Link href="/admin" className={`pill${!status ? " is-on" : ""}`}>All</Link>
        {filters.map((s) => (
          <Link key={s} href={`/admin?status=${s}`} className={`pill${status === s ? " is-on" : ""}`}>{statusLabel(s)}</Link>
        ))}
      </div>
      {shown.length === 0 ? (
        <div className="noresults"><h2>No orders here yet</h2><p>New orders from checkout appear in this list.</p></div>
      ) : (
        <table className="otable">
          <thead>
            <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Placed</th></tr>
          </thead>
          <tbody>
            {shown.map((o) => (
              <tr key={o.id}>
                <td><Link href={`/admin/order/${o.id}`}>{o.id}</Link></td>
                <td>{o.customer.name}<br /><small>{o.customer.phone} · {o.customer.district}</small></td>
                <td>{o.items.reduce((n, i) => n + i.qty, 0)}</td>
                <td><b>{taka(o.total)}</b></td>
                <td><span className={`badge badge--${o.status}`}>{statusLabel(o.status)}</span></td>
                <td><small>{new Date(o.createdAt).toLocaleString("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}</small></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
