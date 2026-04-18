import {
  PRESET_BASE_COLORS,
  PRESET_CHART_COLORS,
  PRESET_THEMES,
  type PresetConfig,
} from "shadcn/preset";

// shadcn.com's live registry rejects a subset of the values we accept locally.
// Observed runtime error from /preview/radix/preview-02:
//   Uncaught Error: Base color "gray" or theme "orange" not found
// Expand these sets as additional incompatible values are reported.
const UNSUPPORTED_BASE_COLORS = new Set<string>(["gray", "orange"]);
const UNSUPPORTED_THEMES = new Set<string>(["orange"]);

export const SUPPORTED_BASE_COLORS = PRESET_BASE_COLORS.filter(
  (v) => !UNSUPPORTED_BASE_COLORS.has(v),
) as readonly PresetConfig["baseColor"][];

export const SUPPORTED_THEMES = PRESET_THEMES.filter(
  (v) => !UNSUPPORTED_THEMES.has(v),
) as readonly PresetConfig["theme"][];

export const SUPPORTED_CHART_COLORS = PRESET_CHART_COLORS.filter(
  (v) => !UNSUPPORTED_THEMES.has(v),
) as readonly NonNullable<PresetConfig["chartColor"]>[];

export type PreviewCompat =
  | { ok: true }
  | { ok: false; field: "baseColor" | "theme" | "chartColor"; value: string };

export function isShadcnPreviewSupported(config: PresetConfig): PreviewCompat {
  if (UNSUPPORTED_BASE_COLORS.has(config.baseColor)) {
    return { ok: false, field: "baseColor", value: config.baseColor };
  }
  if (UNSUPPORTED_THEMES.has(config.theme)) {
    return { ok: false, field: "theme", value: config.theme };
  }
  if (config.chartColor && UNSUPPORTED_THEMES.has(config.chartColor)) {
    return { ok: false, field: "chartColor", value: config.chartColor };
  }
  return { ok: true };
}

// Drops chartColor when it's in the unsupported set. baseColor/theme can't be
// auto-fixed (no safe default), so the caller must filter those upstream.
export function sanitizeChartColor(config: PresetConfig): PresetConfig {
  if (config.chartColor && UNSUPPORTED_THEMES.has(config.chartColor)) {
    const { chartColor: _drop, ...rest } = config;
    return rest;
  }
  return config;
}
