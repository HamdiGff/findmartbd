import { STATUSES, type Order } from "@/lib/orders";
import { taka } from "@/lib/format";

const FLOW = ["pending", "confirmed", "sent", "shipped", "delivered"] as const;

export function OrderTimeline({ order }: { order: Order }) {
  const stopped = order.status === "cancelled" || order.status === "returned";
  const reached = FLOW.indexOf(order.status as (typeof FLOW)[number]);
  const when = (k: string) => order.history.find((h) => h.status === k)?.at;
  const fmt = (iso?: string) =>
    iso ? new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Dhaka", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }) : "";

  const steps = stopped
    ? [STATUSES[0], STATUSES.find((s) => s.key === order.status)!]
    : FLOW.map((k) => STATUSES.find((s) => s.key === k)!);

  return (
    <ol className="timeline">
      {steps.map((s, i) => {
        const done = stopped ? true : i <= reached;
        return (
          <li key={s.key} className={done ? "is-done" : ""}>
            <b>{s.label}</b>
            {done ? `${s.note} ${fmt(when(s.key))}` : "Waiting"}
          </li>
        );
      })}
    </ol>
  );
}

export function OrderItems({ order }: { order: Order }) {
  return (
    <>
      {order.items.map((i) => (
        <div key={i.slug} className="sline">
          <span className="sline__img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={i.image} alt="" width={56} height={56} />
            <b>{i.qty}</b>
          </span>
          <span className="sline__name">{i.name}</span>
          <b>{taka(i.price * i.qty)}</b>
        </div>
      ))}
      <div className="totals">
        <div>
          <span>Subtotal</span>
          <b>{taka(order.subtotal)}</b>
        </div>
        <div>
          <span>Delivery</span>
          <b>{taka(order.delivery)}</b>
        </div>
        <div className="grand">
          <span>Cash on delivery</span>
          <span>{taka(order.total)}</span>
        </div>
      </div>
    </>
  );
}
