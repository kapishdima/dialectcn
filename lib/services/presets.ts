import { and, asc, desc, eq, gt, lt, or, sql } from "drizzle-orm";
import { cache } from "react";
import { decodePreset, encodePreset, type PresetConfig } from "shadcn/preset";
import { db } from "@/lib/db/client";
import { preset } from "@/lib/db/schema";
import { extractPresetFonts, type PresetFonts } from "@/lib/domain/fonts";
import {
  extractPresetColors,
  type PresetColors,
} from "@/lib/domain/preset-css";
import type { PresetSort, PresetSource } from "@/lib/domain/source-labels";

const FEED_PAGE_SIZE = 24;
const FEATURED_BRAND_SLUGS = ["vercel", "claude", "linear", "stripe"];

export type PresetWithColors = PresetSummary & {
  colors: PresetColors | null;
  fonts: PresetFonts | null;
};

export const listPresetsWithColors = cache(
  async (
    filters: ListFilters = {},
  ): Promise<{ items: PresetWithColors[]; nextCursor: string | null }> => {
    const { items, nextCursor } = await listPresets(filters);
    const enriched = items.map((p) => {
      const config = decodePreset(p.code);
      if (!config) return { ...p, colors: null, fonts: null };
      return {
        ...p,
        colors: extractPresetColors(config),
        fonts: extractPresetFonts(config),
      };
    });
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

function encodeFeedCursor(tie: string | number, id: string): string {
  return `${tie}|${id}`;
}

function decodeFeedCursor(cursor: string): { tie: string; id: string } | null {
  const idx = cursor.lastIndexOf("|");
  if (idx <= 0 || idx === cursor.length - 1) return null;
  return { tie: cursor.slice(0, idx), id: cursor.slice(idx + 1) };
}

export async function listPresets(
  filters: ListFilters = {},
): Promise<{ items: PresetSummary[]; nextCursor: string | null }> {
  const limit = filters.limit ?? FEED_PAGE_SIZE;
  const sort = filters.sort ?? "popular";

  const where = filters.source ? eq(preset.source, filters.source) : undefined;
  const decoded = filters.cursor ? decodeFeedCursor(filters.cursor) : null;
  const cursorWhere =
    decoded && sort === "newest"
      ? or(
          lt(preset.createdAt, new Date(decoded.tie)),
          and(
            eq(preset.createdAt, new Date(decoded.tie)),
            lt(preset.id, decoded.id),
          ),
        )
      : decoded && sort === "popular"
        ? or(
            lt(preset.likesCount, Number(decoded.tie)),
            and(
              eq(preset.likesCount, Number(decoded.tie)),
              lt(preset.id, decoded.id),
            ),
          )
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
        ? encodeFeedCursor(last.createdAt.toISOString(), last.id)
        : sort === "popular"
          ? encodeFeedCursor(last.likesCount, last.id)
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

export type AdjacentFilters = {
  source?: PresetSource;
  sort?: PresetSort;
};

export const getAdjacentCodes = cache(
  async (
    currentCode: string,
    filters: AdjacentFilters = {},
  ): Promise<{ prev: string | null; next: string | null }> => {
    const sort = filters.sort ?? "popular";
    if (sort === "random") return { prev: null, next: null };

    const [current] = await db
      .select({
        id: preset.id,
        createdAt: preset.createdAt,
        likesCount: preset.likesCount,
      })
      .from(preset)
      .where(eq(preset.code, currentCode))
      .limit(1);
    if (!current) return { prev: null, next: null };

    const sourceWhere = filters.source
      ? eq(preset.source, filters.source)
      : undefined;

    const tieCol = sort === "newest" ? preset.createdAt : preset.likesCount;
    const tieVal = sort === "newest" ? current.createdAt : current.likesCount;

    const prevCondition = or(
      gt(tieCol, tieVal),
      and(eq(tieCol, tieVal), gt(preset.id, current.id)),
    );
    const nextCondition = or(
      lt(tieCol, tieVal),
      and(eq(tieCol, tieVal), lt(preset.id, current.id)),
    );

    const [prevRow] = await db
      .select({ code: preset.code })
      .from(preset)
      .where(sourceWhere ? and(sourceWhere, prevCondition) : prevCondition)
      .orderBy(asc(tieCol), asc(preset.id))
      .limit(1);

    const [nextRow] = await db
      .select({ code: preset.code })
      .from(preset)
      .where(sourceWhere ? and(sourceWhere, nextCondition) : nextCondition)
      .orderBy(desc(tieCol), desc(preset.id))
      .limit(1);

    return { prev: prevRow?.code ?? null, next: nextRow?.code ?? null };
  },
);

export async function getRandomCode(
  options: { exclude?: string; source?: PresetSource } = {},
): Promise<string | null> {
  const { exclude, source } = options;
  const excludeWhere = exclude ? sql`${preset.code} <> ${exclude}` : undefined;
  const sourceWhere = source ? eq(preset.source, source) : undefined;
  const where =
    excludeWhere && sourceWhere
      ? and(excludeWhere, sourceWhere)
      : (excludeWhere ?? sourceWhere ?? undefined);

  const rows = await db
    .select({ code: preset.code })
    .from(preset)
    .where(where)
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
