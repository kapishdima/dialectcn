"use client";

import clsx from "clsx";
import * as React from "react";
import type { PresetConfig } from "shadcn/preset";
import { type BuiltTheme, buildScopedCssText } from "@/lib/domain/preset-css";
import { FONTS } from "@/lib/fonts";

const PREVIEW_CONTAINER_SELECTOR = "[data-preview-container]";

type Props = {
  preset: PresetConfig;
  theme: BuiltTheme;
  children: React.ReactNode;
};

export function DesignSystemProvider({ preset, theme, children }: Props) {
  const { style, font, fontHeading, baseColor } = preset;

  const selectedFont = React.useMemo(
    () => FONTS.find((fontOption) => fontOption.value === font),
    [font],
  );
  const selectedHeadingFont = React.useMemo(() => {
    if (fontHeading === "inherit" || fontHeading === font) {
      return selectedFont;
    }

    return FONTS.find((fontOption) => fontOption.value === fontHeading);
  }, [font, fontHeading, selectedFont]);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const scopedCss = React.useMemo(
    () =>
      theme?.cssVars
        ? buildScopedCssText(theme.cssVars, PREVIEW_CONTAINER_SELECTOR)
        : "",
    [theme],
  );

  const inlineStyle: React.CSSProperties = {};
  if (selectedFont) {
    (inlineStyle as Record<string, string>)["--font-sans"] =
      selectedFont.font.style.fontFamily;
  }
  if (selectedHeadingFont) {
    (inlineStyle as Record<string, string>)["--font-heading"] =
      selectedHeadingFont.font.style.fontFamily;
  }

  return (
    <div
      ref={containerRef}
      data-preview-container
      className={clsx(
        `style-${style}`,
        `base-color-${baseColor}`,
        "relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden",
      )}
      style={inlineStyle}
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: scoped preset CSS contains no user input */}
      <style dangerouslySetInnerHTML={{ __html: scopedCss }} />
      {children}
    </div>
  );
}
