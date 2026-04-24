import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { FeedAside } from "@/components/feed-aside";
import { Header } from "@/components/header";
import { PresetSidebar } from "@/components/preset-sidebar";
import { PreviewSurface } from "@/components/preview-surface";
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
    <>
      <div className="flex min-h-0 flex-1 flex-col">
        <Header />
        <div className="flex min-h-0 flex-1">
          <FeedAside>
            <Suspense fallback={null}>
              <PresetSidebar initialItems={items} initialCursor={nextCursor} />
            </Suspense>
          </FeedAside>
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            {children}
            <PreviewSurface />
          </div>
        </div>
      </div>
      <Analytics />
    </>
  );
}
