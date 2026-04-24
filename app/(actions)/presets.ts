"use server";

import { decodePreset } from "shadcn/preset";
import type { PresetSort, PresetView } from "@/lib/domain/source-labels";
import { extractPresetColors } from "@/lib/domain/preset-css";
import { extractPresetFonts } from "@/lib/domain/fonts";
import { getCurrentUser } from "@/lib/services/auth";
import { listLikedByUser } from "@/lib/services/likes";
import {
  getRandomCode,
  listPresets,
  type PresetSummary,
  type PresetWithColors,
} from "@/lib/services/presets";

type FetchPresetsInput = {
  source?: PresetView;
  sort?: PresetSort;
  cursor?: string;
};

type FetchPresetsResult = {
  items: PresetWithColors[];
  nextCursor: string | null;
};

function enrichPresets(items: PresetSummary[]): PresetWithColors[] {
  return items.map((p) => {
    const config = decodePreset(p.code);
    if (!config) return { ...p, colors: null, fonts: null };
    return {
      ...p,
      colors: extractPresetColors(config),
      fonts: extractPresetFonts(config),
    };
  });
}

export async function fetchPresetsAction(
  input: FetchPresetsInput,
): Promise<FetchPresetsResult> {
  if (input.source === "likes") {
    const user = await getCurrentUser();
    if (!user) return { items: [], nextCursor: null };
    const { items, nextCursor } = await listLikedByUser({
      userId: user.id,
      cursor: input.cursor,
    });
    return { items: enrichPresets(items), nextCursor };
  }

  const { items, nextCursor } = await listPresets({
    source: input.source,
    sort: input.sort,
    cursor: input.cursor,
  });
  return { items: enrichPresets(items), nextCursor };
}

export async function pickRandomPresetCodeAction(
  exclude?: string,
): Promise<string | null> {
  return getRandomCode(exclude);
}
