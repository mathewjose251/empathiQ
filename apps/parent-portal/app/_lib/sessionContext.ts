import "server-only";

import { cookies } from "next/headers";
import { PREVIEW_SESSION_COOKIE, decodeSession, type SessionPayload } from "./previewAuth";

/**
 * Read the current session from the request cookie.
 * Returns null for preview/anonymous sessions.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(PREVIEW_SESSION_COOKIE)?.value;
  if (!value) return null;
  return decodeSession(value);
}

/**
 * Resolve the teen ID to use for parent data APIs.
 *
 * Priority:
 *  1. Real DB: look up primary teen linked to the parent's profile
 *  2. Preview mode: return null (callers fall back to mock data)
 */
export async function resolveParentTeenId(): Promise<string | null> {
  const session = await getSession();

  if (!session?.parentId) return null;

  try {
    const { prisma } = await import("@empathiq/database");

    // Find primary guardian link first, then any link
    const link = await prisma.parentTeenLink.findFirst({
      where: { parentId: session.parentId },
      orderBy: { isPrimaryGuardian: "desc" },
      select: { teenId: true },
    });

    return link?.teenId ?? null;
  } catch {
    return null;
  }
}
