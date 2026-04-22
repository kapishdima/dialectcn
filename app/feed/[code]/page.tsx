import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PresetTopBar } from "@/components/preset-top-bar";
import { Preview02Frame } from "@/components/preview-02-frame";
import { sourceLabel } from "@/lib/domain/source-labels";
import {
  getAdjacentCodes,
  getPresetByCode,
  listPresets,
} from "@/lib/services/presets";

type PageParams = { code: string };

export async function generateStaticParams() {
  try {
    const { items } = await listPresets({ sort: "popular", limit: 50 });
    return items.map((p) => ({ code: p.code }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { code } = await params;
  const preset = await getPresetByCode(code);
  if (!preset) return { title: "Preset not found" };
  const title = `${preset.name ?? preset.code.slice(0, 10)} — dialectcn`;
  const description =
    preset.description ??
    `Preset ${preset.code} — a ${sourceLabel(preset.source).toLowerCase()} shadcn preset.`;
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default async function PresetPreviewPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { code } = await params;
  const [preset, adjacent] = await Promise.all([
    getPresetByCode(code),
    getAdjacentCodes(code),
  ]);
  if (!preset) notFound();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PresetTopBar preset={preset} prev={adjacent.prev} next={adjacent.next} />
      <Preview02Frame code={preset.code} />
    </div>
  );
}
