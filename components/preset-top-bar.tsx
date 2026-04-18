import { PresetActions } from "@/components/preset-actions";
import { PresetContextSync } from "@/components/preset-context-sync";
import { PresetNav } from "@/components/preset-nav";
import { Badge } from "@/components/ui/badge";
import type { PresetSummary } from "@/lib/services/presets";

type Props = {
  preset: PresetSummary;
  isLiked: boolean;
  prev: string | null;
  next: string | null;
};

export function PresetTopBar({ preset, isLiked, prev, next }: Props) {
  const displayName = preset.name ?? preset.code.slice(0, 12);
  const shortCode = preset.code.slice(0, 8);

  return (
    <header className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background/70 px-3 py-2 backdrop-blur">
      <PresetContextSync
        code={preset.code}
        presetId={preset.id}
        prev={prev}
        next={next}
      />
      <h1 className="truncate text-sm font-medium tracking-tight">
        {displayName}
      </h1>
      <Badge variant="secondary" className="shrink-0 rounded-full text-[10px]">
        {shortCode}
      </Badge>
      {preset.brandSlug ? (
        <Badge
          variant="outline"
          className="hidden shrink-0 rounded-full text-[10px] sm:inline-flex"
        >
          {preset.brandSlug}
        </Badge>
      ) : null}
      <div className="ml-auto flex items-center gap-2">
        <PresetNav currentCode={preset.code} prev={prev} next={next} />
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
