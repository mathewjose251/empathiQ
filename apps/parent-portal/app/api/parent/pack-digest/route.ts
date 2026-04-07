import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { getPackDigestData, type PackDigestItem } from "../../../_lib/parentDataEngine";

/**
 * GET /api/parent/pack-digest?teenId=...
 *
 * Returns real published pack reflections for a teen (last month, PUBLISHED status only).
 *
 * Features:
 * - Only returns PUBLISHED posts (moderation-cleared)
 * - Anonymized with aliases
 * - Includes reaction counts
 * - Latest 5 posts by default
 *
 * Used by parent home page pack digest section.
 */

export async function GET(
  request: NextRequest
): Promise<NextResponse<PackDigestItem[] | { error: string }>> {
  try {
    const teenId = request.nextUrl.searchParams.get("teenId");
    const limitStr = request.nextUrl.searchParams.get("limit");
    const limit = limitStr ? parseInt(limitStr) : 5;

    if (!teenId) {
      return NextResponse.json(
        { error: "Missing required parameter: teenId" },
        { status: 400 }
      );
    }

    const digestData = await getPackDigestData(teenId, limit);

    return NextResponse.json(digestData);
  } catch (error) {
    console.error("[/api/parent/pack-digest] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
