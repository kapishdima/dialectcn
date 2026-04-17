import type { PresetConfig } from "shadcn/preset";

export type BrandPreset = {
  slug: string;
  name: string;
  description: string;
  config: PresetConfig;
};

/**
 * Brand presets are placeholder approximations. Source of truth lives in
 * `design/<slug>.md`. Regenerate this file when MD files change.
 */
export const BRAND_PRESETS: readonly BrandPreset[] = [
  {
    slug: "vercel",
    name: "Vercel",
    description:
      "Inspired by Vercel — monochrome, precise, engineered with Geist",
    config: {
      style: "nova",
      baseColor: "zinc",
      theme: "neutral",
      font: "geist",
      fontHeading: "inherit",
      radius: "small",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
    },
  },
  {
    slug: "claude",
    name: "Claude",
    description:
      "Inspired by Claude — warm stone surface with a serif headline and amber accent",
    config: {
      style: "luma",
      baseColor: "stone",
      theme: "orange",
      font: "inter",
      fontHeading: "instrument-serif",
      radius: "medium",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
    },
  },
  {
    slug: "codex",
    name: "Codex",
    description:
      "Inspired by Codex — monospaced, minimal, near-black terminal aesthetic",
    config: {
      style: "nova",
      baseColor: "neutral",
      theme: "neutral",
      font: "geist-mono",
      fontHeading: "geist-mono",
      radius: "none",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
    },
  },
  {
    slug: "linear",
    name: "Linear",
    description:
      "Inspired by Linear — quiet violet accent, compressed type, tight radii",
    config: {
      style: "vega",
      baseColor: "mauve",
      theme: "violet",
      font: "inter",
      fontHeading: "inherit",
      radius: "small",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
    },
  },
  {
    slug: "github",
    name: "GitHub",
    description:
      "Inspired by GitHub — calm neutral grays with a confident blue accent",
    config: {
      style: "nova",
      baseColor: "neutral",
      theme: "blue",
      font: "inter",
      fontHeading: "inherit",
      radius: "medium",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
    },
  },
  {
    slug: "supabase",
    name: "Supabase",
    description:
      "Inspired by Supabase — crisp mist background and signature emerald brand",
    config: {
      style: "maia",
      baseColor: "mist",
      theme: "emerald",
      font: "inter",
      fontHeading: "inherit",
      radius: "medium",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
    },
  },
  {
    slug: "stripe",
    name: "Stripe",
    description:
      "Inspired by Stripe — generous radii, indigo accent, layered depth",
    config: {
      style: "lyra",
      baseColor: "olive",
      theme: "indigo",
      font: "inter",
      fontHeading: "inherit",
      radius: "large",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
    },
  },
  {
    slug: "notion",
    name: "Notion",
    description:
      "Inspired by Notion — stone paper surface with a serif headline voice",
    config: {
      style: "luma",
      baseColor: "stone",
      theme: "neutral",
      font: "inter",
      fontHeading: "instrument-serif",
      radius: "default",
      iconLibrary: "lucide",
      menuColor: "default",
      menuAccent: "subtle",
    },
  },
] as const;
