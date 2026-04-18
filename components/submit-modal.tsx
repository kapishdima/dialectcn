"use client";

import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { SubmitForm } from "@/components/submit-form";
import { Button } from "@/components/ui/button";
import { submitModalOpenAtom } from "@/lib/atoms/submit-modal";

export function SubmitModal() {
  const [open, setOpen] = useAtom(submitModalOpenAtom);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-modal-title"
      className="fixed inset-0 z-50 isolate flex items-center justify-center p-4 duration-100 animate-in fade-in-0"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={close}
        className="absolute inset-0 bg-black/30 supports-backdrop-filter:backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg rounded-4xl bg-popover p-6 text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 animate-in fade-in-0 zoom-in-95 dark:ring-foreground/10">
        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={close}
            className="bg-secondary"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </Button>
        </div>
        <div className="mb-6 flex flex-col gap-1.5">
          <h2
            id="submit-modal-title"
            className="font-heading text-lg font-medium tracking-tight"
          >
            Submit a preset
          </h2>
          <p className="text-sm text-muted-foreground">
            Paste a preset code from{" "}
            <a
              href="https://ui.shadcn.com/create"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-foreground"
            >
              ui.shadcn.com/create
            </a>
            .
          </p>
        </div>
        <SubmitForm onClose={close} />
      </div>
    </div>
  );
}
