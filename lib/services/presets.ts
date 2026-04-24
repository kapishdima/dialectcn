import { and, desc, eq, lt, sql } from "drizzle-orm";
import { cache } from "react";
import { decodePreset, encodePreset, type PresetConfig } from "shadcn/preset";
import { db } from "@/lib/db/client";
import { preset } from "@/lib/db/schema";
import {
  buildScopedCssText,
  type RegistryThemeCssVars,
} from "@/lib/domain/preset-css";
import { getPresetTheme } from "@/lib/domain/theme";
import type { PresetSort, PresetSource } from "@/lib/domain/source-labels";
import { getBaseColorVars } from "@/lib/services/base-colors";

const CHART_KEYS = ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"];

async function resolvePresetVars(
  config: PresetConfig,
): Promise<RegistryThemeCssVars> {
  const base = await getBaseColorVars(config.baseColor);
  const theme = getPresetTheme(config.theme);
  const chart = config.chartColor
    ? getPresetTheme(config.chartColor)
    : undefined;

  const light: Record<string, string> = {
    ...(base.light ?? {}),
    ...(theme?.cssVars.light ?? {}),
  };
  const dark: Record<string, string> = {
    ...(base.dark ?? {}),
    ...(theme?.cssVars.dark ?? {}),
  };

  if (chart) {
    const chartLight = chart.cssVars.light as Record<string, string>;
    const chartDark = chart.cssVars.dark as Record<string, string>;
    for (const key of CHART_KEYS) {
      if (chartLight[key]) light[key] = chartLight[key];
      if (chartDark[key]) dark[key] = chartDark[key];
    }
  }

  return { theme: base.theme, light, dark };
}

const FEED_PAGE_SIZE = 24;
const FEATURED_BRAND_SLUGS = ["vercel", "claude", "linear", "stripe"];

const RADIUS_REM: Record<PresetConfig["radius"], string> = {
  none: "0rem",
  small: "0.25rem",
  default: "0.5rem",
  medium: "0.625rem",
  large: "0.75rem",
};

function applyRadius(
  vars: RegistryThemeCssVars,
  radius: PresetConfig["radius"],
): RegistryThemeCssVars {
  const radiusValue = RADIUS_REM[radius];
  return {
    theme: { ...(vars.theme ?? {}), radius: radiusValue },
    light: { ...(vars.light ?? {}), radius: radiusValue },
    dark: { ...(vars.dark ?? {}) },
  };
}

export async function buildPresetCss(
  code: string,
  selector: string,
): Promise<string | null> {
  const config = decodePreset(code);
  if (!config) return null;
  const cssVars = await resolvePresetVars(config);
  const withRadius = applyRadius(cssVars, config.radius);
  return buildScopedCssText(withRadius, selector);
}

export function resolvePresetConfig(code: string): PresetConfig | null {
  return decodePreset(code);
}

export type PresetColors = {
  primary: string;
  card: string;
  chart1: string;
  destructive: string;
};

export type PresetFonts = {
  sans: string;
  heading: string;
};

export type PresetWithColors = PresetSummary & {
  colors: PresetColors | null;
  fonts: PresetFonts | null;
};

export async function extractColors(
  code: string,
): Promise<PresetColors | null> {
  const config = decodePreset(code);
  if (!config) return null;
  const cssVars = await resolvePresetVars(config);
  const merged = { ...(cssVars.theme ?? {}), ...(cssVars.light ?? {}) };
  return {
    primary: merged.primary ?? "oklch(0 0 0)",
    chart1: merged["chart-1"] ?? "oklch(0.7 0 0)",
    card: merged.card ?? "oklch(0.95 0.1 0)",
    destructive: merged.destructive ?? "oklch(0.55 0.2 25)",
  };
}

export async function extractDarkVars(
  code: string,
): Promise<Record<string, string> | null> {
  const config = decodePreset(code);
  if (!config) return null;
  const cssVars = await resolvePresetVars(config);
  return { ...(cssVars.theme ?? {}), ...(cssVars.dark ?? {}) };
}

export function extractFonts(code: string): PresetFonts | null {
  const config = decodePreset(code);
  if (!config) return null;
  return {
    sans: config.font,
    heading:
      config.fontHeading === "inherit" ? config.font : config.fontHeading,
  };
}

export const listPresetsWithColors = cache(
  async (
    filters: ListFilters = {},
  ): Promise<{ items: PresetWithColors[]; nextCursor: string | null }> => {
    const { items, nextCursor } = await listPresets(filters);
    const enriched = await Promise.all(
      items.map(async (p) => ({
        ...p,
        colors: await extractColors(p.code),
        fonts: extractFonts(p.code),
      })),
    );
    return { items: enriched, nextCursor };
  },
);

// ---------- CRUD ----------

export type ListFilters = {
  source?: PresetSource;
  sort?: PresetSort;
  cursor?: string;
  limit?: number;
};

export type PresetSummary = {
  id: string;
  code: string;
  name: string | null;
  description: string | null;
  source: PresetSource;
  brandSlug: string | null;
  likesCount: number;
  createdAt: Date;
};

function rowToSummary(row: typeof preset.$inferSelect): PresetSummary {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    source: row.source,
    brandSlug: row.brandSlug,
    likesCount: row.likesCount,
    createdAt: row.createdAt,
  };
}

