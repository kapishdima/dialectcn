"use client";

import { useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { loginModalAtom } from "@/lib/atoms/login-modal";
import { submitModalOpenAtom } from "@/lib/atoms/submit-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

export function HeaderUser() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const openSubmit = useSetAtom(submitModalOpenAtom);
  const setLogin = useSetAtom(loginModalAtom);

  if (isPending) {
    return <div className="size-8 rounded-full bg-muted animate-pulse" />;
  }

  if (!session?.user) {
    return (
      <Button
        size="sm"
        onClick={() => setLogin({ open: true, callbackUrl: "/feed" })}
      >
        Log in
      </Button>
    );
  }

  const { user } = session;
  const initial = user.name?.charAt(0).toUpperCase() ?? "?";

  async function signOut() {
    await authClient.signOut();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
        <Avatar className="size-8">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name ?? ""} />
          ) : null}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="flex flex-col">
          <span className="text-sm">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/liked" />}>
          Your likes
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => openSubmit(true)}>
          Submit preset
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={signOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
