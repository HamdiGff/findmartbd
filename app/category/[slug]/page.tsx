import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Listing } from "@/components/Listing";
import { CATEGORIES, categoryBySlug } from "@/lib/categories";
import { getByCategory } from "@/lib/catalog";

export const revalidate = 3600;
export const generateStaticParams = () => CATEGORIES.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = categoryBySlug((await params).slug);
  if (!c) return {};
  return {
    title: `${c.name} price in Bangladesh`,
    description: `Buy ${c.name.toLowerCase()} online in Bangladesh: ${c.blurb.toLowerCase()}. Cash on delivery in all 64 districts.`,
    alternates: { canonical: `/category/${c.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const c = categoryBySlug((await params).slug);
  if (!c) notFound();
  return (
    <Listing
      basePath={`/category/${c.slug}`}
      title={c.name}
      subtitle={c.blurb}
      icon={c.icon}
      tint={c.tint}
      accent={c.accent}
      products={await getByCategory(c.slug)}
      params={await searchParams}
      crumbs={[{ href: "/shop", label: "Shop" }, { label: c.name }]}
    />
  );
}
