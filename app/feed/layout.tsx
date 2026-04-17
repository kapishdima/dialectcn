import { PresetSidebar } from "@/components/preset-sidebar";
import { listPresetsWithColors } from "@/lib/services/presets";

export default async function FeedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { items, nextCursor } = await listPresetsWithColors({
    sort: "popular",
  });

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-80 shrink-0 overflow-hidden border-r md:block">
        <PresetSidebar initialItems={items} initialCursor={nextCursor} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
