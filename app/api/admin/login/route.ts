import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, checkPassword } from "@/lib/orders";

export async function POST(req: Request) {
  const form = await req.formData();
  const url = new URL(req.url);
  if (form.get("logout")) {
    const res = NextResponse.redirect(new URL("/admin/login", url), 303);
    res.cookies.delete(ADMIN_COOKIE);
    return res;
  }
  if (!checkPassword(String(form.get("password") ?? ""))) {
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.redirect(new URL("/admin/login?error=1", url), 303);
  }
  const res = NextResponse.redirect(new URL("/admin", url), 303);
  res.cookies.set(ADMIN_COOKIE, adminToken(), { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
