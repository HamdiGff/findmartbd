import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <div className="wrap">
      <div className="login">
        <h1 className="page-title">Admin sign in</h1>
        <form method="post" action="/api/admin/login" className="panel">
          {error && <p className="alert" role="alert">Wrong password. Try again.</p>}
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <button className="btn btn--dark btn--lg btn--block" style={{ marginTop: 14 }}>Sign in</button>
        </form>
      </div>
    </div>
  );
}
