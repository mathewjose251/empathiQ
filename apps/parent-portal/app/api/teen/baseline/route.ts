/**
 * GET /api/teen/baseline
 *
 * Get teen's baseline assessment including intake data,
 * computed risk tier, and recommended mission lane.
 *
 * Requires: Bearer token in Authorization header
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";
import { getAuthContext } from "../../../_lib/teenAuth";

/**
 * Determine risk tier based on intake data
 * - CRISIS: safety gate is flagged
 * - RED: caregiverStabilityFlag=true AND primaryConcerns includes SELF_HARM or SUBSTANCE_USE
 * - AMBER: primaryConcerns.length >= 3 OR caregiverStabilityFlag=true
 * - GREEN: everything else
 */
function calculateRiskTier(
  safetyGateFlagged: boolean,
  caregiverStabilityFlag: boolean,
  primaryConcerns: string[]
): string {
  if (safetyGateFlagged) {
    return "CRISIS";
  }

  if (
    caregiverStabilityFlag &&
    (primaryConcerns.includes("SELF_HARM") ||
      primaryConcerns.includes("SUBSTANCE_USE"))
  ) {
    return "RED";
  }

  if (primaryConcerns.length >= 3 || caregiverStabilityFlag) {
    return "AMBER";
  }

  return "GREEN";
}

/**
 * Determine mission lane based on primary concerns
 * - SCHOOL_DISENGAGEMENT → "school"
 * - SCREEN_OVERUSE → "digital"
 * - FAMILY_CONFLICT → "family"
 * - SOCIAL_COMMUNICATION → "peer"
 * - Default → "self"
 */
function determineMissionLane(primaryConcerns: string[]): string {
  if (primaryConcerns.includes("SCHOOL_DISENGAGEMENT")) {
    return "school";
  }
  if (primaryConcerns.includes("SCREEN_OVERUSE")) {
    return "digital";
  }
  if (primaryConcerns.includes("FAMILY_CONFLICT")) {
    return "family";
  }
  if (primaryConcerns.includes("SOCIAL_COMMUNICATION")) {
    return "peer";
  }
  return "self";
}

export async function GET(request: NextRequest) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);

    // Fetch intake record
    const intakeRecord = await prisma.intakeRecord.findUnique({
      where: { teenId },
      include: {
        safetyGateResponses: true,
      },
    });

    if (!intakeRecord) {
      return NextResponse.json(
        {
          status: "error",
          message: "No intake record found for this teen",
        },
        { status: 404 }
      );
    }

    // Calculate risk tier
    const riskTier = calculateRiskTier(
      intakeRecord.safetyGateResponses?.isFlagged || false,
      intakeRecord.caregiverStabilityFlag,
      intakeRecord.primaryConcerns
    );

    // Determine mission lane
    const missionLane = determineMissionLane(intakeRecord.primaryConcerns);

    return NextResponse.json({
      status: "success",
      data: {
        intakeRecordId: intakeRecord.id,
        ageBand: intakeRecord.ageBand,
        primaryConcerns: intakeRecord.primaryConcerns,
        householdType: intakeRecord.householdType,
        caregiverStabilityFlag: intakeRecord.caregiverStabilityFlag,
        safetyGateFlagged: intakeRecord.safetyGateResponses?.isFlagged || false,
        riskTier,
        recommendedMissionLane: missionLane,
        completedAt: intakeRecord.completedAt,
      },
    });
  } catch (error) {
    console.error("[GET /api/teen/baseline]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch baseline assessment",
      },
      {
        status:
          error instanceof Error && error.message.includes("Missing") ? 401 : 500,
      }
    );
  }
}
