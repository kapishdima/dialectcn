"use client";

import Link from "next/link";
import { decodePreset } from "shadcn/preset";
import { sourceLabel } from "@/lib/domain/source-labels";
import type { PresetWithColors } from "@/lib/services/presets";
import { cn } from "@/lib/utils";

type Props = {
  preset: PresetWithColors;
  isActive: boolean;
  queryString: string;
};

export function PresetListItem({ preset, isActive, queryString }: Props) {
  const config = decodePreset(preset.code);
  const href = `/feed/${preset.code}${queryString}`;
  const displayName = preset.name ?? preset.code.slice(0, 10);
  const dots = preset.colors
    ? [
        preset.colors.primary,
        preset.colors.secondary,
        preset.colors.accent,
        preset.colors.destructive,
      ]
    : [];

  return (
    <li>
      <Link
        href={href}
        prefetch={false}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-3 border-l-2 border-transparent px-4 py-3 transition-colors",
          "hover:bg-accent/40",
          isActive && "bg-accent border-l-primary",
        )}
      >
        <div className="flex shrink-0 gap-0.5">
          {dots.map((color, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length dot list
              key={i}
              className="size-3 rounded-full border border-border/60"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium">{displayName}</div>
          <div className="truncate text-xs text-muted-foreground">
            {sourceLabel(preset.source)}
            {config ? ` · ${config.radius}` : ""}
            {` · ♥ ${preset.likesCount}`}
          </div>
        </div>
      </Link>
    </li>
  );
}
