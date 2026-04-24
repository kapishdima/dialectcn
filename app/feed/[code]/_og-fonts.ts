import type { PresetConfig } from "shadcn/preset";
import { FONT_DEFINITIONS, type FontName } from "@/lib/fonts";

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 600 | 700;
  style: "normal";
};

// iOS 9 Safari UA tricks Google Fonts css2 into serving TTF instead of woff2.
// Satori can't parse woff2.
const OLD_SAFARI_UA =
  "Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1";

const fontCache = new Map<string, OgFont[]>();

function getFontTitle(name: string | undefined): string | null {
  if (!name) return null;
  const def = FONT_DEFINITIONS.find((f) => f.name === name);
  return def ? def.title : null;
}

async function fetchFamilyTtf(family: string): Promise<OgFont[]> {
  const cached = fontCache.get(family);
  if (cached) return cached;

  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
    family,
  )}:wght@400;500;600;700&display=swap`;

  const cssRes = await fetch(url, {
    headers: { "User-Agent": OLD_SAFARI_UA },
  });
  if (!cssRes.ok) {
    fontCache.set(family, []);
    return [];
  }
  const css = await cssRes.text();

  const faceRegex = /@font-face\s*{([^}]+)}/g;
  const targetWeights: Array<400 | 500 | 600 | 700> = [400, 500, 600, 700];
  const collected = new Map<400 | 500 | 600 | 700, string>();

  let faceMatch: RegExpExecArray | null;
  while ((faceMatch = faceRegex.exec(css)) !== null) {
    const block = faceMatch[1];
    const weightMatch = block.match(/font-weight:\s*(\d+)(?:\s+\d+)?\s*;/);
    const urlMatch = block.match(/src:\s*url\((https:\/\/[^)]+?\.ttf)\)/);
    if (!weightMatch || !urlMatch) continue;
    const w = Number.parseInt(weightMatch[1], 10);
    const weight = targetWeights.find((t) => t === w);
    if (!weight) continue;
    if (!collected.has(weight)) collected.set(weight, urlMatch[1]);
  }

  const fonts: OgFont[] = await Promise.all(
    Array.from(collected.entries()).map(async ([weight, ttfUrl]) => {
      const res = await fetch(ttfUrl);
      if (!res.ok) throw new Error(`TTF fetch failed: ${ttfUrl}`);
      const data = await res.arrayBuffer();
      return { name: family, data, weight, style: "normal" as const };
    }),
  );

  fontCache.set(family, fonts);
  return fonts;
}

export async function loadPresetFonts(preset: PresetConfig): Promise<OgFont[]> {
  const sansTitle = getFontTitle(preset.font as FontName);
  const headingRaw =
    preset.fontHeading === "inherit" ? preset.font : preset.fontHeading;
  const headingTitle = getFontTitle(headingRaw as FontName);

  const families = Array.from(
    new Set([sansTitle, headingTitle].filter((v): v is string => Boolean(v))),
  );

  const groups = await Promise.all(
    families.map((family) =>
      fetchFamilyTtf(family).catch((err) => {
        console.error(`[og-fonts] failed to load ${family}`, err);
        return [] as OgFont[];
      }),
    ),
  );

  return groups.flat();
}

export function getPresetFontFamilies(preset: PresetConfig): {
  sans: string;
  heading: string;
} {
  const sans = getFontTitle(preset.font as FontName) ?? "sans-serif";
  const headingRaw =
    preset.fontHeading === "inherit" ? preset.font : preset.fontHeading;
  const heading = getFontTitle(headingRaw as FontName) ?? sans;
  return { sans, heading };
}
