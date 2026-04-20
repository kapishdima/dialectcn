"use client";

import { Menu02Icon, SpiralsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HeaderUser } from "@/components/header-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { submitModalOpenAtom } from "@/lib/atoms/submit-modal";
import { SOCIAL_LINKS } from "@/lib/config/socials";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/feed", label: "Feed" },
  { href: "/liked", label: "Liked" },
];

export function Header() {
  const pathname = usePathname();
  const openSubmit = useSetAtom(submitModalOpenAtom);
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const navItemClass =
    "rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground";

  const openSubmitFromMenu = () => {
    setMenuOpen(false);
    openSubmit(true);
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center border-b bg-background/80 backdrop-blur">
      <div className="mx-0 flex w-full items-center justify-between gap-4 px-4">
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
          <div className="hidden items-center md:flex">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.key}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                title={link.label}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                )}
              >
                <HugeiconsIcon icon={link.icon} size={16} strokeWidth={1.5} />
              </a>
            ))}
          </div>
          <ThemeToggle />
          <HeaderUser />
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="md:hidden"
                />
              }
            >
              <HugeiconsIcon icon={Menu02Icon} size={18} strokeWidth={1.5} />
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xs">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation and quick actions.
                </SheetDescription>
              </SheetHeader>
              <nav
                aria-label="Mobile primary"
                className="flex flex-col gap-1 px-4 pb-4"
              >
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-md px-3 py-2 text-base text-muted-foreground hover:bg-muted hover:text-foreground",
                      isActive(item.href) && "bg-muted text-foreground",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={openSubmitFromMenu}
                  className="rounded-md px-3 py-2 text-left text-base text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Submit
                </button>
              </nav>
              <div className="mt-auto flex items-center gap-1 border-t px-4 py-3">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    title={link.label}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                    )}
                  >
                    <HugeiconsIcon
                      icon={link.icon}
                      size={18}
                      strokeWidth={1.5}
                    />
                  </a>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
