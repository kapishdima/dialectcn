export function IconPlaceholder({ size = 24 }: { size?: number }) {
  const s = size;
  const mid = s / 2;
  const armLen = s * 0.33;
  const stroke = Math.max(2, Math.round(s / 12));
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
    >
      <line x1={mid} y1={mid - armLen} x2={mid} y2={mid + armLen} />
      <line x1={mid - armLen} y1={mid} x2={mid + armLen} y2={mid} />
    </svg>
  );
}
