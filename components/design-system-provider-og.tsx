import type * as React from "react";
import type { PresetConfig } from "shadcn/preset";
import type { BuiltTheme } from "@/lib/domain/preset-css";
import { flattenHexVars } from "@/app/feed/[code]/_og-colors";

type Props = {
  preset: PresetConfig;
  theme: BuiltTheme;
  fontSans: string;
  fontHeading: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export function DesignSystemProviderOG({
  theme,
  fontSans,
  fontHeading,
  children,
  style,
}: Props) {
  const vars = flattenHexVars(theme);

  const cssVarStyle: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    cssVarStyle[`--${key}`] = value;
  }
  cssVarStyle["--font-sans"] = `"${fontSans}"`;
  cssVarStyle["--font-heading"] = `"${fontHeading}"`;

  return (
    <div
      data-preview-container
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: "var(--font-sans)",
        ...cssVarStyle,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
