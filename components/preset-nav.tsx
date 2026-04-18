"use client";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ShuffleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { pickRandomPresetCodeAction } from "@/app/(actions)/presets";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  currentCode: string;
  prev: string | null;
  next: string | null;
};

const hrefFor = (code: string) => `/feed/${code}`;

export function PresetNav({ currentCode, prev, next }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const goRandom = () => {
    startTransition(async () => {
      const code = await pickRandomPresetCodeAction(currentCode);
      if (code) router.push(hrefFor(code));
    });
  };

  return (
    <div className="flex items-center">
      {prev ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous preset"
          title="Previous preset"
          render={<Link href={hrefFor(prev)} />}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Previous preset"
          disabled
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
        </Button>
      )}
      <Button
        variant="ghost"
        size="icon"
        aria-label="Random preset"
        title="Random preset"
        onClick={goRandom}
        disabled={isPending}
        className={cn(isPending && "animate-pulse")}
      >
        <HugeiconsIcon icon={ShuffleIcon} size={16} />
      </Button>
      {next ? (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Next preset"
          title="Next preset"
          render={<Link href={hrefFor(next)} />}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" aria-label="Next preset" disabled>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
        </Button>
      )}
    </div>
  );
}
