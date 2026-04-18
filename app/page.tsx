import { SpiralsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SWATCHES = [
  "#0b1020",
  "#2937f0",
  "#8b5cf6",
  "#ec4899",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#111827",
  "#ef4444",
  "#22c55e",
  "#a78bfa",
];

const FEATURES = [
  {
    title: "Brand-inspired",
    body: "Palette and typography echoes drawn from recognizable brands.",
  },
  {
    title: "Community-submitted",
    body: "Presets shared by other designers, with likes and filters.",
  },
  {
    title: "Randomly generated",
    body: "Fresh combinations that surface unexpected pairings.",
  },
];

export default function LandingPage() {
  return (
    <div className="h-full overflow-y-auto">
      <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-12 sm:pt-24">
        <div
          className="flex animate-in items-center gap-2 fade-in-0 font-mono text-sm tracking-wide text-muted-foreground duration-500"
          style={{ animationFillMode: "both" }}
        >
          <HugeiconsIcon icon={SpiralsIcon} size={12} strokeWidth={1.5} />
          Dialectcn
        </div>
        <h1
          className="mt-6 max-w-[20ch] animate-in text-balance fade-in-0 font-heading text-5xl font-semibold tracking-tight duration-700 slide-in-from-bottom-4 sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "120ms", animationFillMode: "both" }}
        >
          Presets, ready to paste.
        </h1>
        <p
          className="mt-6 max-w-[56ch] animate-in text-pretty fade-in-0 text-base text-muted-foreground duration-700 slide-in-from-bottom-4 sm:text-lg"
          style={{ animationDelay: "220ms", animationFillMode: "both" }}
        >
          A living catalog of shadcn presets — brand-inspired,
          community-submitted, and occasionally random. Pick one, copy the code,
          ship the UI.
        </p>
        <div
          className="mt-8 flex animate-in flex-wrap items-center gap-3 fade-in-0 duration-700 slide-in-from-bottom-4"
          style={{ animationDelay: "320ms", animationFillMode: "both" }}
        >
          <Button size="lg" render={<Link href="/feed" />}>
            Browse the feed
          </Button>
          <Button
            size="lg"
            variant="ghost"
            render={
              // biome-ignore lint/a11y/useAnchorContent: anchor content is rendered via Button children
              <a
                href="https://ui.shadcn.com/create"
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            Create your own →
          </Button>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl overflow-hidden px-6 pb-16">
        <div
          className="flex animate-in gap-1 fade-in-0 duration-700"
          style={{ animationDelay: "500ms", animationFillMode: "both" }}
        >
          {SWATCHES.concat(SWATCHES).map((color, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: decorative swatch row
              key={`${color}-${i}`}
              className="h-10 flex-1 rounded-md transition-[flex-grow] duration-300 ease-out will-change-[flex-grow] hover:[flex-grow:2.4]"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-6 pb-24">
        <dl className="grid gap-8 border-t pt-10 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="flex animate-in flex-col gap-2 fade-in-0 duration-700 slide-in-from-bottom-2"
              style={{
                animationDelay: `${650 + i * 100}ms`,
                animationFillMode: "both",
              }}
            >
              <dt className="font-heading text-sm font-semibold tracking-tight">
                {f.title}
              </dt>
              <dd className="text-sm text-muted-foreground">{f.body}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
