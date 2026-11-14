import Link from "next/link";
import { ProductCard } from "./ProductCard";
import { CategoryIcon } from "./Icons";
import { sortProducts, toCard, type Product, type SortKey } from "@/lib/catalog";
import { taka } from "@/lib/format";

const PER_PAGE = 24;
const SORTS: [SortKey, string][] = [
  ["new", "Newest"],
  ["price-asc", "Price: low to high"],
  ["price-desc", "Price: high to low"],
];
const PRICE_CAPS = [999, 2999, 4999];
const PRICE_FLOOR = 5000;

type Params = { sort?: string; page?: string; max?: string; min?: string; q?: string; cat?: string };

export function Listing({
  basePath,
  title,
  subtitle,
  icon,
  tint,
  accent,
  products,
  params,
  crumbs,
}: {
  basePath: string;
  title: string;
  subtitle?: string;
  icon?: string;
  tint?: string;
  accent?: string;
  products: Product[];
  params: Params;
  crumbs: { href?: string; label: string }[];
}) {
  const sort = (SORTS.find(([k]) => k === params.sort)?.[0] ?? "new") as SortKey;
  const max = Number(params.max) || 0;
  const min = Number(params.min) || 0;
  const filtered = products.filter((p) => (!max || p.price <= max) && (!min || p.price >= min));
  const list = sortProducts(filtered, sort);
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(params.page) || 1));
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const thumbs = products.filter((p) => p.stock > 0).slice(0, 3);

  const href = (over: Partial<Params>) => {
    const q = new URLSearchParams();
    const merged = { q: params.q, cat: params.cat, sort, max: max ? String(max) : undefined, min: min ? String(min) : undefined, page: undefined, ...over };
    for (const [k, v] of Object.entries(merged)) if (v && !(k === "sort" && v === "new") && !(k === "page" && v === "1")) q.set(k, String(v));
    const s = q.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  return (
    <div className="wrap">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {crumbs.map((c, i) => (
          <span key={i}>
            {" / "}
            {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
          </span>
        ))}
      </nav>

      <header className="lhead" style={{ ["--tint" as string]: tint ?? "#fff", ["--acc" as string]: accent ?? "#141414" }}>
        {icon && (
          <span className="lhead__ic">
            <CategoryIcon name={icon} size={26} />
          </span>
        )}
        <div className="lhead__copy">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
          {products.length > 0 && (
            <ul className="lhead__stats">
              <li>
                <b>{products.length.toLocaleString("en-IN")}</b> products
              </li>
              <li>
                From <b>{taka(Math.min(...products.map((p) => p.price)))}</b>
              </li>
              <li>Cash on delivery</li>
            </ul>
          )}
        </div>
        {icon && thumbs.length > 0 && (
          <div className="lhead__art" aria-hidden>
            {thumbs.map((p) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={p.slug} src={p.image} alt="" width={120} height={120} loading="eager" />
            ))}
          </div>
        )}
      </header>

      <div className="toolbar">
        <p className="toolbar__count">
          <b>{list.length.toLocaleString("en-IN")}</b> products
        </p>
        <div className="toolbar__opts">
          {SORTS.map(([k, label]) => (
            <Link key={k} href={href({ sort: k })} className={`pill${sort === k ? " is-on" : ""}`} scroll={false}>
              {label}
            </Link>
          ))}
          <span className="toolbar__sep" aria-hidden />
          {PRICE_CAPS.map((cap) => (
            <Link
              key={cap}
              href={href({ max: max === cap ? undefined : String(cap), min: undefined })}
              className={`pill${max === cap && !min ? " is-on" : ""}`}
              scroll={false}
            >
              Under {taka(cap)}
            </Link>
          ))}
          <Link
            href={href({ min: min === PRICE_FLOOR ? undefined : String(PRICE_FLOOR), max: undefined })}
            className={`pill${min === PRICE_FLOOR ? " is-on" : ""}`}
            scroll={false}
          >
            {taka(PRICE_FLOOR)} and above
          </Link>
        </div>
      </div>

      {shown.length ? (
        <div className="pgrid">
          {shown.map((p, i) => (
            <ProductCard key={p.slug} p={toCard(p)} priority={i < 4} />
          ))}
        </div>
      ) : (
        <div className="noresults">
          <h2>No products match</h2>
          <p>Try another search word or remove the price filter.</p>
          <Link href="/shop" className="btn btn--dark">
            Browse all products
          </Link>
        </div>
      )}

      {pages > 1 && (
        <nav className="pager" aria-label="Pages">
          {page > 1 && <Link href={href({ page: String(page - 1) })}>Previous</Link>}
          {pageList(page, pages).map((n, i) =>
            n === 0 ? (
              <span key={`gap${i}`} aria-hidden>
                …
              </span>
            ) : (
              <Link key={n} href={href({ page: String(n) })} className={n === page ? "is-on" : ""} aria-current={n === page ? "page" : undefined}>
                {n}
              </Link>
            ),
          )}
          {page < pages && <Link href={href({ page: String(page + 1) })}>Next</Link>}
        </nav>
      )}
    </div>
  );
}

function pageList(cur: number, total: number) {
  const set = new Set([1, total, cur - 1, cur, cur + 1].filter((n) => n >= 1 && n <= total));
  const arr = [...set].sort((a, b) => a - b);
  const out: number[] = [];
  arr.forEach((n, i) => {
    if (i && n - arr[i - 1] > 1) out.push(0);
    out.push(n);
  });
  return out;
}
