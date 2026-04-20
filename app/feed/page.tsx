import { Suspense } from "react";
import { PresetSidebar } from "@/components/preset-sidebar";
import { RandomPresetButton } from "@/components/random-preset-button";
import { Button } from "@/components/ui/button";
import { listPresetsWithColors } from "@/lib/services/presets";

const EMPTY_STATE_SWATCHES = [
  "#0b1020",
  "#2937f0",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
];

export default async function FeedIndex() {
  const { items, nextCursor } = await listPresetsWithColors({
    sort: "popular",
  });

  return (
    <>
      <div className="flex-1 md:hidden">
        <Suspense fallback={null}>
          <PresetSidebar initialItems={items} initialCursor={nextCursor} />
        </Suspense>
      </div>

      <div className="hidden flex-1 flex-col items-center justify-center gap-8 p-8 text-center md:flex">
        <div aria-hidden="true" className="relative h-44 w-80">
          <div className="absolute inset-0 translate-x-7 translate-y-3 rotate-[4deg] rounded-2xl border bg-muted/50" />
          <div className="absolute inset-0 translate-x-3 translate-y-1 rotate-[2deg] rounded-2xl border bg-card shadow-xs" />
          <div className="absolute inset-0 flex -rotate-[2deg] flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex gap-1">
              {EMPTY_STATE_SWATCHES.slice(0, 6).map((color) => (
                <div
                  key={color}
                  className="h-6 flex-1 rounded"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="mt-1 space-y-2">
              <div className="h-3 w-28 rounded-full bg-muted" />
              <div className="h-2.5 w-40 rounded-full bg-muted/70" />
              <div className="h-2.5 w-32 rounded-full bg-muted/70" />
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="max-w-[22ch] text-balance font-heading text-2xl font-semibold tracking-tight">
            A preset is waiting.
          </h2>
          <p className="max-w-[42ch] text-pretty text-sm text-muted-foreground">
            Pick one from the sidebar to preview it here — or submit your own.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <RandomPresetButton>Random preset</RandomPresetButton>
          <Button
            variant="outline"
            render={
              <a
                href="https://ui.shadcn.com/create"
                target="_blank"
                rel="noreferrer"
              >
                Create your own →
              </a>
            }
          />
        </div>
      </div>
    </>
  );
}
