import { decodePreset } from "shadcn/preset";
import {
  buildRegistryTheme,
  buildScopedCssText,
} from "@/lib/domain/preset-css";
import { presetConfigToDesignSystem } from "@/lib/domain/design-system";

export function PresetStyle({
  code,
  scopeId,
}: {
  code: string;
  scopeId: string;
}) {
  const config = decodePreset(code);
  if (!config) return null;
  const { cssVars } = buildRegistryTheme(presetConfigToDesignSystem(config));
  const css = buildScopedCssText(cssVars, `[data-preset-id="${scopeId}"]`);
  // biome-ignore lint/security/noDangerouslySetInnerHtml: scoped preset CSS contains no user input
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
