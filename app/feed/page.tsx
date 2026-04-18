import { PresetSidebar } from "@/components/preset-sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listPresetsWithColors } from "@/lib/services/presets";

export default async function FeedIndex() {
  const { items, nextCursor } = await listPresetsWithColors({
    sort: "popular",
  });

  return (
    <>
      <div className="flex-1 md:hidden">
        <PresetSidebar initialItems={items} initialCursor={nextCursor} />
      </div>
      <div className="hidden flex-1 flex-col items-center justify-center gap-3 p-8 text-center md:flex">
        <Card className="w-[20vw] shadow-xs">
          <CardHeader>
            <CardTitle>Select a preset</CardTitle>
            <CardDescription>
              Pick a preset from the sidebar to preview it here. Or create your
              own at
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="link"
              render={
                <a
                  href="https://ui.shadcn.com/create"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  ui.shadcn.com/create
                </a>
              }
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
