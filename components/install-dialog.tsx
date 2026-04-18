"use client";

import { useAtom } from "jotai";
import { toast } from "sonner";
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
import { installDialogOpenAtom } from "@/lib/atoms/preset-ui";

export function InstallDialog({
  code,
  trigger,
}: {
  code: string;
  trigger: React.ReactElement;
}) {
  const [open, setOpen] = useAtom(installDialogOpenAtom);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply this preset</DialogTitle>
          <DialogDescription>
            Run the command below in your shadcn project to apply these tokens.
          </DialogDescription>
        </DialogHeader>
        <div className="contents [--code:var(--popover)]">
          <CodeBlockCommand
            {...convertNpmCommand(`npx shadcn apply ${code}`)}
            prompt={`Apply the preset ${code} to this shadcn project`}
          />
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
