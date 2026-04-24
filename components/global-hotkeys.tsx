"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useEffect } from "react";
import { pickRandomPresetCodeAction } from "@/app/(actions)/presets";
import { currentPresetAtom } from "@/lib/atoms/current-preset";
import {
  copyTriggerAtom,
  helpOpenAtom,
  installDialogOpenAtom,
  likeTriggerAtom,
  sidebarHiddenAtom,
} from "@/lib/atoms/preset-ui";
import { feedFilterParsers } from "@/lib/feed-filters";

const HOTKEYS = new Set(["j", "k", "r", "c", "i", "o", "l"]);

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
  if (target.isContentEditable) return true;
  return false;
}

export function GlobalHotkeys() {
  const preset = useAtomValue(currentPresetAtom);
  const setInstallOpen = useSetAtom(installDialogOpenAtom);
  const setHelpOpen = useSetAtom(helpOpenAtom);
  const setSidebarHidden = useSetAtom(sidebarHiddenAtom);
  const bumpLike = useSetAtom(likeTriggerAtom);
  const bumpCopy = useSetAtom(copyTriggerAtom);
  const router = useRouter();
  const [filters] = useQueryStates(feedFilterParsers);

  useEffect(() => {
    function onGlobalKey(e: KeyboardEvent) {
      if (isTypingTarget(e.target)) return;

      if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        if (e.key.toLowerCase() === "b") {
          e.preventDefault();
          setSidebarHidden((hidden) => !hidden);
        }
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "?") {
        e.preventDefault();
        setHelpOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, [setHelpOpen, setSidebarHidden]);

  useEffect(() => {
    if (!preset) return;

    function onKey(e: KeyboardEvent) {
      if (!preset) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (!HOTKEYS.has(key)) return;
      if (isTypingTarget(e.target)) return;

      e.preventDefault();

      switch (key) {
        case "j":
          if (preset.prev) router.push(`/feed/${preset.prev}`);
          break;
        case "k":
          if (preset.next) router.push(`/feed/${preset.next}`);
          break;
        case "r":
          pickRandomPresetCodeAction({
            exclude: preset.code,
            source: filters.source ?? undefined,
          }).then((code) => {
            if (code) router.push(`/feed/${code}`);
          });
          break;
        case "c":
          bumpCopy((n) => n + 1);
          break;
        case "i":
          setInstallOpen(true);
          break;
        case "o":
          window.open(
            `https://ui.shadcn.com/create?preset=${encodeURIComponent(preset.code)}`,
            "_blank",
            "noreferrer",
          );
          break;
        case "l":
          bumpLike((n) => n + 1);
          break;
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [preset, router, setInstallOpen, bumpLike, bumpCopy, filters.source]);

  return null;
}
