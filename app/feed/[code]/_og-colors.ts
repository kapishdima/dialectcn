import type { BuiltTheme } from "@/lib/domain/preset-css";

// Satori's CSS parser doesn't accept oklch(); convert to hex.
export function oklchToHex(
  input: string | undefined,
  fallback = "#000000",
): string {
  if (!input) return fallback;
  const trimmed = input.trim();
  if (trimmed.startsWith("#")) return trimmed;
  const m = trimmed.match(
    /^oklch\(\s*([\d.]+%?)\s+([\d.]+%?)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?)?\s*\)$/i,
  );
  if (!m) return fallback;
  const L = m[1].endsWith("%")
    ? Number.parseFloat(m[1]) / 100
    : Number.parseFloat(m[1]);
  const C = m[2].endsWith("%")
    ? (Number.parseFloat(m[2]) / 100) * 0.4
    : Number.parseFloat(m[2]);
  const hDeg = Number.parseFloat(m[3]);
  const h = (hDeg * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = 4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  const gamma = (v: number) => {
    const vc = Math.max(0, Math.min(1, v));
    return vc <= 0.0031308 ? 12.92 * vc : 1.055 * vc ** (1 / 2.4) - 0.055;
  };
  r = gamma(r);
  g = gamma(g);
  bl = gamma(bl);

  const toHex = (v: number) =>
    Math.round(v * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

function convertGroup(
  group: Record<string, string>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(group)) {
    if (!value) continue;
    out[key] = value.includes("oklch(") ? oklchToHex(value, value) : value;
  }
  return out;
}

// Clones BuiltTheme with all OKLCH values converted to hex.
export function buildHexTheme(theme: BuiltTheme): BuiltTheme {
  return {
    ...theme,
    cssVars: {
      theme: theme.cssVars.theme ? convertGroup(theme.cssVars.theme) : undefined,
      light: convertGroup(theme.cssVars.light),
      dark: convertGroup(theme.cssVars.dark),
    },
  };
}

// Flattened map of CSS var name → hex color, merging theme+light (dark is not
// applied for OG since there's no system preference in a static image).
export function flattenHexVars(theme: BuiltTheme): Record<string, string> {
  return {
    ...(theme.cssVars.theme ? convertGroup(theme.cssVars.theme) : {}),
    ...convertGroup(theme.cssVars.light),
  };
}
