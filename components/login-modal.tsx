"use client";

import { Cancel01Icon, SpiralsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { LoginButtons } from "@/components/login-buttons";
import { Button } from "@/components/ui/button";
import { loginModalAtom } from "@/lib/atoms/login-modal";

export function LoginModal() {
  const [state, setState] = useAtom(loginModalAtom);
  const close = () => setState((s) => ({ ...s, open: false }));

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "login") {
      const callbackUrl = params.get("callbackUrl") ?? "/feed";
      setState({ open: true, callbackUrl });
      params.delete("auth");
      params.delete("callbackUrl");
      const qs = params.toString();
      const newUrl = window.location.pathname + (qs ? `?${qs}` : "");
      window.history.replaceState(null, "", newUrl);
    }
  }, [setState]);

  useEffect(() => {
    if (!state.open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (!state.open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 isolate flex items-center justify-center p-4 duration-100 animate-in fade-in-0"
    >
      <button
        type="button"
        aria-label="Dismiss"
        onClick={close}
        className="absolute inset-0 bg-black/30 supports-backdrop-filter:backdrop-blur-sm"
      />
      <div className="relative grid w-full max-w-2xl overflow-hidden rounded-3xl bg-popover text-popover-foreground shadow-xl ring-1 ring-foreground/5 duration-100 animate-in fade-in-0 zoom-in-95 sm:grid-cols-2 dark:ring-foreground/10">
        <div className="absolute top-4 right-4 z-10">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={close}
            className="bg-secondary"
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} />
          </Button>
        </div>
        <aside className="hidden flex-col justify-between gap-6 border-r bg-muted/40 p-8 sm:flex">
          <div className="flex items-center gap-2 font-heading text-sm font-semibold tracking-tight">
            <HugeiconsIcon icon={SpiralsIcon} size={16} strokeWidth={1.5} />
            dialectcn
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-heading text-xl font-semibold tracking-tight">
              Save presets you love.
            </p>
            <p className="text-sm text-muted-foreground">
              Sign in to like presets, build a personal library, and submit
              your own codes.
            </p>
          </div>
          <ul
            role="list"
            className="flex flex-col gap-2 text-xs text-muted-foreground"
          >
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-foreground/40" />
              Like and save to revisit later
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-foreground/40" />
              Submit presets to the feed
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-foreground/40" />
              No password — social auth only
            </li>
          </ul>
        </aside>
        <div className="flex flex-col gap-5 p-6 sm:p-8">
          <div className="flex flex-col gap-1.5">
            <h2
              id="login-modal-title"
              className="font-heading text-lg font-medium tracking-tight"
            >
              Log in
            </h2>
            <p className="text-sm text-muted-foreground">
              Continue with your provider of choice.
            </p>
          </div>
          <LoginButtons callbackUrl={state.callbackUrl} />
          <p className="text-[11px] text-muted-foreground">
            By continuing you agree to be a good citizen of the dialectcn
            community.
          </p>
        </div>
      </div>
    </div>
  );
}
