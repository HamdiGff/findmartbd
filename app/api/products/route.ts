import { NextResponse } from "next/server";
import { getAllProducts, toCard } from "@/lib/catalog";

export async function GET(req: Request) {
  const slugs = (new URL(req.url).searchParams.get("slugs") ?? "").split(",").filter(Boolean).slice(0, 60);
  const all = await getAllProducts();
  const items = slugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean).map((p) => toCard(p!));
  return NextResponse.json({ items });
}
