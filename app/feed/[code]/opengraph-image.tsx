import { ImageResponse } from "next/og";
import { getPresetByCode, resolvePresetConfig } from "@/lib/services/presets";

export const runtime = "nodejs";
export const alt = "dialectcn preset preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const SWATCH_COLORS = [
  "#0ea5e9",
  "#6366f1",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#eab308",
];

export default async function OgImage({
  params,
}: {
  params: { code: string };
}) {
  const preset = await getPresetByCode(params.code);
  if (!preset) {
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

  const config = resolvePresetConfig(preset.code);
  const displayName = preset.name ?? preset.code.slice(0, 12);
  const sub = preset.description ?? "A shadcn preset";

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        padding: 64,
        background: "#0a0a0a",
        color: "#f5f5f5",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", fontSize: 28, opacity: 0.7 }}>
        dialectcn
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "auto",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", fontSize: 84, fontWeight: 600 }}>
          {displayName}
        </div>
        <div style={{ display: "flex", fontSize: 32, opacity: 0.75 }}>
          {sub}
        </div>
        <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
          {SWATCH_COLORS.map((color) => (
            <div
              key={color}
              style={{
                width: 96,
                height: 96,
                background: color,
                borderRadius: 16,
                display: "flex",
              }}
            />
          ))}
        </div>
        {config ? (
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 24,
              fontSize: 22,
              opacity: 0.65,
            }}
          >
            <span>font: {config.font}</span>
            <span>radius: {config.radius}</span>
            <span>theme: {config.theme}</span>
          </div>
        ) : null}
      </div>
    </div>,
    size,
  );
}
