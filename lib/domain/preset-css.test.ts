import { describe, expect, test } from "bun:test";
import {
  buildCssRule,
  buildScopedCssText,
  buildThemeCssText,
} from "./preset-css";

describe("buildCssRule", () => {
  test("returns empty rule when cssVars is undefined", () => {
    expect(buildCssRule(":root")).toBe(":root {}\n");
  });

  test("returns empty rule when cssVars is empty object", () => {
    expect(buildCssRule(":root", {})).toBe(":root {}\n");
  });

  test("skips empty string values", () => {
    expect(buildCssRule(":root", { primary: "" })).toBe(":root {}\n");
  });

  test("emits a single declaration", () => {
    expect(buildCssRule(":root", { primary: "oklch(0.5 0.2 30)" })).toBe(
      ":root {\n  --primary: oklch(0.5 0.2 30);\n}\n",
    );
  });

  test("emits multiple declarations in insertion order", () => {
    expect(
      buildCssRule(":root", {
        primary: "oklch(0.5 0.2 30)",
        secondary: "oklch(0.7 0.1 90)",
      }),
    ).toBe(
      ":root {\n  --primary: oklch(0.5 0.2 30);\n  --secondary: oklch(0.7 0.1 90);\n}\n",
    );
  });

  test("accepts arbitrary selectors", () => {
    expect(buildCssRule('[data-preset-id="abc"]', { radius: "0.5rem" })).toBe(
      '[data-preset-id="abc"] {\n  --radius: 0.5rem;\n}\n',
    );
  });
});

describe("buildThemeCssText", () => {
  test("emits both :root and .dark rules even when dark is empty", () => {
    const css = buildThemeCssText({ light: { primary: "white" } });
    expect(css).toContain(":root {\n  --primary: white;\n}\n");
    expect(css).toContain(".dark {}\n");
  });

  test("merges theme + light into :root", () => {
    const css = buildThemeCssText({
      theme: { font: "Inter" },
      light: { primary: "white" },
    });
    expect(css).toContain(
      ":root {\n  --font: Inter;\n  --primary: white;\n}\n",
    );
  });

  test("light overrides theme on conflict", () => {
    const css = buildThemeCssText({
      theme: { primary: "red" },
      light: { primary: "blue" },
    });
    expect(css).toContain(":root {\n  --primary: blue;\n}\n");
    expect(css).not.toContain("--primary: red");
  });

  test("emits dark variables into .dark", () => {
    const css = buildThemeCssText({
      light: { primary: "white" },
      dark: { primary: "black" },
    });
    expect(css).toContain(".dark {\n  --primary: black;\n}\n");
  });
});

describe("buildScopedCssText", () => {
  test("applies custom selector for light and scoped .dark for dark", () => {
    const css = buildScopedCssText(
      { light: { primary: "white" }, dark: { primary: "black" } },
      '[data-preset-id="p1"]',
    );
    expect(css).toContain('[data-preset-id="p1"] {\n  --primary: white;\n}\n');
    expect(css).toContain(
      '.dark [data-preset-id="p1"], [data-preset-id="p1"].dark {\n  --primary: black;\n}\n',
    );
  });
});
