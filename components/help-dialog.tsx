"use client";

import { KeyboardIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtom } from "jotai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { helpOpenAtom } from "@/lib/atoms/preset-ui";
import { HOTKEY_GROUPS } from "@/lib/hotkeys-list";
import { cn } from "@/lib/utils";

function Keycap({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-7 items-center justify-center rounded-md border border-border/80 bg-background px-2",
        "font-mono text-[11px] font-semibold tracking-tight text-foreground",
        "shadow-[inset_0_-2px_0_0_var(--border),0_1px_0_0_var(--border)]",
        "before:absolute before:inset-x-1 before:top-0.5 before:h-px before:rounded-full before:bg-foreground/5 before:content-['']",
        "dark:shadow-[inset_0_-2px_0_0_color-mix(in_oklab,var(--border)_70%,transparent),0_1px_0_0_color-mix(in_oklab,var(--border)_60%,transparent)]",
        wide ? "min-w-10" : "min-w-7",
      )}
    >
      {children}
    </span>
  );
}

export function HelpDialog() {
  const [open, setOpen] = useAtom(helpOpenAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
              <HugeiconsIcon icon={KeyboardIcon} size={14} strokeWidth={1.75} />
            </span>
            <DialogTitle>Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Press{" "}
            <span className="rounded bg-muted px-1 font-mono text-foreground">
              ?
            </span>{" "}
            anywhere to open this panel.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-5 sm:grid-cols-2">
          {HOTKEY_GROUPS.map((group) => (
            <section
              key={group.id}
              className="flex flex-col gap-3 rounded-2xl bg-muted/40 p-4"
            >
              <h3 className="font-heading text-xs font-medium text-foreground">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-[13px] text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="flex shrink-0 items-center gap-1">
                      {item.keys.map((k, i) => (
                        <span key={k} className="flex items-center gap-1">
                          {i > 0 && (
                            <span className="text-[10px] text-muted-foreground/60">
                              +
                            </span>
                          )}
                          <Keycap wide={k.length > 1}>{k}</Keycap>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
