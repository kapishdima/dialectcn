"use client";

import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useOptimistic, useRef, useTransition } from "react";
import { toggleLikeAction } from "@/app/(actions)/like";
import { Button } from "@/components/ui/button";
import { loginModalAtom } from "@/lib/atoms/login-modal";
import { likeTriggerAtom } from "@/lib/atoms/preset-ui";
import { cn } from "@/lib/utils";

type State = { liked: boolean; count: number };

export function LikeButton({
  presetId,
  initialLiked,
  initialCount,
  variant = "ghost",
  size = "icon",
  showCount = false,
}: {
  presetId: string;
  initialLiked: boolean;
  initialCount: number;
  variant?: "ghost" | "outline" | "default" | "secondary";
  size?: "icon" | "sm" | "default";
  showCount?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [state, apply] = useOptimistic<State, boolean>(
    { liked: initialLiked, count: initialCount },
    (prev, next) => ({
      liked: next,
      count: next ? prev.count + 1 : Math.max(prev.count - 1, 0),
    }),
  );
  const setLogin = useSetAtom(loginModalAtom);

  function onClick() {
    const next = !state.liked;
    startTransition(async () => {
      apply(next);
      const res = await toggleLikeAction(presetId);
      if (res.status === "unauthorized") {
        setLogin({
          open: true,
          callbackUrl:
            typeof window !== "undefined"
              ? window.location.pathname + window.location.search
              : "/feed",
        });
      }
    });
  }

  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;
  const trigger = useAtomValue(likeTriggerAtom);
  const lastTrigger = useRef(trigger);
  useEffect(() => {
    if (trigger === lastTrigger.current) return;
    lastTrigger.current = trigger;
    onClickRef.current();
  }, [trigger]);

  return (
    <Button
      type="button"
      variant={variant}
      size="xs"
      aria-pressed={state.liked}
      onClick={onClick}
      disabled={isPending}
      className={cn(state.liked && "text-red-500")}
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        size={16}
        className={cn(state.liked && "fill-current")}
      />
      <span>{state.count}</span>
    </Button>
  );
}
