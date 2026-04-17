import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { PresetActions } from "@/components/preset-actions";
import { Badge } from "@/components/ui/badge";
import { sourceLabel } from "@/lib/domain/source-labels";
import type { PresetSummary } from "@/lib/services/presets";

type Props = {
  preset: PresetSummary;
  isLiked: boolean;
};

export function PresetTopBar({ preset, isLiked }: Props) {
  const displayName = preset.name ?? preset.code.slice(0, 12);

  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur">
      <Link
        href="/feed"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:hidden"
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
        All presets
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-base font-semibold tracking-tight">
            {displayName}
          </h1>
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            {sourceLabel(preset.source)}
          </Badge>
          {preset.brandSlug ? (
            <Badge variant="outline" className="shrink-0 text-[10px]">
              {preset.brandSlug}
            </Badge>
          ) : null}
        </div>
        {preset.description ? (
          <p className="truncate text-xs text-muted-foreground">
            {preset.description}
          </p>
        ) : null}
      </div>
      <div className="shrink-0">
        <PresetActions
          code={preset.code}
          presetId={preset.id}
          initialLiked={isLiked}
          initialLikes={preset.likesCount}
        />
      </div>
    </header>
  );
}
