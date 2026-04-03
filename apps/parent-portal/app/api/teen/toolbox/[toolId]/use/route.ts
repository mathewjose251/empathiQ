/**
 * POST /api/teen/toolbox/[toolId]/use
 *
 * Log that the teen used a tool
 *
 * Body: {
 *   helpfulnessRating?: number (1-5),
 *   note?: string
 * }
 *
 * Returns: {
 *   logged: true,
 *   toolId: string,
 *   usedAt: string
 * }
 *
 * Requires: Bearer token in Authorization header
 *
 * Note: In Phase 1, this just logs to console. In Phase 2, we'll
 * create a ToolUsage database model to persist this data.
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "../../../../../_lib/teenAuth";

export async function POST(
  request: NextRequest,
  { params }: { params: { toolId: string } }
) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const { helpfulnessRating, note } = body;

    // Validate helpfulnessRating if provided
    if (
      helpfulnessRating !== undefined &&
      (typeof helpfulnessRating !== "number" ||
        helpfulnessRating < 1 ||
        helpfulnessRating > 5)
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "helpfulnessRating must be a number between 1 and 5",
        },
        { status: 400 }
      );
    }

    // Log the tool usage (Phase 1: console logging)
    const usedAt = new Date();
    console.log("[Tool Usage Log]", {
      teenId,
      toolId: params.toolId,
      helpfulnessRating: helpfulnessRating || null,
      note: note || null,
      usedAt: usedAt.toISOString(),
    });

    return NextResponse.json({
      status: "success",
      data: {
        logged: true,
        toolId: params.toolId,
        usedAt: usedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("[POST /api/teen/toolbox/[toolId]/use]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to log tool usage",
      },
      {
        status:
          error instanceof Error && error.message.includes("Missing")
            ? 401
            : 500,
      }
    );
  }
}