export async function listPresets(
  filters: ListFilters = {},
): Promise<{ items: PresetSummary[]; nextCursor: string | null }> {
  const limit = filters.limit ?? FEED_PAGE_SIZE;
  const sort = filters.sort ?? "popular";

  const where = filters.source ? eq(preset.source, filters.source) : undefined;
  const cursorWhere = filters.cursor
    ? sort === "newest"
      ? lt(preset.createdAt, new Date(filters.cursor))
      : sort === "popular"
        ? lt(preset.id, filters.cursor)
        : undefined
    : undefined;

  const combined =
    where && cursorWhere
      ? and(where, cursorWhere)
      : (where ?? cursorWhere ?? undefined);

  const orderBy =
    sort === "newest"
      ? [desc(preset.createdAt), desc(preset.id)]
      : sort === "random"
        ? [sql`random()`]
        : [desc(preset.likesCount), desc(preset.id)];

  const rows = await db
    .select()
    .from(preset)
    .where(combined)
    .orderBy(...orderBy)
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];

  const nextCursor =
    !hasMore || !last
      ? null
      : sort === "newest"
        ? last.createdAt.toISOString()
        : sort === "popular"
          ? last.id
          : null; // random cursor not supported

  return { items: page.map(rowToSummary), nextCursor };
}

export const getPresetByCode = cache(
  async (code: string): Promise<PresetSummary | null> => {
    const rows = await db
      .select()
      .from(preset)
      .where(eq(preset.code, code))
      .limit(1);
    const row = rows[0];
    return row ? rowToSummary(row) : null;
  },
);

export const getAdjacentCodes = cache(
  async (
    currentCode: string,
  ): Promise<{ prev: string | null; next: string | null }> => {
    const result = await db.execute<{
      prev: string | null;
      next: string | null;
    }>(sql`
      SELECT
        (SELECT code FROM ${preset} WHERE id > p.id ORDER BY id ASC LIMIT 1) AS prev,
        (SELECT code FROM ${preset} WHERE id < p.id ORDER BY id DESC LIMIT 1) AS next
      FROM ${preset} AS p
      WHERE p.code = ${currentCode}
      LIMIT 1
    `);
    const row = result.rows[0];
    return { prev: row?.prev ?? null, next: row?.next ?? null };
  },
);

export async function getRandomCode(exclude?: string): Promise<string | null> {
  const rows = await db
    .select({ code: preset.code })
    .from(preset)
    .where(exclude ? sql`${preset.code} <> ${exclude}` : undefined)
    .orderBy(sql`random()`)
    .limit(1);
  return rows[0]?.code ?? null;
}

export async function listFeaturedBrand(): Promise<PresetSummary[]> {
  const rows = await db.select().from(preset).where(eq(preset.source, "brand"));
  return rows
    .filter((r) => r.brandSlug && FEATURED_BRAND_SLUGS.includes(r.brandSlug))
    .map(rowToSummary);
}

export type UpsertBrandInput = {
  slug: string;
  name: string;
  description?: string | null;
  config: PresetConfig;
};

export async function upsertBrandPreset(
  input: UpsertBrandInput,
): Promise<PresetSummary> {
  const code = encodePreset(input.config);
  const existing = await db
    .select()
    .from(preset)
    .where(eq(preset.code, code))
    .limit(1);
  const found = existing[0];
  if (found) {
    const updated = await db
      .update(preset)
      .set({
        name: input.name,
        description: input.description ?? null,
        source: "brand",
        brandSlug: input.slug,
      })
      .where(eq(preset.id, found.id))
      .returning();
    const row = updated[0];
    if (!row) throw new Error("Failed to update brand preset");
    return rowToSummary(row);
  }
  const inserted = await db
    .insert(preset)
    .values({
      code,
      name: input.name,
      description: input.description ?? null,
      source: "brand",
      brandSlug: input.slug,
    })
    .returning();
  const row = inserted[0];
  if (!row) throw new Error("Failed to insert brand preset");
  return rowToSummary(row);
}

export type InsertRandomInput = {
  name: string;
  config: PresetConfig;
};

export async function insertRandomPreset(
  input: InsertRandomInput,
): Promise<PresetSummary | null> {
  const code = encodePreset(input.config);
  const inserted = await db
    .insert(preset)
    .values({ code, name: input.name, source: "random" })
    .onConflictDoNothing({ target: preset.code })
    .returning();
  const row = inserted[0];
  return row ? rowToSummary(row) : null;
}

export type CreateCommunityInput = {
  code: string;
  name: string;
  description?: string;
  userId?: string | null;
};

export async function createCommunityPreset(
  input: CreateCommunityInput,
): Promise<
  | { status: "created"; preset: PresetSummary }
  | { status: "exists"; preset: PresetSummary }
> {
  const existing = await getPresetByCode(input.code);
  if (existing) return { status: "exists", preset: existing };

  const inserted = await db
    .insert(preset)
    .values({
      code: input.code,
      name: input.name,
      description: input.description ?? null,
      source: "community",
      createdBy: input.userId ?? null,
    })
    .returning();
  const row = inserted[0];
  if (!row) throw new Error("Failed to insert community preset");
  return { status: "created", preset: rowToSummary(row) };
}

export async function listIndexableForSitemap(): Promise<
  Array<{ code: string; updatedAt: Date }>
> {
  const rows = await db
    .select()
    .from(preset)
    .where(sql`${preset.source} <> 'random' OR ${preset.likesCount} > 0`);
  return rows.map((r) => ({ code: r.code, updatedAt: r.createdAt }));
}
