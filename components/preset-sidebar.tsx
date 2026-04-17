"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { fetchPresetsAction } from "@/app/(actions)/presets";
import { PresetListItem } from "@/components/preset-list-item";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PRESET_SORTS,
  type PresetSort,
  type PresetSource,
} from "@/lib/domain/source-labels";
import { feedFilterParsers, serializeFeedFilters } from "@/lib/feed-filters";
import type { PresetWithColors } from "@/lib/services/presets";
import { cn } from "@/lib/utils";

type Props = {
  initialItems: PresetWithColors[];
  initialCursor: string | null;
};

const SOURCE_TABS: Array<{ key: "all" | PresetSource; label: string }> = [
  { key: "all", label: "All" },
  { key: "brand", label: "Brand" },
  { key: "community", label: "Community" },
  { key: "random", label: "Random" },
];

const SORT_LABELS: Record<PresetSort, string> = {
  popular: "Popular",
  newest: "Newest",
  random: "Random",
};

export function PresetSidebar({ initialItems, initialCursor }: Props) {
  const activeCode = useSelectedLayoutSegment();
  const [filters, setFilters] = useQueryStates(feedFilterParsers, {
    clearOnDefault: true,
  });
  const [items, setItems] = useState<PresetWithColors[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [isPending, startTransition] = useTransition();
  const skipInitial = useRef(true);

  useEffect(() => {
    if (skipInitial.current) {
      skipInitial.current = false;
      return;
    }
    startTransition(async () => {
      const res = await fetchPresetsAction({
        source: filters.source ?? undefined,
        sort: filters.sort,
      });
      setItems(res.items);
      setCursor(res.nextCursor);
    });
  }, [filters.source, filters.sort]);

  const loadMore = useCallback(() => {
    if (!cursor || isPending) return;
    startTransition(async () => {
      const res = await fetchPresetsAction({
        source: filters.source ?? undefined,
        sort: filters.sort,
        cursor,
      });
      setItems((prev) => [...prev, ...res.items]);
      setCursor(res.nextCursor);
    });
  }, [cursor, filters.source, filters.sort, isPending]);

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore]);

  const queryString = serializeFeedFilters(filters);
  const activeSource: "all" | PresetSource = filters.source ?? "all";

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background p-2">
        <div
          role="tablist"
          className="flex gap-0.5 rounded-md bg-muted p-0.5 text-xs"
        >
          {SOURCE_TABS.map((tab) => {
            const active = activeSource === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={active}
                className={cn(
                  "rounded px-2 py-1 transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
                onClick={() =>
                  setFilters({
                    source: tab.key === "all" ? null : tab.key,
                  })
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="h-7 gap-1 px-2">
                <span className="text-xs">{SORT_LABELS[filters.sort]}</span>
                <HugeiconsIcon icon={ArrowDown01Icon} size={12} />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={filters.sort}
              onValueChange={(v) => setFilters({ sort: v as PresetSort })}
            >
              {PRESET_SORTS.map((s) => (
                <DropdownMenuRadioItem key={s} value={s}>
                  {SORT_LABELS[s]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <PresetListItem
            key={item.id}
            preset={item}
            isActive={activeCode === item.code}
            queryString={queryString}
          />
        ))}
        {items.length === 0 && !isPending ? (
          <li className="p-8 text-center text-sm text-muted-foreground">
            No presets found.
          </li>
        ) : null}
        {cursor ? <div ref={sentinelRef} className="h-8" /> : null}
        {isPending ? (
          <li className="p-4 text-center text-xs text-muted-foreground">
            Loading…
          </li>
        ) : null}
      </ul>
    </div>
  );
}
