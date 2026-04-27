import type { PresetSort, PresetView } from "@/lib/domain/source-labels";
import { getCurrentUser } from "@/lib/services/auth";
import { listLikedByUser } from "@/lib/services/likes";
import {
  enrichPresetsWithColors,
  listPresets,
  type PresetWithColors,
} from "@/lib/services/presets";

export type FeedViewInput = {
  source?: PresetView;
  sort?: PresetSort;
  cursor?: string;
};

export type FeedViewResult = {
  items: PresetWithColors[];
  nextCursor: string | null;
};

export async function listFeedForView(
  input: FeedViewInput = {},
): Promise<FeedViewResult> {
  if (input.source === "likes") {
    const user = await getCurrentUser();
    if (!user) return { items: [], nextCursor: null };
    const { items, nextCursor } = await listLikedByUser({
      userId: user.id,
      cursor: input.cursor,
    });
    return { items: enrichPresetsWithColors(items), nextCursor };
  }

  const { items, nextCursor } = await listPresets({
    source: input.source,
    sort: input.sort,
    cursor: input.cursor,
  });
  return { items: enrichPresetsWithColors(items), nextCursor };
}
