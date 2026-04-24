"use client";

import { useParams } from "next/navigation";
import { useMemo } from "react";
import { getBuiltTheme, getDecodedPreset } from "@/lib/domain/preset-css";
import { DesignSystemProvider } from "./design-system-provider";
import Preview02Example from "./preview";

export function PreviewSurface() {
  const params = useParams<{ code?: string }>();
  const code = params?.code;

  const preset = useMemo(() => (code ? getDecodedPreset(code) : null), [code]);
  const theme = useMemo(() => (code ? getBuiltTheme(code) : null), [code]);

  if (!code || !preset || !theme) return null;

  return (
    <DesignSystemProvider preset={preset} theme={theme}>
      <Preview02Example />
    </DesignSystemProvider>
  );
}
