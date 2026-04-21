import {
  generateRandomConfig,
  PRESET_BASE_COLORS,
  PRESET_RADII,
  PRESET_THEMES,
  type PresetConfig,
} from "shadcn/preset";
import { BRAND_PRESETS } from "@/lib/brand-presets";
import { pickRandomName } from "@/lib/domain/random-name";
import { insertRandomPreset, upsertBrandPreset } from "@/lib/services/presets";

const RANDOM_COUNT = 100;

// ui.shadcn.com's baseColor selector doesn't offer these; skip them in random
// seed so the pool stays visually aligned with the reference UI. Listed as
// string to also cover values that aren't in PRESET_BASE_COLORS today.
const EXCLUDED_RANDOM_BASE_COLORS = new Set<string>(["gray", "orange"]);

type VisualKey = Pick<PresetConfig, "baseColor" | "theme" | "radius">;

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j] as T, a[i] as T];
  }
  return a;
}

function enumerateVisualKeys(): VisualKey[] {
  const keys: VisualKey[] = [];
  const baseColors = PRESET_BASE_COLORS.filter(
    (v) => !EXCLUDED_RANDOM_BASE_COLORS.has(v),
  );
  for (const baseColor of baseColors) {
    for (const theme of PRESET_THEMES) {
      for (const radius of PRESET_RADII) {
        keys.push({ baseColor, theme, radius });
      }
    }
  }
  return keys;
}

async function main() {
  console.log("Seeding brand presets...");
  for (const brand of BRAND_PRESETS) {
    const row = await upsertBrandPreset({
      slug: brand.slug,
      name: brand.name,
      description: brand.description,
      config: brand.config,
    });
    console.log(`  ${brand.slug.padEnd(10)} → ${row.code}`);
  }

  const picks = shuffle(enumerateVisualKeys()).slice(0, RANDOM_COUNT);
  console.log(
    `Seeding ${picks.length} random presets (visually unique by baseColor × theme × radius)...`,
  );

  let inserted = 0;
  let skipped = 0;
  for (let i = 0; i < picks.length; i++) {
    const visual = picks[i] as VisualKey;
    const config: PresetConfig = {
      ...generateRandomConfig(),
      ...visual,
    };
    const name = pickRandomName();
    const row = await insertRandomPreset({ name, config });
    if (row) inserted++;
    else skipped++;
    if ((i + 1) % 25 === 0) {
      console.log(
        `  ${i + 1}/${picks.length} (inserted=${inserted} skipped=${skipped})`,
      );
    }
  }
  console.log(`Done. inserted=${inserted} skipped=${skipped}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
