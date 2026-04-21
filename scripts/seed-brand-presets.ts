import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  PRESET_BASE_COLORS,
  PRESET_FONT_HEADINGS,
  PRESET_FONTS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  PRESET_STYLES,
  PRESET_THEMES,
} from "shadcn/preset";
import { z } from "zod";
import { upsertBrandPreset } from "@/lib/services/presets";

const JSON_PATH = resolve(process.cwd(), "design/brand-presets.json");

// Note: upsertBrandPreset upserts by encoded `code`, not by brandSlug. If a
// brand's config changes between runs, the old row remains and a new one is
// inserted. For a clean rebuild, delete `source='brand'` rows first.
const presetConfigSchema = z.object({
  style: z.enum(PRESET_STYLES as readonly [string, ...string[]]),
  baseColor: z.enum(PRESET_BASE_COLORS as readonly [string, ...string[]]),
  theme: z.enum(PRESET_THEMES as readonly [string, ...string[]]),
  font: z.enum(PRESET_FONTS as readonly [string, ...string[]]),
  fontHeading: z.enum(PRESET_FONT_HEADINGS as readonly [string, ...string[]]),
  radius: z.enum(PRESET_RADII as readonly [string, ...string[]]),
  iconLibrary: z.enum(PRESET_ICON_LIBRARIES as readonly [string, ...string[]]),
  menuColor: z.enum(PRESET_MENU_COLORS as readonly [string, ...string[]]),
  menuAccent: z.enum(PRESET_MENU_ACCENTS as readonly [string, ...string[]]),
});

const brandPresetSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  config: presetConfigSchema,
});

const brandPresetsSchema = z.array(brandPresetSchema);

async function main() {
  const raw = await readFile(JSON_PATH, "utf8");
  const parsed = brandPresetsSchema.parse(JSON.parse(raw));

  console.log(`Seeding ${parsed.length} brand presets from ${JSON_PATH}...`);
  for (const brand of parsed) {
    const row = await upsertBrandPreset({
      slug: brand.slug,
      name: brand.name,
      description: brand.description,
      // biome-ignore lint/suspicious/noExplicitAny: schema enums widen to string; config values are validated to match PresetConfig at runtime.
      config: brand.config as any,
    });
    console.log(`  ${brand.slug.padEnd(14)} → ${row.code}`);
  }
  console.log(`Done. upserted=${parsed.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
