"use client";

import { SpiralsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeaderUser } from "@/components/header-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { submitModalOpenAtom } from "@/lib/atoms/submit-modal";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/liked", label: "Liked" },
];

export function Header() {
  const pathname = usePathname();
  const openSubmit = useSetAtom(submitModalOpenAtom);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navItemClass =
    "rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground";

  return (
    <header className="sticky top-0 w-full z-40 flex h-14 items-center border-b bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 mx-0 w-full">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight"
        >
          <HugeiconsIcon
            icon={SpiralsIcon}
            size={14}
            color="currentColor"
            strokeWidth={1.5}
          />
          dialectcn
        </Link>
        <div className="flex items-center gap-1">
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 text-sm md:flex "
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  navItemClass,
                  isActive(item.href) && "bg-muted text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => openSubmit(true)}
              className={navItemClass}
            >
              Submit
            </button>
          </nav>
          <span
            aria-hidden="true"
            className="mx-1 hidden h-5 w-px bg-border md:block"
          />
          <ThemeToggle />
          <HeaderUser />
        </div>
      </div>
    </header>
  );
}
