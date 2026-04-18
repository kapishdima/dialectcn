import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PresetTopBar } from "@/components/preset-top-bar";
import { Preview02Frame } from "@/components/preview-02-frame";
import { sourceLabel } from "@/lib/domain/source-labels";
import { getCurrentUser } from "@/lib/services/auth";
import { isLiked as isLikedService } from "@/lib/services/likes";
import { getAdjacentCodes, getPresetByCode } from "@/lib/services/presets";

type PageParams = { code: string };

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
  const preset = await getPresetByCode(code);
  if (!preset) notFound();
  const [user, adjacent] = await Promise.all([
    getCurrentUser(),
    getAdjacentCodes(preset.code),
  ]);
  const liked = user ? await isLikedService(user.id, preset.id) : false;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PresetTopBar
        preset={preset}
        isLiked={liked}
        prev={adjacent.prev}
        next={adjacent.next}
      />
      <Preview02Frame code={preset.code} />
    </div>
  );
}
