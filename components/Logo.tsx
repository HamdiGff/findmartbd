export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <rect width="40" height="40" rx="12" fill="var(--brand)" />
      <path d="M11 15.5h18l-1.6 15.2a2 2 0 0 1-2 1.8H14.6a2 2 0 0 1-2-1.8L11 15.5Z" fill="#0b3326" />
      <path d="M15.5 15.5v-2a4.5 4.5 0 0 1 9 0v2" fill="none" stroke="#0b3326" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17.5 28V20.5h5.2M17.5 24h4.2" fill="none" stroke="var(--brand)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ dark = false, size = 38 }: { dark?: boolean; size?: number }) {
  return (
    <span className={`lg${dark ? " lg--dark" : ""}`}>
      <LogoMark size={size} />
      <span className="lg__name">
        FindMart<span className="lg__bd">BD</span>
      </span>
    </span>
  );
}
