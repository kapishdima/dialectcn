"use client";

import { useAtom } from "jotai";
import { useState } from "react";
import {
  CodeBlockCommand,
  convertNpmCommand,
} from "@/components/code-block-command/code-block-command";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { installDialogOpenAtom } from "@/lib/atoms/preset-ui";

type ApplyMode = "full" | "theme" | "font" | "theme-font";

function buildApplyCommand(code: string, mode: ApplyMode) {
  const base = `npx shadcn apply --preset ${code}`;
  switch (mode) {
    case "full":
      return base;
    case "theme":
      return `${base} --only theme`;
    case "font":
      return `${base} --only font`;
    case "theme-font":
      return `${base} --only theme,font`;
  }
}

function buildApplyPrompt(code: string, mode: ApplyMode) {
  switch (mode) {
    case "full":
      return `Apply the preset ${code} to this shadcn project`;
    case "theme":
      return `Apply only the theme from preset ${code} to this shadcn project`;
    case "font":
      return `Apply only the fonts from preset ${code} to this shadcn project`;
    case "theme-font":
      return `Apply the theme and fonts from preset ${code} to this shadcn project`;
  }
}

export function InstallDialog({
  code,
  trigger,
}: {
  code: string;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useAtom(installDialogOpenAtom);
  const [mode, setMode] = useState<ApplyMode>("full");

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setMode("full");
        }
      }}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Apply this preset</DialogTitle>
          <DialogDescription>
            Start a new project with this preset, or apply it to an existing
            shadcn project.
          </DialogDescription>
        </DialogHeader>
        <div className="[--code:var(--popover)] flex min-w-0 flex-col gap-4">
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-xs font-medium text-foreground">
              Start a new project
            </span>
            <CodeBlockCommand
              {...convertNpmCommand(
                `npx shadcn@latest init --preset ${code} --template next`,
              )}
              prompt={`Scaffold a new Next.js shadcn project with preset ${code}`}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-2">
            <span className="text-xs font-medium text-foreground">
              Apply to an existing project
            </span>
            <ToggleGroup
              variant="outline"
              size="sm"
              spacing={0}
              value={[mode]}
              onValueChange={(next) => {
                const [picked] = next;
                if (picked) {
                  setMode(picked as ApplyMode);
                }
              }}
              aria-label="What to apply"
              className="self-start"
            >
              <ToggleGroupItem value="full">Full preset</ToggleGroupItem>
              <ToggleGroupItem value="theme">Theme</ToggleGroupItem>
              <ToggleGroupItem value="font">Fonts</ToggleGroupItem>
              <ToggleGroupItem value="theme-font">
                Theme + Fonts
              </ToggleGroupItem>
            </ToggleGroup>
            <CodeBlockCommand
              {...convertNpmCommand(buildApplyCommand(code, mode))}
              prompt={buildApplyPrompt(code, mode)}
            />
          </div>
        </div>
        <DialogFooter className="sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground sm:flex-1">
            No shadcn project yet?{" "}
            <a
              href="https://ui.shadcn.com/docs/installation"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              See the install guide
            </a>
            .
          </p>
          <DialogClose render={<Button variant="outline" size="sm" />}>
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
