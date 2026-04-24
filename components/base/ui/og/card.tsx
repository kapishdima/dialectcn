import type * as React from "react";

const baseStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--card)",
  color: "var(--card-foreground)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  overflow: "hidden",
};

export function Card({
  children,
  style,
}: {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return <div style={{ ...baseStyle, ...style }}>{children}</div>;
}

export function CardHeader({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        padding: "20px 24px 0 24px",
      }}
    >
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "var(--font-heading)",
        fontSize: 20,
        fontWeight: 600,
        color: "var(--card-foreground)",
        letterSpacing: -0.3,
      }}
    >
      {children}
    </div>
  );
}

export function CardDescription({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 14,
        color: "var(--muted-foreground)",
      }}
    >
      {children}
    </div>
  );
}

export function CardContent({
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
        padding: "16px 24px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CardFooter({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 24px 20px 24px",
      }}
    >
      {children}
    </div>
  );
}
