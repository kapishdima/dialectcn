import { GithubIcon, NewTwitterIcon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export type SocialLink = {
  key: "github" | "x";
  label: string;
  href: string;
  icon: IconSvgElement;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/kapishdima/dialectcn",
    icon: GithubIcon,
  },
  {
    key: "x",
    label: "X",
    href: "https://x.com/kapish_dima",
    icon: NewTwitterIcon,
  },
];
