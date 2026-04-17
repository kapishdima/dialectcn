import Link from "next/link";
import { PresetActions } from "@/components/preset-actions";
import { PresetStyle } from "@/components/preset-style";
import { Badge } from "@/components/ui/badge";
import { sourceLabel } from "@/lib/domain/source-labels";
import {
  type PresetSummary,
  resolvePresetConfig,
} from "@/lib/services/presets";

const DOTS = [
  "primary",
  "secondary",
  "accent",
  "destructive",
  "chart-1",
  "chart-2",
] as const;

export function PresetCard({
  preset,
  isLiked,
}: {
  preset: PresetSummary;
  isLiked: boolean;
}) {
  const config = resolvePresetConfig(preset.code);
  const displayName = preset.name ?? preset.code.slice(0, 10);

  return (
    <article
      data-preset-id={preset.id}
      className="group flex flex-col gap-5 overflow-hidden border bg-background p-6 text-foreground transition-shadow hover:shadow-md rounded-[var(--radius,0.5rem)]"
    >
      <PresetStyle code={preset.code} scopeId={preset.id} />

      <Link
        href={`/feed/${preset.code}`}
        className="flex flex-col gap-4 focus-visible:outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <Badge variant="outline" className="shrink-0 text-xs">
            {sourceLabel(preset.source)}
          </Badge>
          {config ? (
            <span className="text-sm  font-medium tracking-wide text-muted-foreground">
              {config.style} · {config.radius}
            </span>
          ) : null}
        </div>

        <h3 className="wrap-break-words text-2xl font-semibold leading-tight tracking-tight">
          {displayName}
        </h3>

        <div className="flex gap-1.5">
          {DOTS.map((name) => (
            <div
              key={name}
              className="size-6 rounded-(--radius,0.5rem) border"
              style={{ background: `var(--${name})` }}
            />
          ))}
        </div>

        {config ? (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{config.font}</span>
            {" · "}
            <span>{config.theme}</span>
          </p>
        ) : null}
      </Link>

      <div className="mt-auto flex items-center justify-between border-t pt-3">
        <span className="text-xs text-muted-foreground tabular-nums">
          {preset.likesCount} {preset.likesCount === 1 ? "like" : "likes"}
        </span>
        <PresetActions
          code={preset.code}
          presetId={preset.id}
          initialLiked={isLiked}
          initialLikes={preset.likesCount}
        />
      </div>
    </article>
  );
}
