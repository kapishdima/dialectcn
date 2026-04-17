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
