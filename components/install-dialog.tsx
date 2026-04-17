"use client";

import { toast } from "sonner";
import {
  CodeBlockCommand,
  convertNpmCommand,
} from "@/components/code-block-command/code-block-command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function InstallDialog({
  code,
  trigger,
}: {
  code: string;
  trigger: React.ReactElement;
}) {
  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply this preset</DialogTitle>
          <DialogDescription>
            Run the command below in your shadcn project to apply these tokens.
          </DialogDescription>
        </DialogHeader>
        <CodeBlockCommand
          {...convertNpmCommand(`npx shadcn apply ${code}`)}
          prompt={`Apply the preset ${code} to this shadcn project`}
          onCopySuccess={() => toast.success("Command copied")}
          onCopyError={() => toast.error("Failed to copy command")}
        />
      </DialogContent>
    </Dialog>
  );
}
