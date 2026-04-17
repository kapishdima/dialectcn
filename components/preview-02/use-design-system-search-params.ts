"use client";

type DesignSystemParams = {
  style: string;
  selectedRange: string;
};

type Setter = (next: Partial<DesignSystemParams>) => void;

const DEFAULTS: DesignSystemParams = {
  style: "nova",
  selectedRange: "1m",
};

export function useDesignSystemSearchParams(): [DesignSystemParams, Setter] {
  return [DEFAULTS, () => {}];
}
