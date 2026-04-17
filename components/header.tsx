import Link from "next/link";
import { HeaderUser } from "@/components/header-user";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold tracking-tight">
            dialectcn
          </Link>
          <nav className="hidden gap-1 text-sm sm:flex">
            <Button variant="ghost" size="sm" render={<Link href="/feed" />}>
              Feed
            </Button>
            <Button variant="ghost" size="sm" render={<Link href="/submit" />}>
              Submit
            </Button>
            <Button variant="ghost" size="sm" render={<Link href="/liked" />}>
              Liked
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <HeaderUser />
        </div>
      </div>
    </header>
  );
}
