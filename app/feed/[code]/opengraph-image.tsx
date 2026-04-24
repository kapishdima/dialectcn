import { ImageResponse } from "next/og";
import { DesignSystemProviderOG } from "@/components/design-system-provider-og";
import { EmptyDistributeTrack } from "@/components/preview/cards/og/empty-distribute-track";
import { ContributionHistory } from "@/components/preview/cards/og/contribution-history";
import { getBuiltTheme, getDecodedPreset } from "@/lib/domain/preset-css";
import { getPresetByCode } from "@/lib/services/presets";
import { buildHexTheme } from "./_og-colors";
import { getPresetFontFamilies, loadPresetFonts } from "./_og-fonts";

export const runtime = "nodejs";
export const alt = "dialectcn preset preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function brandedFallback() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#09090b",
        color: "#fafafa",
        fontSize: 64,
      }}
    >
      dialectcn
    </div>,
    size,
  );
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  try {
    const { code } = await params;
    const savedPreset = await getPresetByCode(code);
    if (!savedPreset) return brandedFallback();

    const preset = getDecodedPreset(savedPreset.code);
    const theme = getBuiltTheme(savedPreset.code);
    if (!preset || !theme) return brandedFallback();

    const hexTheme = buildHexTheme(theme);
    const { sans, heading } = getPresetFontFamilies(preset);
    const fonts = await loadPresetFonts(preset);

    return new ImageResponse(
      <DesignSystemProviderOG
        preset={preset}
        theme={hexTheme}
        fontSans={sans}
        fontHeading={heading}
      >
        <div
          style={{
            display: "flex",
            gap: 40,
            padding: 56,
            width: "100%",
            height: "100%",
            alignItems: "stretch",
          }}
        >
          <div style={{ display: "flex", flex: 1 }}>
            <EmptyDistributeTrack />
          </div>
          <div style={{ display: "flex", flex: 1 }}>
            <ContributionHistory />
          </div>
        </div>
      </DesignSystemProviderOG>,
      { ...size, fonts: fonts.length > 0 ? fonts : undefined },
    );
  } catch (err) {
    console.error("[opengraph-image] render failed", err);
    return brandedFallback();
  }
}
