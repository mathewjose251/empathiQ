import { NextResponse } from "next/server";
import { createHash } from "crypto";

import {
  isValidPreviewLogin,
  encodeSession,
  PREVIEW_SESSION_COOKIE,
  PREVIEW_SESSION_VALUE,
} from "../../../_lib/previewAuth";

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  maxAge: 60 * 60 * 8, // 8 hours
  path: "/",
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;

  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  // ── Try real DB auth when DATABASE_URL is set ──────────────────────────
  if (process.env.DATABASE_URL) {
    try {
      const { prisma } = await import("@empathiq/database");

      // username field maps to email in User model
      const user = await prisma.user.findUnique({
        where: { email: username },
        include: { parentProfile: true },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 },
        );
      }

      // Compare SHA-256 hash (simple scheme — swap for bcrypt in production)
      const hash = sha256(password);
      if (hash !== user.passwordHash) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 },
        );
      }

      const sessionValue = encodeSession({
        userId: user.id,
        role: user.role,
        parentId: user.parentProfile?.id ?? null,
        displayName: user.displayName,
      });

      const response = NextResponse.json({
        success: true,
        user: user.displayName,
        role: user.role,
      });

      response.cookies.set({ name: PREVIEW_SESSION_COOKIE, value: sessionValue, ...COOKIE_OPTS });
      return response;
    } catch (err) {
      console.error("DB auth failed, falling back to preview credentials:", err);
      // Fall through to preview auth below
    }
  }

  // ── Preview / env-var auth fallback ──────────────────────────────────────
  if (!isValidPreviewLogin(username, password)) {
    return NextResponse.json(
      { success: false, error: "Invalid username or password." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true, user: username });
  response.cookies.set({ name: PREVIEW_SESSION_COOKIE, value: PREVIEW_SESSION_VALUE, ...COOKIE_OPTS });
  return response;
}
