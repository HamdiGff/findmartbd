import type { Metadata } from "next";
import { Listing } from "@/components/Listing";
import { searchProducts } from "@/lib/catalog";
import { categoryBySlug } from "@/lib/categories";

export const metadata: Metadata = { title: "Search", robots: { index: false } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const q = (params.q ?? "").trim().slice(0, 80);
  const cat = categoryBySlug(params.cat ?? "");
  const found = q ? await searchProducts(q) : [];
  const results = cat ? found.filter((p) => p.category === cat.slug) : found;
  return (
    <Listing
      basePath="/search"
      title={q ? `Results for “${q}”${cat ? ` in ${cat.name}` : ""}` : "Search"}
      subtitle={q ? undefined : "Type a product name, brand or model in the search bar."}
      products={results}
      params={{ ...params, q }}
      crumbs={[{ label: "Search" }]}
    />
  );
}
