import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 py-16 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">Not found</h1>
      <p className="text-sm text-muted-foreground">
        That preset doesn't live here.
      </p>
      <Button render={<Link href="/feed" />}>Back to feed</Button>
    </div>
  );
}
