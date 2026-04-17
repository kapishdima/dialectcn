export const PRESET_SOURCES = ["brand", "community", "random"] as const;
export type PresetSource = (typeof PRESET_SOURCES)[number];

const LABELS: Record<PresetSource, string> = {
  brand: "Brand",
  community: "Community",
  random: "Random",
};

export function sourceLabel(source: PresetSource): string {
  return LABELS[source];
}

export function isPresetSource(value: string): value is PresetSource {
  return (PRESET_SOURCES as readonly string[]).includes(value);
}

export const PRESET_SORTS = ["popular", "newest", "random"] as const;
export type PresetSort = (typeof PRESET_SORTS)[number];

export function isPresetSort(value: string): value is PresetSort {
  return (PRESET_SORTS as readonly string[]).includes(value);
}
