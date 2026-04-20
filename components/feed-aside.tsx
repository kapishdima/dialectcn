"use client";

import { useAtomValue } from "jotai";
import { sidebarHiddenAtom } from "@/lib/atoms/preset-ui";
import { cn } from "@/lib/utils";

export function FeedAside({ children }: { children: React.ReactNode }) {
  const hidden = useAtomValue(sidebarHiddenAtom);

  return (
    <aside
      data-hidden={hidden || undefined}
      aria-hidden={hidden || undefined}
      inert={hidden || undefined}
      className={cn(
        "hidden shrink-0 overflow-hidden border-r motion-safe:transition-[width,border-color,opacity] motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)] md:block",
        hidden
          ? "md:w-0 md:border-transparent md:opacity-0"
          : "md:w-80 md:opacity-100",
      )}
    >
      <div className="h-full w-80">{children}</div>
    </aside>
  );
}
