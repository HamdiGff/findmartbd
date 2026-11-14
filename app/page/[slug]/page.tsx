import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DELIVERY, PHONE, taka } from "@/lib/format";

const PAGES: Record<string, { title: string; body: string[] }> = {
  delivery: {
    title: "Delivery information",
    body: [
      `We deliver to all 64 districts of Bangladesh. Delivery inside Dhaka costs ${taka(DELIVERY.insideDhaka)} and usually takes 1 to 2 days. Delivery outside Dhaka costs ${taka(DELIVERY.outsideDhaka)} and usually takes 2 to 4 days.`,
      "After you place an order, we call you to confirm it. The parcel is sent only after you confirm.",
      "When the courier arrives, open the parcel and check the product, then pay the rider in cash.",
    ],
  },
  returns: {
    title: "Returns and refunds",
    body: [
      "If a product arrives damaged, faulty or different from what you ordered, tell the rider and refuse the parcel, or contact us within 7 days of delivery.",
      "We replace faulty products or refund you after the returned product reaches us and is checked.",
      "Products that were used, damaged by the customer, or returned without their box and accessories cannot be returned.",
    ],
  },
  warranty: {
    title: "Warranty",
    body: [
      "Every product comes with at least a 7-day replacement warranty. Some products carry a longer brand warranty, shown on the product page.",
      `To claim warranty, call ${PHONE} or message us on WhatsApp with your order number and a short video of the problem.`,
    ],
  },
  contact: {
    title: "Contact us",
    body: [
      `Phone and WhatsApp: ${PHONE}, Saturday to Thursday, 10am to 8pm.`,
      "Address: Munshipara, Gaibandha 5700, Bangladesh.",
    ],
  },
  privacy: {
    title: "Privacy policy",
    body: [
      "We collect your name, phone number, address and optional email only to deliver your order and contact you about it.",
      "We share your delivery details only with our fulfilment and courier partners. We never sell your information.",
      "Your cart and wishlist are stored in your own browser.",
    ],
  },
  terms: {
    title: "Terms and conditions",
    body: [
      "Prices and stock can change without notice. The price shown at checkout is the price you pay.",
      "We may cancel an order if a product goes out of stock or the order cannot be confirmed by phone.",
    ],
  },
};

export const generateStaticParams = () => Object.keys(PAGES).map((slug) => ({ slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = PAGES[(await params).slug];
  return p ? { title: p.title } : {};
}

export default async function InfoPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = PAGES[(await params).slug];
  if (!p) notFound();
  return (
    <div className="wrap">
      <article className="doc">
        <h1 className="page-title">{p.title}</h1>
        <div className="panel prose">
          {p.body.map((t, i) => <p key={i}>{t}</p>)}
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Last updated: 15 November 2026</p>
        </div>
      </article>
    </div>
  );
}
