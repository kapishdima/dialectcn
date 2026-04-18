"use client";

import {
  ArrowUpRight01Icon,
  Copy01Icon,
  Download01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import { CopyStateIcon } from "@/components/copy-button/copy-button";
import { InstallDialog } from "@/components/install-dialog";
import { LikeButton } from "@/components/like-button";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { copyTriggerAtom } from "@/lib/atoms/preset-ui";

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
  const { state, copy } = useCopyToClipboard({});

  const trigger = useAtomValue(copyTriggerAtom);
  const lastTrigger = useRef(trigger);
  useEffect(() => {
    if (trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    copy(code);
  }, [trigger, code, copy]);

  const shadcnCreateUrl = `https://ui.shadcn.com/create?preset=${encodeURIComponent(
    code,
  )}`;

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => copy(code)}
        aria-label="Copy preset code"
        title="Copy preset code"
      >
        <CopyStateIcon
          state={state}
          idleIcon={<HugeiconsIcon icon={Copy01Icon} size={16} />}
          doneIcon={
            <HugeiconsIcon icon={Tick02Icon} size={16} strokeWidth={2} />
          }
        />
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
