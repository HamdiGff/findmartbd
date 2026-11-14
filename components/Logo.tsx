// The FindMart mark: a market price tag with a punched hole, carrying an "f".
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden>
      <path d="M14 4h18a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H14L4 20 14 4Z" fill="var(--marigold)" />
      <circle cx="13" cy="20" r="2.6" fill="var(--paper)" />
      <path
        d="M28.5 12.5c-.6-.3-1.4-.5-2.3-.5-2.6 0-4.2 1.6-4.2 4.3V18h-2v3h2v9h3.6v-9h3v-3h-3v-1.4c0-1 .5-1.6 1.5-1.6.5 0 .9.1 1.3.3l.1-2.8Z"
        fill="var(--ink)"
      />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`logo${light ? " logo--light" : ""}`}>
      <LogoMark />
      <span className="logo__word">
        findmart<span className="logo__bd">bd</span>
      </span>
    </span>
  );
}
