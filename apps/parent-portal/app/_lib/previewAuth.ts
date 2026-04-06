export const PREVIEW_SESSION_COOKIE = "empathiq_preview_session";
export const PREVIEW_SESSION_VALUE = "preview-authenticated";

export const PREVIEW_USERNAME =
  process.env.PREVIEW_LOGIN_USERNAME ?? "testuser";
export const PREVIEW_PASSWORD =
  process.env.PREVIEW_LOGIN_PASSWORD ?? "betternow";

const PUBLIC_EXACT_PATHS = new Set([
  "/login",
  "/teen/survey",
  "/tween/survey",
  "/parent/survey",
]);

const PUBLIC_PREFIXES = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/surveys/teen",
  "/api/surveys/tween",
  "/api/surveys/parent",
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
