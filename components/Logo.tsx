export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="11" fill="var(--brand)" />
      <path d="M11 15.5h18l-1.6 15.2a2 2 0 0 1-2 1.8H14.6a2 2 0 0 1-2-1.8L11 15.5Z" fill="var(--ink)" />
      <path d="M15.5 15.5v-2a4.5 4.5 0 0 1 9 0v2" fill="none" stroke="var(--ink)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17.5 28V20.5h5.2M17.5 24h4.2" fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`logo${dark ? " logo--dark" : ""}`}>
      <LogoMark />
      <span className="logo__type">
        <span className="logo__name">FindMart</span>
        <span className="logo__sub">Bangladesh</span>
      </span>
    </span>
  );
}
