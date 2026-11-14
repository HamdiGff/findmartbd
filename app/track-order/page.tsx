import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getOrder } from "@/lib/orders";

export const metadata: Metadata = { title: "Track your order" };
export const dynamic = "force-dynamic";

async function track(formData: FormData) {
  "use server";
  const id = String(formData.get("id") ?? "").trim().toUpperCase();
  const phone = String(formData.get("phone") ?? "").replace(/\D/g, "").replace(/^880/, "0");
  const order = await getOrder(id);
  if (!order || order.customer.phone !== phone) redirect("/track-order?error=1");
  redirect(`/order/${order.id}?t=${order.token}`);
}

export default async function Track({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="wrap">
      <div className="login">
        <h1 className="page-title">Track your order</h1>
        <form action={track} className="panel">
          {error && (
            <p className="alert" role="alert">
              We could not find an order with that number and phone. Check both and try again.
            </p>
          )}
          <div className="form" style={{ gridTemplateColumns: "1fr" }}>
            <div className="field">
              <label htmlFor="id">Order number</label>
              <input id="id" name="id" placeholder="FM2611151234" required />
            </div>
            <div className="field">
              <label htmlFor="phone">Mobile number used for the order</label>
              <input id="phone" name="phone" type="tel" inputMode="numeric" placeholder="01XXXXXXXXX" required />
            </div>
            <button className="btn btn--brand btn--lg btn--block">Track order</button>
          </div>
        </form>
      </div>
    </div>
  );
}
