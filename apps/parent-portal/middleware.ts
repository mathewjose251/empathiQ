import { NextResponse, type NextRequest } from "next/server";

import {
  hasPreviewSession,
  isPublicPreviewRoute,
  PREVIEW_SESSION_COOKIE,
} from "./app/_lib/previewAuth";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthenticated = hasPreviewSession(
    request.cookies.get(PREVIEW_SESSION_COOKIE)?.value,
  );

  if (pathname === "/login" && isAuthenticated) {
    const destination =
      request.nextUrl.searchParams.get("next") || "/admin";

    return NextResponse.redirect(new URL(destination, request.url));
  }

  if (isPublicPreviewRoute(pathname) || isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!.*\\.[\\w]+$).*)"],
};
