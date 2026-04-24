import { and, asc, desc, eq, gt, lt, or, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { like, preset } from "@/lib/db/schema";
import type { PresetSummary } from "@/lib/services/presets";

export async function isLiked(userId: string, presetId: string) {
  const rows = await db
    .select()
    .from(like)
    .where(and(eq(like.userId, userId), eq(like.presetId, presetId)))
    .limit(1);
  return rows.length > 0;
}

export async function toggleLike(input: {
  userId: string;
  presetId: string;
}): Promise<{ liked: boolean; likesCount: number }> {
  const existing = await db
    .select()
    .from(like)
    .where(
      and(eq(like.userId, input.userId), eq(like.presetId, input.presetId)),
    )
    .limit(1);

  if (existing.length > 0) {
    const [, updated] = await db.batch([
      db
        .delete(like)
        .where(
          and(eq(like.userId, input.userId), eq(like.presetId, input.presetId)),
        ),
      db
        .update(preset)
        .set({ likesCount: sql`GREATEST(${preset.likesCount} - 1, 0)` })
        .where(eq(preset.id, input.presetId))
        .returning({ count: preset.likesCount }),
    ]);
    return { liked: false, likesCount: updated[0]?.count ?? 0 };
  }

  const [, updated] = await db.batch([
    db.insert(like).values({ userId: input.userId, presetId: input.presetId }),
    db
      .update(preset)
      .set({ likesCount: sql`${preset.likesCount} + 1` })
      .where(eq(preset.id, input.presetId))
      .returning({ count: preset.likesCount }),
  ]);
  return { liked: true, likesCount: updated[0]?.count ?? 0 };
}

const LIKES_PAGE_SIZE = 24;

function decodeLikesCursor(
  cursor: string,
): { likedAt: Date; presetId: string } | null {
  const idx = cursor.lastIndexOf("|");
  if (idx <= 0 || idx === cursor.length - 1) return null;
  const likedAt = new Date(cursor.slice(0, idx));
  if (Number.isNaN(likedAt.getTime())) return null;
  return { likedAt, presetId: cursor.slice(idx + 1) };
}

export async function listLikedByUser(input: {
  userId: string;
  cursor?: string;
  limit?: number;
}): Promise<{ items: PresetSummary[]; nextCursor: string | null }> {
  const limit = input.limit ?? LIKES_PAGE_SIZE;
  const decoded = input.cursor ? decodeLikesCursor(input.cursor) : null;

  const rows = await db
    .select({
      id: preset.id,
      code: preset.code,
      name: preset.name,
      description: preset.description,
      source: preset.source,
      brandSlug: preset.brandSlug,
      likesCount: preset.likesCount,
      createdAt: preset.createdAt,
      likedAt: like.createdAt,
    })
    .from(like)
    .innerJoin(preset, eq(like.presetId, preset.id))
    .where(
      decoded
        ? and(
            eq(like.userId, input.userId),
            or(
              lt(like.createdAt, decoded.likedAt),
              and(
                eq(like.createdAt, decoded.likedAt),
                lt(like.presetId, decoded.presetId),
              ),
            ),
          )
        : eq(like.userId, input.userId),
    )
    .orderBy(desc(like.createdAt), desc(like.presetId))
    .limit(limit + 1);

  const hasMore = rows.length > limit;
  const page = hasMore ? rows.slice(0, limit) : rows;
  const last = page[page.length - 1];
  const nextCursor =
    hasMore && last ? `${last.likedAt.toISOString()}|${last.id}` : null;

  const items: PresetSummary[] = page.map(
    ({ likedAt: _likedAt, ...rest }) => rest,
  );
  return { items, nextCursor };
}

export async function getRandomLikedCode(
  userId: string,
  exclude?: string,
): Promise<string | null> {
  const excludeWhere = exclude ? sql`${preset.code} <> ${exclude}` : undefined;
  const rows = await db
    .select({ code: preset.code })
    .from(like)
    .innerJoin(preset, eq(like.presetId, preset.id))
    .where(
      excludeWhere
        ? and(eq(like.userId, userId), excludeWhere)
        : eq(like.userId, userId),
    )
    .orderBy(sql`random()`)
    .limit(1);
  return rows[0]?.code ?? null;
}

export async function getAdjacentLikedCodes(
  userId: string,
  currentCode: string,
): Promise<{ prev: string | null; next: string | null }> {
  const [current] = await db
    .select({ presetId: like.presetId, likedAt: like.createdAt })
    .from(like)
    .innerJoin(preset, eq(like.presetId, preset.id))
    .where(and(eq(like.userId, userId), eq(preset.code, currentCode)))
    .limit(1);
  if (!current) return { prev: null, next: null };

  const prevCondition = or(
    gt(like.createdAt, current.likedAt),
    and(
      eq(like.createdAt, current.likedAt),
      gt(like.presetId, current.presetId),
    ),
  );
  const nextCondition = or(
    lt(like.createdAt, current.likedAt),
    and(
      eq(like.createdAt, current.likedAt),
      lt(like.presetId, current.presetId),
    ),
  );

  const [prevRow] = await db
    .select({ code: preset.code })
    .from(like)
    .innerJoin(preset, eq(like.presetId, preset.id))
    .where(and(eq(like.userId, userId), prevCondition))
    .orderBy(asc(like.createdAt), asc(like.presetId))
    .limit(1);

  const [nextRow] = await db
    .select({ code: preset.code })
    .from(like)
    .innerJoin(preset, eq(like.presetId, preset.id))
    .where(and(eq(like.userId, userId), nextCondition))
    .orderBy(desc(like.createdAt), desc(like.presetId))
    .limit(1);

  return { prev: prevRow?.code ?? null, next: nextRow?.code ?? null };
}

export async function likedPresetIdsByUser(
  userId: string,
  presetIds: string[],
): Promise<Set<string>> {
  if (presetIds.length === 0) return new Set();
  const rows = await db
    .select({ presetId: like.presetId })
    .from(like)
    .where(
      and(
        eq(like.userId, userId),
        sql`${like.presetId} = ANY(${sql.raw(`ARRAY[${presetIds.map((id) => `'${id}'`).join(",")}]::uuid[]`)})`,
      ),
    );
  return new Set(rows.map((r) => r.presetId));
}
