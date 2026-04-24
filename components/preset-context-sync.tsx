"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { usePrewarmPresets } from "@/hooks/use-prewarm-presets";
import { currentPresetAtom } from "@/lib/atoms/current-preset";

type Props = {
  code: string;
  presetId: string;
  prev: string | null;
  next: string | null;
};

export function PresetContextSync({ code, presetId, prev, next }: Props) {
  const setCurrent = useSetAtom(currentPresetAtom);

  useEffect(() => {
    setCurrent({ code, presetId, prev, next });
  }, [code, presetId, prev, next, setCurrent]);

  usePrewarmPresets([prev, next]);

  return null;
}
