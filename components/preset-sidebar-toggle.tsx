"use client";

import { SidebarLeftIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtom } from "jotai";
import { Button } from "@/components/ui/button";
import { sidebarHiddenAtom } from "@/lib/atoms/preset-ui";
import { cn } from "@/lib/utils";

export function PresetSidebarToggle() {
  const [hidden, setHidden] = useAtom(sidebarHiddenAtom);
  const label = hidden ? "Show presets" : "Hide presets";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      aria-pressed={!hidden}
      title={label}
      onClick={() => setHidden((v) => !v)}
      className="hidden shrink-0 md:inline-flex"
    >
      <HugeiconsIcon
        icon={SidebarLeftIcon}
        size={16}
        strokeWidth={1.5}
        className={cn(
          "motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.32,0.72,0,1)]",
          hidden && "-scale-x-100",
        )}
      />
    </Button>
  );
}
