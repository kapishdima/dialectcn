import type * as React from "react";

export function Button({
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
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 18px",
        borderRadius: "var(--radius)",
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
        fontSize: 14,
        fontWeight: 500,
        minHeight: 40,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
