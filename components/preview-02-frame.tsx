"use client";

import { decodePreset } from "shadcn/preset";
import { isShadcnPreviewSupported } from "@/lib/domain/preset-compat";

const SHADCN_PREVIEW_BASE = "https://ui.shadcn.com/preview/radix/preview-02";

const FIELD_LABEL = {
  baseColor: "Base color",
  theme: "Theme",
  chartColor: "Chart color",
} as const;

export function Preview02Frame({ code }: { code: string }) {
  const config = decodePreset(code);

  if (!config) {
    return <FrameFallback title="Invalid preset code" />;
  }

  const compat = isShadcnPreviewSupported(config);
  if (!compat.ok) {
    return (
      <FrameFallback
        title="Preview unavailable"
        detail={`${FIELD_LABEL[compat.field]} "${compat.value}" is not supported by the shadcn.com preview.`}
      />
    );
  }

  const src = `${SHADCN_PREVIEW_BASE}?preset=${encodeURIComponent(code)}`;

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <iframe
        key={src}
        src={src}
        title="Preset preview"
        className="z-10 size-full flex-1 border-0"
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
