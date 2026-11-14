import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, STATUSES, getOrder, isAdminToken, saveOrder, type StatusKey } from "@/lib/orders";

export async function POST(req: Request) {
  const jar = await cookies();
  if (!isAdminToken(jar.get(ADMIN_COOKIE)?.value)) return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  const form = await req.formData();
  const id = String(form.get("id") ?? "");
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const status = String(form.get("status") ?? "") as StatusKey;
  if (STATUSES.some((s) => s.key === status) && status !== order.status) {
    order.status = status;
    order.history.push({ status, at: new Date().toISOString() });
  }
  const ref = form.get("dropshopRef");
  if (ref !== null) order.dropshopRef = String(ref).trim().slice(0, 60);
  const note = form.get("adminNote");
  if (note !== null) order.adminNote = String(note).trim().slice(0, 500);
  await saveOrder(order);
  return NextResponse.redirect(new URL(`/admin/order/${id}?saved=1`, req.url), 303);
}
