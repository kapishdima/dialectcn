import { describe, expect, test } from "bun:test";
import { ADJECTIVES, NOUNS } from "@/lib/random-words";
import { pickRandomName, seededRng } from "./random-name";

describe("seededRng", () => {
  test("is deterministic for a given seed", () => {
    const a = seededRng(42);
    const b = seededRng(42);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBe(b());
    }
  });

  test("produces values in [0, 1)", () => {
    const rng = seededRng(1);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("pickRandomName", () => {
  test("returns '<adjective> <noun>' with both parts from known lists", () => {
    const adjSet = new Set<string>(ADJECTIVES);
    const nounSet = new Set<string>(NOUNS);
    for (let seed = 0; seed < 50; seed++) {
      const name = pickRandomName(seededRng(seed));
      const parts = name.split(" ");
      expect(parts.length).toBeGreaterThanOrEqual(2);
      const adj = parts[0] as string;
      const noun = parts.slice(1).join(" ");
      expect(adjSet.has(adj)).toBe(true);
      expect(nounSet.has(noun)).toBe(true);
    }
  });

  test("is deterministic for a seeded rng", () => {
    const a = pickRandomName(seededRng(123));
    const b = pickRandomName(seededRng(123));
    expect(a).toBe(b);
  });

  test("works with default Math.random", () => {
    const name = pickRandomName();
    expect(typeof name).toBe("string");
    expect(name.length).toBeGreaterThan(0);
  });
});
