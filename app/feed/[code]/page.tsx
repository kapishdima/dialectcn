import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PresetTopBar } from "@/components/preset-top-bar";
import {
  isPresetSort,
  isPresetSource,
  sourceLabel,
} from "@/lib/domain/source-labels";
import { getCurrentUser } from "@/lib/services/auth";
import { getAdjacentLikedCodes } from "@/lib/services/likes";
import {
  getAdjacentCodes,
  getPresetByCode,
  listPresets,
} from "@/lib/services/presets";

type PageParams = { code: string };
type SearchParams = Record<string, string | string[] | undefined>;

async function getAdjacentLikedForCurrentUser(
  code: string,
): Promise<{ prev: string | null; next: string | null }> {
  const user = await getCurrentUser();
  if (!user) return { prev: null, next: null };
  return getAdjacentLikedCodes(user.id, code);
}

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
  searchParams,
}: {
  params: Promise<PageParams>;
  searchParams: Promise<SearchParams>;
}) {
  const { code } = await params;
  const sp = await searchParams;
  const sourceRaw = typeof sp.source === "string" ? sp.source : undefined;
  const sortRaw = typeof sp.sort === "string" ? sp.sort : undefined;
  const sort = sortRaw && isPresetSort(sortRaw) ? sortRaw : undefined;
  const source = sourceRaw && isPresetSource(sourceRaw) ? sourceRaw : undefined;

  const adjacentPromise =
    sourceRaw === "likes"
      ? getAdjacentLikedForCurrentUser(code)
      : getAdjacentCodes(code, { source, sort });

  const [preset, adjacent] = await Promise.all([
    getPresetByCode(code),
    adjacentPromise,
  ]);
  if (!preset) notFound();

  return (
    <PresetTopBar preset={preset} prev={adjacent.prev} next={adjacent.next} />
  );
}
