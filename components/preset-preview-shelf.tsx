"use client";

import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { currentPresetAtom } from "@/lib/atoms/current-preset";
import { cn } from "@/lib/utils";

const CACHE_SIZE = 5;
const PREVIEW_BASE = "https://ui.shadcn.com/preview/radix/preview-02";

export function PresetPreviewShelf() {
  const current = useAtomValue(currentPresetAtom);
  const activeCode = current?.code ?? null;

  const [cache, setCache] = useState<string[]>([]);
  const [prevActive, setPrevActive] = useState<string | null>(null);
  const [loadedSet, setLoadedSet] = useState<Set<string>>(() => new Set());
  const lastActiveRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activeCode) return;
    const previous = lastActiveRef.current;
    if (previous === activeCode) return;
    lastActiveRef.current = activeCode;
    setPrevActive(previous);
    setCache((old) => {
      const next = [activeCode, ...old.filter((c) => c !== activeCode)];
      return next.slice(0, CACHE_SIZE);
    });
  }, [activeCode]);

  const onLoaded = useCallback((code: string) => {
    setLoadedSet((prev) => {
      if (prev.has(code)) return prev;
      const next = new Set(prev);
      next.add(code);
      return next;
    });
  }, []);

  if (!activeCode) return null;

  const activeLoaded = loadedSet.has(activeCode);
  const topCode = activeLoaded ? activeCode : (prevActive ?? activeCode);

  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
      {cache.map((code) => (
        <PreviewSlot
          key={code}
          code={code}
          isTop={code === topCode}
          onLoaded={onLoaded}
        />
      ))}
    </div>
  );
}

type SlotProps = {
  code: string;
  isTop: boolean;
  onLoaded: (code: string) => void;
};

function PreviewSlot({ code, isTop, onLoaded }: SlotProps) {
  const handleLoad = useCallback(() => onLoaded(code), [onLoaded, code]);
  return (
    <iframe
      src={`${PREVIEW_BASE}?preset=${encodeURIComponent(code)}`}
      title="Preset preview"
      onLoad={handleLoad}
      aria-hidden={!isTop}
      className={cn(
        "absolute inset-0 size-full border-0 transition-opacity duration-200",
        isTop ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none",
      )}
    />
  );
}
