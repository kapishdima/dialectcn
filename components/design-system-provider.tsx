"use client";

import clsx from "clsx";
import * as React from "react";
import { useCurrentPreset } from "@/hooks/use-current-preset";
import { presetConfigToDesignSystem } from "@/lib/domain/design-system";
import {
  buildRegistryTheme,
  buildScopedCssText,
} from "@/lib/domain/preset-css";
import { FONTS } from "@/lib/fonts";

const PREVIEW_CONTAINER_SELECTOR = "[data-preview-container]";

export function DesignSystemProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const preset = useCurrentPreset();
  const { style, theme, font, fontHeading, baseColor, menuColor, radius } =
    preset || {};

  const effectiveRadius = style === "lyra" ? "none" : radius;
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

  const registryTheme = React.useMemo(() => {
    if (!preset || !effectiveRadius) {
      return null;
    }

    return buildRegistryTheme(
      presetConfigToDesignSystem({ ...preset, radius: effectiveRadius }),
    );
  }, [preset, effectiveRadius]);

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !menuColor) {
      return;
    }

    const isInvertedMenu =
      menuColor === "inverted" || menuColor === "inverted-translucent";
    const isTranslucentMenu =
      menuColor === "default-translucent" ||
      menuColor === "inverted-translucent";
    let frameId = 0;

    const updateMenuElements = () => {
      const allElements = container.querySelectorAll<HTMLElement>(
        ".cn-menu-target, [data-menu-translucent]",
      );

      if (allElements.length === 0) {
        return;
      }

      allElements.forEach((element) => {
        element.style.transition = "none";
      });

      allElements.forEach((element) => {
        if (element.classList.contains("cn-menu-target")) {
          if (isInvertedMenu) {
            element.classList.add("dark");
          } else {
            element.classList.remove("dark");
          }
        }

        // When translucent is enabled, move from data-attr to class so styles apply.
        // When disabled, move back to a data-attr so the element stays queryable
        // for future toggles without losing its identity as a menu element.
        if (isTranslucentMenu) {
          element.classList.add("cn-menu-translucent");
          element.removeAttribute("data-menu-translucent");
        } else if (element.classList.contains("cn-menu-translucent")) {
          element.classList.remove("cn-menu-translucent");
          element.setAttribute("data-menu-translucent", "");
        }
      });

      void container.offsetHeight;
      allElements.forEach((element) => {
        element.style.transition = "";
      });
    };

    const scheduleMenuUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        updateMenuElements();
      });
    };

    updateMenuElements();

    const observer = new MutationObserver(() => {
      scheduleMenuUpdate();
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [menuColor]);

  if (
    !preset ||
    !style ||
    !theme ||
    !font ||
    !baseColor ||
    !registryTheme?.cssVars
  ) {
    return null;
  }

  const scopedCss = buildScopedCssText(
    registryTheme.cssVars,
    PREVIEW_CONTAINER_SELECTOR,
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
