"use client";

import { useSetAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { submitModalOpenAtom } from "@/lib/atoms/submit-modal";
import type { PresetSource } from "@/lib/domain/source-labels";

type Props = {
  source: "all" | PresetSource;
  onShowAll: () => void;
};

type Copy = {
  heading: string;
  description: string;
  primaryLabel: string;
  kind: "submit" | "show-all" | "external";
};

const COPY: Record<"all" | PresetSource, Copy> = {
  community: {
    heading: "No community presets yet.",
    description: "Be the first — submit yours for everyone to remix.",
    primaryLabel: "Submit a preset",
    kind: "submit",
  },
  brand: {
    heading: "No brand presets match.",
    description: "We don't have anything in this view yet.",
    primaryLabel: "Show all presets",
    kind: "show-all",
  },
  random: {
    heading: "Nothing random here yet.",
    description: "Roll a fresh theme on shadcn/create and submit it back.",
    primaryLabel: "Open shadcn/create",
    kind: "external",
  },
  all: {
    heading: "No presets found.",
    description: "Try a different sort or come back later.",
    primaryLabel: "Show all presets",
    kind: "show-all",
  },
};

const SWATCHES = [
  "#0b1020",
  "#2937f0",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#f59e0b",
];

export function SidebarEmptyState({ source, onShowAll }: Props) {
  const openSubmit = useSetAtom(submitModalOpenAtom);
  const copy = COPY[source];

  const runPrimary = () => {
    if (copy.kind === "submit") openSubmit(true);
    else if (copy.kind === "show-all") onShowAll();
    else window.open("https://ui.shadcn.com/create", "_blank", "noreferrer");
  };

  const showSecondary = source !== "all" && copy.kind !== "show-all";

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-5 text-center">
      <div aria-hidden="true" className="relative h-24 w-40">
        <div className="absolute inset-0 translate-x-3 translate-y-1.5 rotate-[4deg] rounded-xl border bg-muted/50" />
        <div className="absolute inset-0 translate-x-1.5 translate-y-0.5 rotate-[2deg] rounded-xl border bg-card" />
        <div className="absolute inset-0 flex -rotate-[2deg] flex-col gap-1.5 rounded-xl border bg-card p-2.5 shadow-sm">
          <div className="flex gap-0.5">
            {SWATCHES.map((c) => (
              <div
                key={c}
                className="h-3 flex-1 rounded"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="mt-0.5 flex flex-col gap-1">
            <div className="h-2 w-16 rounded-full bg-muted" />
            <div className="h-1.5 w-20 rounded-full bg-muted/70" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium leading-5">{copy.heading}</p>
        <p className="max-w-[28ch] text-pretty text-xs leading-4 text-muted-foreground">
          {copy.description}
        </p>
      </div>
      <div className="flex w-full gap-2">
        <Button size="sm" onClick={runPrimary} className="flex-1">
          {copy.primaryLabel}
        </Button>
        {showSecondary ? (
          <Button
            size="sm"
            variant="outline"
            onClick={onShowAll}
            className="flex-1"
          >
            Show all
          </Button>
        ) : null}
      </div>
    </div>
  );
}
