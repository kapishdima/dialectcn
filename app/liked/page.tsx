import Link from "next/link";
import { redirect } from "next/navigation";
import { PresetCard } from "@/components/preset-card";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/services/auth";
import { listLikedByUser } from "@/lib/services/likes";

export const metadata = { title: "Liked presets — dialectcn" };

export default async function LikedPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/feed?auth=login&callbackUrl=/liked");
  const items = await listLikedByUser(user.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="container mx-auto flex w-full flex-col gap-6 px-4 py-8 md:px-6">
        <header className="flex flex-col gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Your likes
          </h1>
          <p className="text-sm text-muted-foreground">
            Presets you've hearted across the app.
          </p>
        </header>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-12 text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              No likes yet. Hit the heart on anything in the feed.
            </p>
            <Button render={<Link href="/feed" />}>Browse the feed →</Button>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((preset) => (
              <PresetCard key={preset.id} preset={preset} isLiked />
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
