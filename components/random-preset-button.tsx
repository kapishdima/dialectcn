"use client";

import { ShuffleIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useTransition } from "react";
import { pickRandomPresetCodeAction } from "@/app/(actions)/presets";
import { Button } from "@/components/ui/button";
import { feedFilterParsers } from "@/lib/feed-filters";
import { cn } from "@/lib/utils";

type ButtonProps = React.ComponentProps<typeof Button>;

type Props = Omit<ButtonProps, "onClick" | "disabled" | "children"> & {
  children?: React.ReactNode;
  iconSize?: number;
  hideIcon?: boolean;
};

export function RandomPresetButton({
  children = "Random preset",
  className,
  iconSize = 14,
  hideIcon = false,
  ...props
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filters] = useQueryStates(feedFilterParsers);

  const go = () => {
    startTransition(async () => {
      const code = await pickRandomPresetCodeAction({
        source: filters.source ?? undefined,
      });
      if (code) router.push(`/feed/${code}`);
    });
  };

  return (
    <Button
      {...props}
      onClick={go}
      disabled={isPending}
      className={cn(isPending && "opacity-70", className)}
    >
      {!hideIcon ? (
        <HugeiconsIcon
          icon={ShuffleIcon}
          size={iconSize}
          strokeWidth={1.5}
          className={cn(isPending && "animate-spin")}
        />
      ) : null}
      {children}
    </Button>
  );
}
