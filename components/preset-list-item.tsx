"use client";

import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link, { useLinkStatus } from "next/link";
import { memo, useCallback, useMemo, useState } from "react";

import type { PresetWithColors } from "@/lib/services/presets";
import { cn } from "@/lib/utils";

type Props = {
  preset: PresetWithColors;
  isActive: boolean;
  queryString: string;
};

const fontLabelCache = new Map<string, string>();
function formatFontLabel(slug: string): string {
  const cached = fontLabelCache.get(slug);
  if (cached) return cached;
  const label = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
  fontLabelCache.set(slug, label);
  return label;
}

function ItemPendingOverlay() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      data-pending={pending || undefined}
      className="pointer-events-none absolute inset-0 rounded-lg bg-accent/0 transition-colors duration-150 data-[pending]:bg-accent/50"
    />
  );
}

function PresetListItemImpl({ preset, isActive, queryString }: Props) {
  const href = `/feed/${preset.code}${queryString}`;
  const previewHref = `https://ui.shadcn.com/preview/radix/preview-02?preset=${encodeURIComponent(preset.code)}`;
  const displayName = preset.name ?? preset.code.slice(0, 10);
  const colors = preset.colors;
  const fonts = preset.fonts;
  const likes = preset.likesCount;

  const dots = useMemo(
    () => (colors ? [colors.primary, colors.chart1, colors.card] : []),
    [colors],
  );

  const fontCaption = useMemo(() => {
    if (!fonts) return null;
    return fonts.heading === fonts.sans
      ? formatFontLabel(fonts.heading)
      : `${formatFontLabel(fonts.heading)} · ${formatFontLabel(fonts.sans)}`;
  }, [fonts]);

  const [intent, setIntent] = useState(false);
  const onIntent = useCallback(() => setIntent(true), []);

  return (
    <Link
      href={href}
      prefetch={intent ? null : false}
      onMouseEnter={onIntent}
      onFocus={onIntent}
      onTouchStart={onIntent}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative flex items-start gap-3 rounded-lg border px-2.5 py-2 transition-colors hover:bg-accent/40",
        isActive ? "border-border bg-card" : "border-border/40 bg-card/30",
      )}
    >
      {intent ? <link rel="prefetch" as="document" href={previewHref} /> : null}
      <ItemPendingOverlay />
      <div className="flex shrink-0 -space-x-1">
        {dots.length === 0 ? (
          <div className="size-4 rounded-full border border-border/60 bg-muted" />
        ) : (
          dots.map((color, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length swatch list
              key={i}
              className="size-4 rounded-full border border-border/60 ring-1 ring-background"
              style={{ backgroundColor: color }}
            />
          ))
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="truncate text-sm font-medium leading-5">
          {displayName}
        </div>
        {fontCaption ? (
          <div className="truncate text-[11px] text-muted-foreground leading-4">
            {fontCaption}
          </div>
        ) : null}
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground tabular-nums">
        <HugeiconsIcon
          icon={FavouriteIcon}
          size={12}
          color="currentColor"
          strokeWidth={1.5}
        />
        {likes}
      </span>
    </Link>
  );
}

export const PresetListItem = memo(PresetListItemImpl);
