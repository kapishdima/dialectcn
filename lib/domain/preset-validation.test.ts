import { describe, expect, test } from "bun:test";
import { generateRandomPreset } from "shadcn/preset";
import { isValidCode, submitPresetSchema } from "./preset-validation";

describe("isValidCode", () => {
  test("rejects empty string", () => {
    expect(isValidCode("")).toBe(false);
  });

  test("rejects non-string", () => {
    // @ts-expect-error intentionally wrong type
    expect(isValidCode(null)).toBe(false);
    // @ts-expect-error intentionally wrong type
    expect(isValidCode(undefined)).toBe(false);
  });

  test("rejects non-base62 characters", () => {
    expect(isValidCode("not a valid code!!!")).toBe(false);
  });

  test("accepts code produced by generateRandomPreset", () => {
    const code = generateRandomPreset();
    expect(isValidCode(code)).toBe(true);
  });
});

describe("submitPresetSchema", () => {
  const validCode = generateRandomPreset();

  test("accepts valid payload", () => {
    const result = submitPresetSchema.safeParse({
      code: validCode,
      name: "My preset",
      description: "A nice preset",
    });
    expect(result.success).toBe(true);
  });

  test("trims whitespace around fields", () => {
    const result = submitPresetSchema.safeParse({
      code: `  ${validCode}  `,
      name: "  My preset  ",
      description: "  A nice preset  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe(validCode);
      expect(result.data.name).toBe("My preset");
      expect(result.data.description).toBe("A nice preset");
    }
  });

  test("converts empty description to undefined", () => {
    const result = submitPresetSchema.safeParse({
      code: validCode,
      name: "My preset",
      description: "",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBeUndefined();
    }
  });

  test("rejects invalid code", () => {
    const result = submitPresetSchema.safeParse({
      code: "not-a-code!!",
      name: "My preset",
    });
    expect(result.success).toBe(false);
  });

  test("rejects missing name", () => {
    const result = submitPresetSchema.safeParse({
      code: validCode,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  test("rejects oversized name", () => {
    const result = submitPresetSchema.safeParse({
      code: validCode,
      name: "x".repeat(51),
    });
    expect(result.success).toBe(false);
  });

  test("rejects oversized description", () => {
    const result = submitPresetSchema.safeParse({
      code: validCode,
      name: "My preset",
      description: "x".repeat(201),
    });
    expect(result.success).toBe(false);
  });
});
