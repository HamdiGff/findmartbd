import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "@/components/Icons";
import { OrderItems, OrderTimeline } from "@/components/OrderView";
import { getOrder, statusLabel } from "@/lib/orders";
import { PHONE, PHONE_INTL } from "@/lib/format";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your order", robots: { index: false } };

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ t?: string; new?: string }>;
}) {
  const { id } = await params;
  const { t, new: isNew } = await searchParams;
  const order = await getOrder(id);
  if (!order || order.token !== t) notFound();

  return (
    <div className="wrap">
      <div className="done">
        {isNew && (
          <span className="done__ic">
            <Check size={40} />
          </span>
        )}
        <h1>{isNew ? `Thank you, ${order.customer.name.split(" ")[0]}!` : `Order ${order.id}`}</h1>
        <p>
          {isNew
            ? "Your order is placed. We will call you on " + order.customer.phone + " within a few hours to confirm it."
            : `Status: ${statusLabel(order.status)}`}
        </p>
        <span className="done__no">{order.id}</span>
        <p style={{ fontSize: 13, marginTop: 8 }}>Save this order number to track your parcel.</p>

        <section className="panel">
          <h2>Order status</h2>
          <OrderTimeline order={order} />
        </section>
        <section className="panel">
          <h2>Items</h2>
          <OrderItems order={order} />
          <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
            Deliver to: {order.customer.address}
            {order.customer.area ? `, ${order.customer.area}` : ""}, {order.customer.district}
          </p>
        </section>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
          <Link href="/shop" className="btn btn--dark btn--lg">
            Continue shopping
          </Link>
          <a href={`tel:${PHONE_INTL}`} className="btn btn--ghost btn--lg">
            Call {PHONE}
          </a>
        </div>
      </div>
    </div>
  );
}
