export const STYLES = [
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
] as const;

export type StyleName = (typeof STYLES)[number];
