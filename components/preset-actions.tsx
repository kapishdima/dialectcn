"use client";

import {
  ArrowUpRight01Icon,
  Copy01Icon,
  Download01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";
import { InstallDialog } from "@/components/install-dialog";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";

export function PresetActions({
  code,
  presetId,
  initialLiked,
  initialLikes,
}: {
  code: string;
  presetId: string;
  initialLiked: boolean;
  initialLikes: number;
}) {
  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Preset code copied");
    } catch {
      toast.error("Failed to copy");
    }
  }

  const shadcnCreateUrl = `https://ui.shadcn.com/create?preset=${encodeURIComponent(
    code,
  )}`;

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={copyCode}
        aria-label="Copy preset code"
        title="Copy preset code"
      >
        <HugeiconsIcon icon={Copy01Icon} size={16} />
      </Button>

      <InstallDialog
        code={code}
        trigger={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Install command"
            title="Install command"
          >
            <HugeiconsIcon icon={Download01Icon} size={16} />
          </Button>
        }
      />

      <Button
        variant="ghost"
        size="icon"
        aria-label="Open in shadcn/create"
        title="Open in shadcn/create"
        // biome-ignore lint/a11y/useAnchorContent: Button children become anchor content via Base UI render prop
        render={<a href={shadcnCreateUrl} target="_blank" rel="noreferrer" />}
      >
        <HugeiconsIcon icon={ArrowUpRight01Icon} size={16} />
      </Button>

      <LikeButton
        presetId={presetId}
        initialLiked={initialLiked}
        initialCount={initialLikes}
      />
    </div>
  );
}
