import type { Metadata } from "next";
import Link from "next/link";
import { User } from "@/components/Icons";

export const metadata: Metadata = { title: "Account" };

export default function Account() {
  return (
    <div className="wrap">
      <div className="login">
        <div className="panel" style={{ textAlign: "center" }}>
          <span className="empty__ic" style={{ margin: "0 auto 14px" }}>
            <User size={28} />
          </span>
          <h1 style={{ fontSize: 24 }}>Customer accounts are coming soon</h1>
          <p style={{ color: "var(--muted)", margin: "10px 0 20px" }}>
            Soon you can sign in with email and password or with Google to see all your orders. Until then, you can
            order without an account and track any order with its number.
          </p>
          <Link href="/track-order" className="btn btn--brand btn--lg btn--block">Track an order</Link>
        </div>
      </div>
    </div>
  );
}
