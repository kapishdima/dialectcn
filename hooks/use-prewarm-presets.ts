import { useEffect } from "react";
import { getBuiltTheme } from "@/lib/domain/preset-css";

export function usePrewarmPresets(codes: Array<string | null | undefined>) {
  const key = codes.filter(Boolean).join("|");

  useEffect(() => {
    const warm = () => {
      for (const code of key.split("|")) {
        if (code) getBuiltTheme(code);
      }
    };

    if (typeof requestIdleCallback === "function") {
      const id = requestIdleCallback(warm);
      return () => cancelIdleCallback(id);
    }

    const id = setTimeout(warm, 0);
    return () => clearTimeout(id);
  }, [key]);
}
