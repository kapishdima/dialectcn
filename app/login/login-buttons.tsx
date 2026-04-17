"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function LoginButtons({ callbackUrl }: { callbackUrl: string }) {
  async function signIn(provider: "github" | "google") {
    await authClient.signIn.social({ provider, callbackURL: callbackUrl });
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <Button type="button" onClick={() => signIn("github")} className="w-full">
        Continue with GitHub
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => signIn("google")}
        className="w-full"
      >
        Continue with Google
      </Button>
    </div>
  );
}
