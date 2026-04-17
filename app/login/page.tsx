import { redirect } from "next/navigation";
import { LoginButtons } from "@/app/login/login-buttons";
import { getCurrentUser } from "@/lib/services/auth";

export const metadata = { title: "Log in — dialectcn" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;
  const user = await getCurrentUser();
  if (user) redirect(callbackUrl ?? "/feed");

  return (
    <div className="container mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center gap-6 py-12">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Log in to dialectcn
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in with GitHub or Google to like presets and track your
          favorites.
        </p>
      </div>
      <LoginButtons callbackUrl={callbackUrl ?? "/feed"} />
    </div>
  );
}
