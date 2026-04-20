"use client";

import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSelectedLayoutSegment } from "next/navigation";
import { useQueryStates } from "nuqs";
import { fetchPresetsAction } from "@/app/(actions)/presets";
import { ListWithPagination } from "@/components/list-with-pagination";
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
  PRESET_SOURCES,
  type PresetSort,
  type PresetSource,
} from "@/lib/domain/source-labels";
import { feedFilterParsers, serializeFeedFilters } from "@/lib/feed-filters";
import type { PresetWithColors } from "@/lib/services/presets";

type Props = {
  initialItems: PresetWithColors[];
  initialCursor: string | null;
};

const SOURCE_LABELS: Record<"all" | PresetSource, string> = {
  all: "All",
  brand: "Brand",
  community: "Community",
  random: "Random",
};

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

  const queryString = serializeFeedFilters(filters);
  const activeSource: "all" | PresetSource = filters.source ?? "all";
  const activeSort = filters.sort;

  const setSource = (value: "all" | PresetSource) =>
    setFilters({ source: value === "all" ? null : value });
  const setSort = (value: PresetSort) => setFilters({ sort: value });

  return (
    <div className="flex h-full flex-col ">
      <div
        data-id="preset-sidebar-top"
        className="sticky top-0 z-10 flex items-center gap-2 bg-background px-2 py-2 border-b border-border"
      >
        <div className="min-w-0 flex-1">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-between gap-1 px-2.5"
                />
              }
            >
              {SOURCE_LABELS[activeSource]}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                strokeWidth={1.5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuRadioGroup
                value={activeSource}
                onValueChange={(v) => setSource(v as "all" | PresetSource)}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                {PRESET_SOURCES.map((s) => (
                  <DropdownMenuRadioItem key={s} value={s}>
                    {SOURCE_LABELS[s]}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 px-2 text-muted-foreground hover:text-foreground"
                />
              }
            >
              {SORT_LABELS[activeSort]}
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                strokeWidth={1.5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuRadioGroup
                value={activeSort}
                onValueChange={(v) => setSort(v as PresetSort)}
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
      </div>

      <ListWithPagination<PresetWithColors>
        className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2 "
        initialItems={initialItems}
        initialCursor={initialCursor}
        queryKey={`${filters.source ?? "all"}:${filters.sort}`}
        fetchPage={(cursor) =>
          fetchPresetsAction({
            source: filters.source ?? undefined,
            sort: filters.sort,
            cursor: cursor ?? undefined,
          })
        }
        getKey={(item) => item.id}
        renderItem={(item) => (
          <PresetListItem
            preset={item}
            isActive={activeCode === item.code}
            queryString={queryString}
          />
        )}
        empty={
          <li className="p-8 text-center text-sm text-muted-foreground">
            No presets found.
          </li>
        }
        loadingIndicator={
          <li className="p-4 text-center text-xs text-muted-foreground">
            Loading…
          </li>
        }
      />
    </div>
  );
}
