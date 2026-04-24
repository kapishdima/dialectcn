"use client";

import { useMemo } from "react";
import { decodePreset } from "shadcn/preset";
import Preview02Example from "./preview";
import clsx from "clsx";
import { DesignSystemProvider } from "./design-system-provider";

export function Preview02Frame({ code }: { code: string }) {
  const config = useMemo(() => decodePreset(code), [code]);

  if (!config) {
    return (
      <div
        className={clsx(
          "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
        )}
      ></div>
    );
  }

  return (
    <div
      className={clsx(
        "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
        `style-${config?.style}`,
      )}
    >
      <DesignSystemProvider>
        <Preview02Example />
      </DesignSystemProvider>
    </div>
  );
}
