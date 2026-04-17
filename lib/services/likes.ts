import { and, desc, eq, sql } from "drizzle-orm";
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
  return await db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(like)
      .where(
        and(eq(like.userId, input.userId), eq(like.presetId, input.presetId)),
      )
      .limit(1);

    if (existing.length > 0) {
      await tx
        .delete(like)
        .where(
          and(eq(like.userId, input.userId), eq(like.presetId, input.presetId)),
        );
      const updated = await tx
        .update(preset)
        .set({ likesCount: sql`GREATEST(${preset.likesCount} - 1, 0)` })
        .where(eq(preset.id, input.presetId))
        .returning({ count: preset.likesCount });
      const count = updated[0]?.count ?? 0;
      return { liked: false, likesCount: count };
    }

    await tx
      .insert(like)
      .values({ userId: input.userId, presetId: input.presetId });
    const updated = await tx
      .update(preset)
      .set({ likesCount: sql`${preset.likesCount} + 1` })
      .where(eq(preset.id, input.presetId))
      .returning({ count: preset.likesCount });
    const count = updated[0]?.count ?? 0;
    return { liked: true, likesCount: count };
  });
}

export async function listLikedByUser(
  userId: string,
): Promise<PresetSummary[]> {
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
    })
    .from(like)
    .innerJoin(preset, eq(like.presetId, preset.id))
    .where(eq(like.userId, userId))
    .orderBy(desc(like.createdAt));
  return rows;
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
