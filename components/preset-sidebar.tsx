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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PRESET_SORTS,
  type PresetSort,
  type PresetSource,
} from "@/lib/domain/source-labels";
import { feedFilterParsers, serializeFeedFilters } from "@/lib/feed-filters";
import type { PresetWithColors } from "@/lib/services/presets";

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

  const queryString = serializeFeedFilters(filters);
  const activeSource: "all" | PresetSource = filters.source ?? "all";

  return (
    <div className="flex h-full flex-col ">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-background py-2 border-b border-border">
        <Tabs
          value={activeSource}
          onValueChange={(value) =>
            setFilters({
              source: value === "all" ? null : (value as PresetSource),
            })
          }
        >
          <TabsList variant="line">
            {SOURCE_TABS.map((tab) => (
              <TabsTrigger key={tab.key} value={tab.key}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
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
