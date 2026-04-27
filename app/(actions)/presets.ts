"use server";

import type { PresetSort, PresetView } from "@/lib/domain/source-labels";
import { getCurrentUser } from "@/lib/services/auth";
import { type FeedViewResult, listFeedForView } from "@/lib/services/feed";
import { getRandomLikedCode } from "@/lib/services/likes";
import { getRandomCode } from "@/lib/services/presets";

type FetchPresetsInput = {
  source?: PresetView;
  sort?: PresetSort;
  cursor?: string;
};

export async function fetchPresetsAction(
  input: FetchPresetsInput,
): Promise<FeedViewResult> {
  return listFeedForView(input);
}

export async function pickRandomPresetCodeAction(
  input: { exclude?: string; source?: PresetView } = {},
): Promise<string | null> {
  if (input.source === "likes") {
    const user = await getCurrentUser();
    if (!user) return null;
    return getRandomLikedCode(user.id, input.exclude);
  }
  return getRandomCode({ exclude: input.exclude, source: input.source });
}
