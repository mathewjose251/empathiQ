/**
 * Teen API Mock Auth (Development Mode)
 *
 * In Phase 1, we use mock auth with hardcoded teen IDs for testing.
 * In Phase 2, this will integrate with real User/TeenProfile sessions.
 */

export interface AuthContext {
  teenId: string;
  userId: string;
}

/**
 * Mock teen accounts for development
 * Format: Bearer token -> { teenId, userId }
 */
const MOCK_ACCOUNTS: Record<string, AuthContext> = {
  "mock-token-teen-1": {
    teenId: "teen-001",
    userId: "user-teen-001",
  },
  "mock-token-teen-2": {
    teenId: "teen-002",
    userId: "user-teen-002",
  },
  "mock-token-teen-3": {
    teenId: "teen-003",
    userId: "user-teen-003",
  },
};

/**
 * Extract and validate Bearer token from request headers
 * Returns { teenId, userId } if valid, or throws error
 */
export function getAuthContext(authHeader: string | null): AuthContext {
  if (!authHeader) {
    throw new Error("Missing Authorization header. Use: Bearer <mock-token>");
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer") {
    throw new Error("Invalid auth scheme. Use: Bearer <mock-token>");
  }

  if (!token) {
    throw new Error("Missing token");
  }

  const context = MOCK_ACCOUNTS[token];

  if (!context) {
    // In dev mode, allow any Bearer token as a fallback
    // Extract teen ID from token if it starts with "teen-"
    if (token.startsWith("teen-")) {
      return {
        teenId: token,
        userId: `user-${token}`,
      };
    }

    throw new Error(
      `Unknown token. Use one of: ${Object.keys(MOCK_ACCOUNTS).join(", ")} or provide a token starting with 'teen-'`
    );
  }

  return context;
}

/**
 * Available mock tokens for testing (useful for docs)
 */
export const MOCK_TOKENS = {
  TEEN_1: "mock-token-teen-1", // teenId: "teen-001"
  TEEN_2: "mock-token-teen-2", // teenId: "teen-002"
  TEEN_3: "mock-token-teen-3", // teenId: "teen-003"
};
