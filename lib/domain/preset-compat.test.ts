import { describe, expect, test } from "bun:test";
import {
  DEFAULT_PRESET_CONFIG,
  PRESET_BASE_COLORS,
  PRESET_THEMES,
  type PresetConfig,
} from "shadcn/preset";
import {
  isShadcnPreviewSupported,
  SUPPORTED_BASE_COLORS,
  SUPPORTED_CHART_COLORS,
  SUPPORTED_THEMES,
  sanitizeChartColor,
} from "./preset-compat";

function configWith(overrides: Partial<PresetConfig>): PresetConfig {
  return { ...DEFAULT_PRESET_CONFIG, ...overrides };
}

describe("isShadcnPreviewSupported", () => {
  test("accepts the default preset config", () => {
    expect(isShadcnPreviewSupported(DEFAULT_PRESET_CONFIG)).toEqual({
      ok: true,
    });
  });

  test("rejects baseColor=gray", () => {
    const result = isShadcnPreviewSupported(configWith({ baseColor: "gray" }));
    expect(result).toEqual({ ok: false, field: "baseColor", value: "gray" });
  });

  test("rejects theme=orange", () => {
    const result = isShadcnPreviewSupported(configWith({ theme: "orange" }));
    expect(result).toEqual({ ok: false, field: "theme", value: "orange" });
  });

  test("rejects chartColor=orange", () => {
    const result = isShadcnPreviewSupported(
      configWith({ theme: "blue", chartColor: "orange" }),
    );
    expect(result).toEqual({ ok: false, field: "chartColor", value: "orange" });
  });

  test("ignores chartColor when undefined", () => {
    const result = isShadcnPreviewSupported(
      configWith({ theme: "blue", chartColor: undefined }),
    );
    expect(result).toEqual({ ok: true });
  });

  test("reports baseColor before theme when both bad", () => {
    const result = isShadcnPreviewSupported(
      configWith({ baseColor: "gray", theme: "orange" }),
    );
    expect(result).toEqual({ ok: false, field: "baseColor", value: "gray" });
  });
});

describe("SUPPORTED_* lists", () => {
  test("SUPPORTED_BASE_COLORS drops gray and keeps everything else", () => {
    expect(SUPPORTED_BASE_COLORS).not.toContain("gray");
    expect(SUPPORTED_BASE_COLORS.length).toBe(PRESET_BASE_COLORS.length - 1);
    for (const v of SUPPORTED_BASE_COLORS) {
      expect(PRESET_BASE_COLORS).toContain(v);
    }
  });

  test("SUPPORTED_THEMES drops orange and keeps everything else", () => {
    expect(SUPPORTED_THEMES).not.toContain("orange");
    expect(SUPPORTED_THEMES.length).toBe(PRESET_THEMES.length - 1);
  });

  test("SUPPORTED_CHART_COLORS drops orange", () => {
    expect(SUPPORTED_CHART_COLORS).not.toContain("orange");
  });
});

describe("sanitizeChartColor", () => {
  test("drops chartColor when unsupported", () => {
    const result = sanitizeChartColor(
      configWith({ theme: "blue", chartColor: "orange" }),
    );
    expect(result.chartColor).toBeUndefined();
  });

  test("keeps chartColor when supported", () => {
    const result = sanitizeChartColor(
      configWith({ theme: "blue", chartColor: "violet" }),
    );
    expect(result.chartColor).toBe("violet");
  });

  test("leaves config unchanged when chartColor undefined", () => {
    const input = configWith({ theme: "blue", chartColor: undefined });
    const result = sanitizeChartColor(input);
    expect(result).toEqual(input);
  });
});
