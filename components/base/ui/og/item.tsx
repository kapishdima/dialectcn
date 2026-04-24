import type * as React from "react";

export function Item({
  variant = "default",
  children,
  style,
}: {
  variant?: "default" | "muted";
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  const isMuted = variant === "muted";
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        padding: 14,
        borderRadius: "var(--radius)",
        backgroundColor: isMuted ? "var(--muted)" : "transparent",
        border: isMuted
          ? "1px solid transparent"
          : "1px solid var(--border)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function ItemContent({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function ItemDescription({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "var(--muted-foreground)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
