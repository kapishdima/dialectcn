"use client";

import { FavouriteIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { toggleLikeAction } from "@/app/(actions)/like";
import { Button } from "@/components/ui/button";
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

  function onClick() {
    const next = !state.liked;
    startTransition(async () => {
      apply(next);
      const res = await toggleLikeAction(presetId);
      if (res.status === "unauthorized") {
        toast.error("Log in to like presets");
      }
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={showCount ? "sm" : size}
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
      {showCount ? <span>{state.count}</span> : null}
    </Button>
  );
}
