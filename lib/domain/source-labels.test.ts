import { describe, expect, test } from "bun:test";
import {
  isPresetSort,
  isPresetSource,
  PRESET_SORTS,
  PRESET_SOURCES,
  sourceLabel,
} from "./source-labels";

describe("sourceLabel", () => {
  test("maps each source to its label", () => {
    expect(sourceLabel("brand")).toBe("Brand");
    expect(sourceLabel("community")).toBe("Community");
    expect(sourceLabel("random")).toBe("Random");
  });
});

describe("isPresetSource", () => {
  test("accepts known sources", () => {
    for (const s of PRESET_SOURCES) {
      expect(isPresetSource(s)).toBe(true);
    }
  });

  test("rejects unknown values", () => {
    expect(isPresetSource("all")).toBe(false);
    expect(isPresetSource("")).toBe(false);
    expect(isPresetSource("BRAND")).toBe(false);
  });
});

describe("isPresetSort", () => {
  test("accepts known sorts", () => {
    for (const s of PRESET_SORTS) {
      expect(isPresetSort(s)).toBe(true);
    }
  });

  test("rejects unknown values", () => {
    expect(isPresetSort("asc")).toBe(false);
    expect(isPresetSort("")).toBe(false);
  });
});
