import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap">
      <div className="noresults" style={{ marginTop: 32 }}>
        <h2>We could not find that page</h2>
        <p>The product may have sold out or the link may be wrong.</p>
        <Link href="/shop" className="btn btn--dark">Browse all products</Link>
      </div>
    </div>
  );
}
