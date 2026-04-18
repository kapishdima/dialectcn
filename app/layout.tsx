import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { DM_Sans, Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { GlobalHotkeys } from "@/components/global-hotkeys";
import { LoginModal } from "@/components/login-modal";
import { SubmitModal } from "@/components/submit-modal";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import "./globals.css";

const spaceGroteskHeading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
});
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "dialectcn — Curated shadcn presets",
    template: "%s · dialectcn",
  },
  description:
    "Browse brand-inspired, community-submitted, and randomly generated shadcn presets.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-dvh antialiased",
        "font-sans",
        geistSans.variable,
        geistMono.variable,
        dmSans.variable,
        spaceGroteskHeading.variable,
      )}
    >
      <body className="flex h-dvh flex-col overflow-hidden bg-background text-foreground">
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider>
              <main className="flex min-h-0 flex-1 flex-col">{children}</main>
              <SubmitModal />
              <LoginModal />
              <GlobalHotkeys />
              <Toaster />
            </TooltipProvider>
          </ThemeProvider>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
