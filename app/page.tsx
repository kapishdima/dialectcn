import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex max-w-2xl flex-col items-center gap-6">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Curated shadcn presets
        </h1>
        <p className="text-balance text-base text-muted-foreground sm:text-lg">
          Brand-inspired, community-submitted, and randomly generated preset
          codes — ready to apply to any shadcn project.
        </p>
        <Button size="lg" render={<Link href="/feed" />}>
          Browse presets →
        </Button>
      </div>
    </section>
  );
}
