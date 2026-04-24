import { ImageResponse } from "next/og";
import { decodePreset } from "shadcn/preset";
import { buildRegistryTheme } from "@/lib/domain/preset-css";
import { presetConfigToDesignSystem } from "@/lib/domain/design-system";
import { getPresetByCode } from "@/lib/services/presets";

export const runtime = "nodejs";
export const alt = "dialectcn preset preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const RADIUS_PX: Record<string, number> = {
  none: 0,
  small: 4,
  default: 8,
  medium: 10,
  large: 12,
};

const RADIUS_LABEL: Record<string, string> = {
  none: "0rem",
  small: "0.25rem",
  default: "0.5rem",
  medium: "0.625rem",
  large: "0.75rem",
};

const FALLBACK = {
  primary: "#ededed",
  secondary: "#2a2a2a",
  accent: "#2a2a2a",
  destructive: "#ef4444",
  card: "#141414",
  background: "#0a0a0a",
  foreground: "#f5f5f5",
  muted: "#1f1f1f",
  mutedForeground: "#a1a1a1",
  border: "#262626",
  chart1: "#9ca36b",
  chart2: "#7a7f5a",
  chart3: "#5f6346",
  chart4: "#a8b082",
  chart5: "#c5cc99",
};

// Satori's CSS parser in this Next.js build doesn't accept oklch(); convert to hex.
function oklchToHex(input: string | undefined, fallback: string): string {
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

function titleCase(slug: string | undefined): string {
  if (!slug) return "—";
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function brandedFallback() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        color: "#fafafa",
        fontSize: 64,
      }}
    >
      dialectcn
    </div>,
    size,
  );
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  try {
    const { code } = await params;
    const preset = await getPresetByCode(code);
    if (!preset) return brandedFallback();

    const config = decodePreset(preset.code);
    const registry = config
      ? buildRegistryTheme(presetConfigToDesignSystem(config))
      : null;
    const raw = registry
      ? {
          ...(registry.cssVars.theme ?? {}),
          ...(registry.cssVars.dark ?? {}),
        }
      : {};
    const hex = (key: string, fb: string) => oklchToHex(raw[key], fb);

    const colors = {
      primary: hex("primary", FALLBACK.primary),
      secondary: hex("secondary", FALLBACK.secondary),
      accent: hex("accent", FALLBACK.accent),
      destructive: hex("destructive", FALLBACK.destructive),
      card: hex("card", FALLBACK.card),
      background: hex("background", FALLBACK.background),
      foreground: hex("foreground", FALLBACK.foreground),
      muted: hex("muted", FALLBACK.muted),
      mutedForeground: hex("muted-foreground", FALLBACK.mutedForeground),
      border: hex("border", FALLBACK.border),
      chart1: hex("chart-1", FALLBACK.chart1),
      chart2: hex("chart-2", FALLBACK.chart2),
      chart3: hex("chart-3", FALLBACK.chart3),
      chart4: hex("chart-4", FALLBACK.chart4),
      chart5: hex("chart-5", FALLBACK.chart5),
    };

    const r = RADIUS_PX[config?.radius ?? "default"] ?? 8;
    const radiusLabel = RADIUS_LABEL[config?.radius ?? "default"] ?? "0.5rem";

    const swatches: Array<{ key: string; label: string; color: string }> = [
      { key: "primary", label: "Primary", color: colors.primary },
      { key: "secondary", label: "Secondary", color: colors.secondary },
      { key: "accent", label: "Accent", color: colors.accent },
      { key: "destructive", label: "Destructive", color: colors.destructive },
      { key: "muted", label: "Muted", color: colors.muted },
      { key: "chart1", label: "Chart 1", color: colors.chart1 },
      { key: "chart2", label: "Chart 2", color: colors.chart2 },
      { key: "chart3", label: "Chart 3", color: colors.chart3 },
      { key: "chart4", label: "Chart 4", color: colors.chart4 },
      { key: "chart5", label: "Chart 5", color: colors.chart5 },
    ];

    const displayName = preset.name ?? `--preset=${preset.code.slice(0, 12)}`;
    const truncatedName =
      displayName.length > 28 ? `${displayName.slice(0, 28)}…` : displayName;

    return new ImageResponse(
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: colors.background,
          color: colors.foreground,
          fontFamily: "system-ui, sans-serif",
          padding: 48,
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: -0.3,
            }}
          >
            dialectcn
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              fontSize: 13,
              color: colors.mutedForeground,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            --preset={preset.code.slice(0, 16)}
            {preset.code.length > 16 ? "…" : ""}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            letterSpacing: -1.5,
            marginTop: 28,
          }}
        >
          {truncatedName}
        </div>

        {/* Color palette */}
        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 36,
          }}
        >
          {swatches.map((s) => (
            <div
              key={s.key}
              style={{
                display: "flex",
                flexDirection: "column",
                width: 92,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 92,
                  height: 92,
                  background: s.color,
                  borderRadius: r * 1.5,
                  border: `1px solid ${colors.border}`,
                }}
              />
              <div
                style={{
                  display: "flex",
                  marginTop: 8,
                  fontSize: 11,
                  color: colors.mutedForeground,
                }}
              >
                {s.label}
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 11,
                  color: colors.foreground,
                  fontFamily: "ui-monospace, monospace",
                }}
              >
                {s.color.toUpperCase()}
              </div>
            </div>
          ))}
        </div>

        {/* Info row: radius sample + typography + style/theme */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            gap: 28,
            alignItems: "stretch",
          }}
        >
          {/* Radius sample */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 200,
              height: 160,
              padding: 20,
              borderRadius: r * 2,
              border: `1px solid ${colors.border}`,
              background: colors.card,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 72,
                height: 72,
                background: colors.primary,
                borderRadius: r * 2,
                fontSize: 34,
                fontWeight: 700,
                color: oklchToHex(raw["primary-foreground"], "#1a1a1a"),
              }}
            >
              Aa
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 11,
                  color: colors.mutedForeground,
                }}
              >
                RADIUS
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {titleCase(config?.radius)} · {radiusLabel}
              </div>
            </div>
          </div>

          {/* Typography */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flex: 1,
              height: 160,
              padding: 20,
              borderRadius: r * 2,
              border: `1px solid ${colors.border}`,
              background: colors.card,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 11,
                color: colors.mutedForeground,
              }}
            >
              TYPOGRAPHY
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    color: colors.mutedForeground,
                    width: 56,
                  }}
                >
                  HEADING
                </div>
                <div style={{ display: "flex", fontSize: 18, fontWeight: 600 }}>
                  {titleCase(
                    config?.fontHeading === "inherit"
                      ? config?.font
                      : config?.fontHeading,
                  )}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 11,
                    color: colors.mutedForeground,
                    width: 56,
                  }}
                >
                  SANS
                </div>
                <div style={{ display: "flex", fontSize: 18, fontWeight: 600 }}>
                  {titleCase(config?.font)}
                </div>
              </div>
            </div>
          </div>

          {/* Style & theme */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 260,
              height: 160,
              padding: 20,
              borderRadius: r * 2,
              border: `1px solid ${colors.border}`,
              background: colors.card,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 11,
                color: colors.mutedForeground,
              }}
            >
              STYLE · THEME
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", fontSize: 22, fontWeight: 700 }}>
                {titleCase(config?.style)}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 14,
                  color: colors.mutedForeground,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: colors.primary,
                  }}
                />
                <div style={{ display: "flex" }}>
                  {titleCase(config?.theme)} · {titleCase(config?.baseColor)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>,
      size,
    );
  } catch (err) {
    console.error("[opengraph-image] render failed", err);
    return brandedFallback();
  }
}
