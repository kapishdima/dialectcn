"use client";

import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PresetWithColors } from "@/lib/services/presets";
import { cn } from "@/lib/utils";

type Props = {
  preset: PresetWithColors;
  isActive: boolean;
  queryString: string;
};

export function PresetListItem({ preset, isActive, queryString }: Props) {
  const href = `/feed/${preset.code}${queryString}`;
  const displayName = preset.name ?? preset.code.slice(0, 10);
  const colors = preset.colors;
  const dots = colors ? [colors.primary, colors.chart1, colors.card] : [];
  const likes = preset.likesCount;

  return (
    <Link
      href={href}
      prefetch={false}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "block rounded-lg border bg-card/30 p-2 transition-colors",
        "hover:bg-accent/40",
        isActive ? "border-border bg-card" : "border-border/40",
      )}
    >
      <div className="flex h-6 w-full overflow-hidden rounded-md border border-border/60">
        {dots.length === 0 ? (
          <div className="flex-1 bg-muted" />
        ) : (
          dots.map((color, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length swatch list
              key={i}
              className="flex-1"
              style={{ backgroundColor: color }}
            />
          ))
        )}
      </div>
      <div className="mt-2 flex items-end justify-between gap-2">
        <div className="min-w-0 truncate text-sm font-medium">
          {displayName}
        </div>
        <Button size="xs" variant="outline">
          <HugeiconsIcon
            icon={FavouriteIcon}
            size={12}
            color="currentColor"
            strokeWidth={1.5}
          />
          {likes}
        </Button>
      </div>
    </Link>
  );
}
