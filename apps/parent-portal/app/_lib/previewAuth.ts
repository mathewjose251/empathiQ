export const PREVIEW_SESSION_COOKIE = "empathiq_preview_session";
export const PREVIEW_SESSION_VALUE = "preview-authenticated";

export const PREVIEW_USERNAME =
  process.env.PREVIEW_LOGIN_USERNAME ?? "testuser";
export const PREVIEW_PASSWORD =
  process.env.PREVIEW_LOGIN_PASSWORD ?? "betternow";

// ─── Session payload ──────────────────────────────────────────────────────
// When a real DB user logs in we store a JSON payload as the cookie value.
// The preview fallback stores the plain PREVIEW_SESSION_VALUE string.

export interface SessionPayload {
  userId: string;
  role: string;        // UserRole enum value
  parentId: string | null;  // ParentProfile.id, null for non-parent roles
  displayName: string;
}

export function encodeSession(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function decodeSession(value: string): SessionPayload | null {
  if (value === PREVIEW_SESSION_VALUE) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8")) as SessionPayload;
  } catch {
    return null;
  }
}

const PUBLIC_EXACT_PATHS = new Set([
  "/login",
  "/survey/teen",
  "/survey/tween",
  "/survey/parent",
]);

const PUBLIC_PREFIXES = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/survey/teen",
  "/api/survey/tween",
  "/api/survey/parent",
  "/_next",
];

const PUBLIC_FILES = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

export function isPublicPreviewRoute(pathname: string) {
  if (PUBLIC_EXACT_PATHS.has(pathname) || PUBLIC_FILES.has(pathname)) {
    return true;
  }

  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function isValidPreviewLogin(username: string, password: string) {
  return username === PREVIEW_USERNAME && password === PREVIEW_PASSWORD;
}

export function hasPreviewSession(cookieValue: string | undefined) {
  return cookieValue === PREVIEW_SESSION_VALUE;
}
