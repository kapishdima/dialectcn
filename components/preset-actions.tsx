"use client";

import {
  ArrowUpRight01Icon,
  Copy01Icon,
  Download01Icon,
  Share01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtomValue } from "jotai";
import { type ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import { CopyStateIcon } from "@/components/copy-button/copy-button";
import { InstallDialog } from "@/components/install-dialog";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { copyTriggerAtom } from "@/lib/atoms/preset-ui";

export function PresetActions({
  code,
  likeSlot,
}: {
  code: string;
  likeSlot: ReactNode;
}) {
  const { state, copy } = useCopyToClipboard({});

  const trigger = useAtomValue(copyTriggerAtom);
  const lastTrigger = useRef(trigger);
  useEffect(() => {
    if (trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    copy(code);
  }, [trigger, code, copy]);

  const shadcnCreateUrl = useMemo(
    () => `https://ui.shadcn.com/create?preset=${encodeURIComponent(code)}`,
    [code],
  );

  const onCopy = useCallback(() => copy(code), [copy, code]);

  const shareOnX = useCallback(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/feed/${encodeURIComponent(code)}`;
    const text = `--preset=${code}`;
    const intent = `https://x.com/intent/post?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(intent, "_blank", "noopener,noreferrer");
  }, [code]);

  return (
    <div className="flex items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        onClick={onCopy}
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
        onClick={shareOnX}
        aria-label="Share on X"
        title="Share on X"
      >
        <HugeiconsIcon icon={Share01Icon} size={16} />
      </Button>

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

      {likeSlot}
    </div>
  );
}
