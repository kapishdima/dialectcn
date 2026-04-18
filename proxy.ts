import { type NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
];

export function proxy(req: NextRequest) {
  const hasSession = SESSION_COOKIE_NAMES.some((name) => req.cookies.has(name));
  if (!hasSession) {
    const url = new URL("/feed", req.url);
    url.searchParams.set("auth", "login");
    url.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/liked/:path*"],
};
