import Link from "next/link";
import { SubmitForm } from "@/app/submit/submit-form";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Submit a preset — dialectcn",
  description:
    "Submit a shadcn preset you've created on ui.shadcn.com/create to share it with the community.",
};

export default function SubmitPage() {
  return (
    <div className="container mx-auto flex max-w-2xl flex-col gap-8 py-12">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Submit a preset
        </h1>
        <p className="text-sm text-muted-foreground">
          Paste a valid preset code you created on ui.shadcn.com/create and
          share it with everyone.
        </p>
      </header>

      <div className="rounded-md border bg-muted/30 p-4 text-sm">
        <p className="mb-2 font-medium">Don't have a preset code yet?</p>
        <p className="mb-3 text-muted-foreground">
          Design and export your preset on ui.shadcn.com/create, copy the
          generated code, then paste it below.
        </p>
        <Button
          variant="outline"
          size="sm"
          render={
            // biome-ignore lint/a11y/useAnchorContent: Button children become anchor content via Base UI render prop
            <a
              href="https://ui.shadcn.com/create"
              target="_blank"
              rel="noreferrer"
            />
          }
        >
          Open ui.shadcn.com/create →
        </Button>
      </div>

      <SubmitForm />

      <div className="text-center">
        <Button variant="ghost" size="sm" render={<Link href="/feed" />}>
          ← Back to feed
        </Button>
      </div>
    </div>
  );
}
