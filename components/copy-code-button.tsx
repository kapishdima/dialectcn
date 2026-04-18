"use client";

import { Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";

export function CopyCodeButton({ code }: { code: string }) {
  async function onClick() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      console.error("Failed to copy text to clipboard");
    }
  }
  return (
    <Button type="button" variant="outline" size="sm" onClick={onClick}>
      <HugeiconsIcon icon={Copy01Icon} size={16} />
      Copy code
    </Button>
  );
}
