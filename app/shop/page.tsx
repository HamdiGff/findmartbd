import type { Metadata } from "next";
import { Listing } from "@/components/Listing";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = { title: "Shop all products", alternates: { canonical: "/shop" } };
export const revalidate = 3600;

export default async function Shop({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  return (
    <Listing
      basePath="/shop"
      title="All products"
      subtitle="Every gadget in stock, with cash on delivery across Bangladesh."
      products={await getAllProducts()}
      params={params}
      crumbs={[{ label: "Shop" }]}
    />
  );
}
