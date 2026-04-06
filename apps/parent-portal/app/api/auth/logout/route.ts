import { NextResponse } from "next/server";

import { PREVIEW_SESSION_COOKIE } from "../../../_lib/previewAuth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set({
    name: PREVIEW_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: new Date(0),
    path: "/",
  });

  return response;
}
