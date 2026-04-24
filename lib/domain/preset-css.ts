import { getBaseColor } from "./base-colors";
import { getTheme, } from "./theme"
import { DesignSystemConfig } from "./design-system";

export type RegistryThemeCssVars = {
  theme?: Record<string, string>;
  light?: Record<string, string>;
  dark?: Record<string, string>;
};

export function buildCssRule(
  selector: string,
  cssVars?: Record<string, string>,
): string {
  const declarations = Object.entries(cssVars ?? {})
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");

  if (!declarations) {
    return `${selector} {}\n`;
  }

  return `${selector} {\n${declarations}\n}\n`;
}

export function buildThemeCssText(cssVars: RegistryThemeCssVars): string {
  return [
    buildCssRule(":root", {
      ...(cssVars.theme ?? {}),
      ...(cssVars.light ?? {}),
    }),
    buildCssRule(".dark", cssVars.dark),
  ].join("\n");
}

export function buildScopedCssText(
  cssVars: RegistryThemeCssVars,
  selector: string,
): string {
  return [
    buildCssRule(selector, {
      ...(cssVars.theme ?? {}),
      ...(cssVars.light ?? {}),
    }),
    buildCssRule(`.dark ${selector}, ${selector}.dark`, cssVars.dark),
  ].join("\n");
}

// Builds a registry:theme item from a design system config.
export function buildRegistryTheme(config: DesignSystemConfig) {
  const RADII = [
    { name: "default", label: "Default", value: "" },
    { name: "none", label: "None", value: "0" },
    { name: "small", label: "Small", value: "0.45rem" },
    { name: "medium", label: "Medium", value: "0.625rem" },
    { name: "large", label: "Large", value: "0.875rem" },
  ] as const

  const baseColor = getBaseColor(config.baseColor)
  const theme = getTheme(config.theme)

  if (!baseColor || !theme) {
    throw new Error(
      `Base color "${config.baseColor}" or theme "${config.theme}" not found`
    )
  }

  // Merge base color and theme CSS vars.
  const lightVars: Record<string, string> = {
    ...(baseColor.cssVars?.light as Record<string, string>),
    ...(theme.cssVars?.light as Record<string, string>),
  }
  const darkVars: Record<string, string> = {
    ...(baseColor.cssVars?.dark as Record<string, string>),
    ...(theme.cssVars?.dark as Record<string, string>),
  }
  const themeVars: Record<string, string> = {}

  // Apply chart color override.
  const chartTheme = getTheme(config.chartColor)
  if (chartTheme) {
    const chartLight = chartTheme.cssVars?.light as Record<string, string>
    const chartDark = chartTheme.cssVars?.dark as Record<string, string>
    for (let i = 1; i <= 5; i++) {
      const key = `chart-${i}`
      if (chartLight?.[key]) lightVars[key] = chartLight[key]
      if (chartDark?.[key]) darkVars[key] = chartDark[key]
    }
  }

  // Apply menu accent transformation.
  if (config.menuAccent === "bold") {
    lightVars.accent = lightVars.primary
    lightVars["accent-foreground"] = lightVars["primary-foreground"]
    darkVars.accent = darkVars.primary
    darkVars["accent-foreground"] = darkVars["primary-foreground"]
    // lightVars["sidebar-accent"] = lightVars.primary
    // lightVars["sidebar-accent-foreground"] = lightVars["primary-foreground"]
    // darkVars["sidebar-accent"] = darkVars.primary
    // darkVars["sidebar-accent-foreground"] = darkVars["primary-foreground"]
  }

  // Apply radius transformation.
  if (config.radius && config.radius !== "default") {
    const radius = RADII.find((r) => r.name === config.radius)
    if (radius?.value) {
      lightVars.radius = radius.value
    }
  }

  return {
    name: `${config.baseColor}-${config.theme}`,
    type: "registry:theme" as const,
    cssVars: {
      theme: Object.keys(themeVars).length > 0 ? themeVars : undefined,
      light: lightVars,
      dark: darkVars,
    },
  }
}
