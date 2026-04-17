import { ADJECTIVES, NOUNS } from "@/lib/random-words";

export type Rng = () => number;

export function pickFrom<T>(arr: readonly T[], rng: Rng): T {
  const idx = Math.floor(rng() * arr.length);
  return arr[idx] as T;
}

export function pickRandomName(rng: Rng = Math.random): string {
  const adj = pickFrom(ADJECTIVES, rng);
  const noun = pickFrom(NOUNS, rng);
  return `${adj} ${noun}`;
}

export function seededRng(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0xffffffff;
  };
}
