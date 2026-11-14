import type { Metadata } from "next";
import { Listing } from "@/components/Listing";
import { searchProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().slice(0, 80);
  return (
    <Listing
      basePath="/search"
      title={q ? `Results for “${q}”` : "Search"}
      subtitle={q ? undefined : "Type a product name, brand or model in the search bar."}
      products={q ? await searchProducts(q) : []}
      params={{ ...params, q }}
      crumbs={[{ label: "Search" }]}
    />
  );
}
