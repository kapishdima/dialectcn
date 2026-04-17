import type { RegistryThemeCssVars } from "@/lib/domain/preset-css";

const REGISTRY = "https://ui.shadcn.com/r/colors";

type ShadcnColorsPayload = {
  cssVars?: RegistryThemeCssVars;
  cssVarsV4?: RegistryThemeCssVars;
};

const memo = new Map<string, Promise<RegistryThemeCssVars>>();

async function fetchBaseColor(
  baseColor: string,
): Promise<RegistryThemeCssVars> {
  try {
    const res = await fetch(`${REGISTRY}/${baseColor}.json`, {
      next: { revalidate: 60 * 60 * 24 * 7 },
    });
    if (!res.ok) return {};
    const data = (await res.json()) as ShadcnColorsPayload;
    return data.cssVarsV4 ?? data.cssVars ?? {};
  } catch {
    return {};
  }
}

export function getBaseColorVars(
  baseColor: string,
): Promise<RegistryThemeCssVars> {
  const existing = memo.get(baseColor);
  if (existing) return existing;
  const promise = fetchBaseColor(baseColor);
  memo.set(baseColor, promise);
  return promise;
}
