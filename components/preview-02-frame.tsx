"use client";

import { useMemo, useState } from "react";
import { decodePreset } from "shadcn/preset";
import { cn } from "@/lib/utils";

const SHADCN_PREVIEW_BASE = "https://ui.shadcn.com/preview/radix/preview-02";

export function Preview02Frame({ code }: { code: string }) {
  const config = useMemo(() => decodePreset(code), [code]);
  const src = useMemo(
    () => `${SHADCN_PREVIEW_BASE}?preset=${encodeURIComponent(code)}`,
    [code],
  );

  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const isLoaded = loadedSrc === src;

  if (!config) {
    return <FrameFallback title="Invalid preset code" />;
  }

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <iframe
        src={src}
        title="Preset preview"
        onLoad={() => setLoadedSrc(src)}
        className={cn(
          "z-10 size-full flex-1 border-0 transition-opacity duration-150",
          isLoaded ? "opacity-100" : "opacity-70",
        )}
      />
    </div>
  );
}

function FrameFallback({ title, detail }: { title: string; detail?: string }) {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center bg-muted p-8 dark:bg-background">
      <div className="max-w-md text-center">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {detail ? (
          <p className="mt-1 text-sm text-muted-foreground">{detail}</p>
        ) : null}
      </div>
    </div>
  );
}
