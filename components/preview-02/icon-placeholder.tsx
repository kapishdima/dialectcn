"use client";

import { DynamicIcon, type IconName } from "lucide-react/dynamic";

type Props = {
  lucide?: string;
  tabler?: string;
  hugeicons?: string;
  phosphor?: string;
  remixicon?: string;
  className?: string;
  size?: number | string;
  strokeWidth?: number | string;
};

function pascalToKebab(name: string): string {
  const stripped = name.endsWith("Icon") ? name.slice(0, -4) : name;
  return stripped
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export function IconPlaceholder({
  lucide,
  className,
  size,
  strokeWidth,
}: Props) {
  if (!lucide) return null;
  const name = pascalToKebab(lucide) as IconName;
  return (
    <DynamicIcon
      name={name}
      className={className}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}
