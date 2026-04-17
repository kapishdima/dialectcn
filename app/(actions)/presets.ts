"use server";

import type { PresetSort, PresetSource } from "@/lib/domain/source-labels";
import {
  extractColors,
  listPresets,
  type PresetWithColors,
} from "@/lib/services/presets";

type FetchPresetsInput = {
  source?: PresetSource;
  sort?: PresetSort;
  cursor?: string;
};

type FetchPresetsResult = {
  items: PresetWithColors[];
  nextCursor: string | null;
};

export async function fetchPresetsAction(
  input: FetchPresetsInput,
): Promise<FetchPresetsResult> {
  const { items, nextCursor } = await listPresets({
    source: input.source,
    sort: input.sort,
    cursor: input.cursor,
  });
  const enriched = await Promise.all(
    items.map(async (preset) => ({
      ...preset,
      colors: await extractColors(preset.code),
    })),
  );
  return { items: enriched, nextCursor };
}
