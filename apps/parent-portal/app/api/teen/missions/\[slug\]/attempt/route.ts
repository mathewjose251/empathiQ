/**
 * POST /api/teen/missions/[slug]/attempt
 *
 * Creates a new mission attempt for the teen.
 * Requires:
 *   - Bearer token in Authorization header
 *   - JSON body (can be empty)
 *
 * Returns:
 *   - missionAttemptId: UUID of the created attempt
 *   - startedAt: timestamp
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";
import { getAuthContext } from "../../../../../_lib/teenAuth";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);

    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        { status: "error", message: "Missing slug parameter" },
        { status: 400 }
      );
    }

    // Find the mission
    const mission = await prisma.mission.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!mission) {
      return NextResponse.json(
        { status: "error", message: "Mission not found" },
        { status: 404 }
      );
    }

    // Create a new mission attempt
    // Note: In Phase 2, we'll validate that teenId exists in TeenProfile
    const attempt = await prisma.missionAttempt.create({
      data: {
        missionId: mission.id,
        teenId,
        status: "STARTED",
      },
      select: {
        id: true,
        createdAt: true,
        startedAt: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: {
          missionAttemptId: attempt.id,
          startedAt: attempt.startedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/teen/missions/[slug]/attempt]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to create mission attempt",
      },
      { status: 500 }
    );
  }
}
