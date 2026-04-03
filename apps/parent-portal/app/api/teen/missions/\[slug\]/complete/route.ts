/**
 * POST /api/teen/missions/[slug]/complete
 *
 * Records the teen's choice and completes the mission attempt.
 * Requires:
 *   - Bearer token in Authorization header
 *   - JSON body:
 *     {
 *       missionAttemptId: string,
 *       decisionOptionId: string,
 *       thinkingTrapId: string (TrapCategory enum)
 *     }
 *
 * Returns:
 *   - missionChoiceId: UUID of the recorded choice
 *   - completedAt: timestamp
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";
import { getAuthContext } from "../../../../../_lib/teenAuth";

interface CompleteRequestBody {
  missionAttemptId: string;
  decisionOptionId: string;
  thinkingTrapId: string;
}

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

    // Parse request body
    const body = (await request.json()) as CompleteRequestBody;
    const { missionAttemptId, decisionOptionId, thinkingTrapId } = body;

    if (!missionAttemptId || !decisionOptionId || !thinkingTrapId) {
      return NextResponse.json(
        {
          status: "error",
          message:
            "Missing required fields: missionAttemptId, decisionOptionId, thinkingTrapId",
        },
        { status: 400 }
      );
    }

    // Verify the attempt exists and belongs to this teen
    const attempt = await prisma.missionAttempt.findUnique({
      where: { id: missionAttemptId },
      select: { id: true, teenId: true },
    });

    if (!attempt) {
      return NextResponse.json(
        { status: "error", message: "Mission attempt not found" },
        { status: 404 }
      );
    }

    if (attempt.teenId !== teenId) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized: attempt belongs to another teen" },
        { status: 403 }
      );
    }

    // Verify decision option exists
    const decisionOption = await prisma.missionDecisionOption.findUnique({
      where: { id: decisionOptionId },
      select: { id: true, missionId: true },
    });

    if (!decisionOption) {
      return NextResponse.json(
        { status: "error", message: "Decision option not found" },
        { status: 404 }
      );
    }

    // Verify thinking trap exists
    const trap = await prisma.thinkingTrap.findUnique({
      where: { code: thinkingTrapId as any },
      select: { id: true },
    });

    if (!trap) {
      return NextResponse.json(
        { status: "error", message: "Thinking trap not found" },
        { status: 404 }
      );
    }

    // Record the choice
    const choice = await prisma.missionChoice.create({
      data: {
        missionAttemptId,
        decisionOptionId,
        thinkingTrapId: trap.id,
      },
      select: {
        id: true,
        capturedAt: true,
      },
    });

    // Complete the attempt
    const completedAttempt = await prisma.missionAttempt.update({
      where: { id: missionAttemptId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
      select: {
        id: true,
        completedAt: true,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        data: {
          missionChoiceId: choice.id,
          missionAttemptId: completedAttempt.id,
          completedAt: completedAttempt.completedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/teen/missions/[slug]/complete]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to complete mission attempt",
      },
      { status: 500 }
    );
  }
}
