"use client";

import { useSetAtom } from "jotai";
import { useEffect } from "react";
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
    return () => setCurrent(null);
  }, [code, presetId, prev, next, setCurrent]);

  return null;
}
