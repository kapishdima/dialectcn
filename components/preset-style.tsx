import { buildPresetCss } from "@/lib/services/presets";

export async function PresetStyle({
  code,
  scopeId,
}: {
  code: string;
  scopeId: string;
}) {
  const css = await buildPresetCss(code, `[data-preset-id="${scopeId}"]`);
  if (!css) return null;
  // biome-ignore lint/security/noDangerouslySetInnerHtml: scoped preset CSS contains no user input
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
