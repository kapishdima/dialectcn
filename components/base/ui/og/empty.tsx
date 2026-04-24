import type * as React from "react";

export function Empty({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        flex: 1,
        gap: 20,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

export function EmptyMedia({
  variant = "default",
  children,
}: {
  variant?: "default" | "icon";
  children?: React.ReactNode;
}) {
  const isIcon = variant === "icon";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: isIcon ? 48 : 72,
        height: isIcon ? 48 : 72,
        borderRadius: 12,
        backgroundColor: "var(--muted)",
        border: "1px solid var(--border)",
        color: "var(--muted-foreground)",
      }}
    >
      {children}
    </div>
  );
}

export function EmptyHeader({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        maxWidth: 320,
      }}
    >
      {children}
    </div>
  );
}

export function EmptyTitle({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: "var(--font-heading)",
        fontSize: 22,
        fontWeight: 600,
        color: "var(--foreground)",
        letterSpacing: -0.4,
      }}
    >
      {children}
    </div>
  );
}

export function EmptyDescription({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 15,
        lineHeight: 1.5,
        color: "var(--muted-foreground)",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

export function EmptyContent({ children }: { children?: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
    </div>
  );
}
