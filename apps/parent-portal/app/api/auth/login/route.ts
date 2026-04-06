import { NextResponse } from "next/server";

import {
  isValidPreviewLogin,
  PREVIEW_SESSION_COOKIE,
  PREVIEW_SESSION_VALUE,
} from "../../../_lib/previewAuth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  if (!isValidPreviewLogin(username, password)) {
    return NextResponse.json(
      { success: false, error: "Invalid username or password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    success: true,
    user: username,
  });

  response.cookies.set({
    name: PREVIEW_SESSION_COOKIE,
    value: PREVIEW_SESSION_VALUE,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return response;
}
