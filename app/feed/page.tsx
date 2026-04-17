import { PresetSidebar } from "@/components/preset-sidebar";
import { listPresetsWithColors } from "@/lib/services/presets";

export default async function FeedIndex() {
  const { items, nextCursor } = await listPresetsWithColors({
    sort: "popular",
  });

  return (
    <>
      <div className="h-full md:hidden">
        <PresetSidebar initialItems={items} initialCursor={nextCursor} />
      </div>
      <div className="hidden h-full flex-col items-center justify-center gap-3 p-8 text-center md:flex">
        <h2 className="text-lg font-semibold tracking-tight">
          Select a preset
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Pick a preset from the sidebar to preview it here. Or create your own
          at{" "}
          <a
            href="https://ui.shadcn.com/create"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4"
          >
            ui.shadcn.com/create
          </a>
        </p>
      </div>
    </>
  );
}
