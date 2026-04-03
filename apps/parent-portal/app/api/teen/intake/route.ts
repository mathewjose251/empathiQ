/**
 * POST /api/teen/intake
 *
 * Submit teen intake form with safety gate assessment.
 * Creates IntakeRecord and SafetyGateResponse, determines risk tier.
 *
 * Requires: Bearer token in Authorization header
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";
import { getAuthContext } from "../../../_lib/teenAuth";

interface IntakeRequestBody {
  ageBand: string;
  primaryConcerns: string[];
  householdType: string;
  caregiverStabilityFlag: boolean;
  safetyGateQ1: string;
  safetyGateQ2: string;
  safetyGateQ3: string;
}

/**
 * Determine if safety gate responses indicate risk
 * Simple flagging rules:
 * - Flag if any response indicates concerning indicators
 * - Look for keywords like "yes", "always", "often", etc.
 */
function evaluateSafetyGateResponses(
  q1: string,
  q2: string,
  q3: string
): boolean {
  const riskKeywords = [
    "yes",
    "always",
    "often",
    "frequently",
    "many times",
    "most days",
    "every day",
    "true",
    "definitely",
  ];

  const lowerQ1 = q1.toLowerCase();
  const lowerQ2 = q2.toLowerCase();
  const lowerQ3 = q3.toLowerCase();

  return riskKeywords.some(
    (keyword) =>
      lowerQ1.includes(keyword) ||
      lowerQ2.includes(keyword) ||
      lowerQ3.includes(keyword)
  );
}

export async function POST(request: NextRequest) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);

    // Parse request body
    const body = (await request.json()) as IntakeRequestBody;

    const {
      ageBand,
      primaryConcerns,
      householdType,
      caregiverStabilityFlag,
      safetyGateQ1,
      safetyGateQ2,
      safetyGateQ3,
    } = body;

    // Validate required fields
    if (!ageBand || !primaryConcerns || !householdType) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required fields: ageBand, primaryConcerns, householdType",
        },
        { status: 400 }
      );
    }

    if (!safetyGateQ1 || !safetyGateQ2 || !safetyGateQ3) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required safety gate responses",
        },
        { status: 400 }
      );
    }

    // Evaluate safety gate responses
    const safetyFlagged = evaluateSafetyGateResponses(
      safetyGateQ1,
      safetyGateQ2,
      safetyGateQ3
    );

    // Create IntakeRecord and SafetyGateResponse
    const intakeRecord = await prisma.intakeRecord.create({
      data: {
        teenId,
        ageBand,
        primaryConcerns,
        householdType,
        caregiverStabilityFlag,
        safetyGateResponses: {
          create: {
            question1Response: safetyGateQ1,
            question2Response: safetyGateQ2,
            question3Response: safetyGateQ3,
            isFlagged: safetyFlagged,
            flaggedAt: safetyFlagged ? new Date() : null,
          },
        },
      },
      include: {
        safetyGateResponses: true,
      },
    });

    // Calculate risk tier
    let riskTier = "GREEN";

    if (safetyFlagged) {
      riskTier = "CRISIS";
    } else if (
      caregiverStabilityFlag &&
      (primaryConcerns.includes("SELF_HARM") ||
        primaryConcerns.includes("SUBSTANCE_USE"))
    ) {
      riskTier = "RED";
    } else if (
      primaryConcerns.length >= 3 ||
      caregiverStabilityFlag
    ) {
      riskTier = "AMBER";
    }

    return NextResponse.json({
      status: "success",
      data: {
        intakeRecordId: intakeRecord.id,
        riskTier,
        safetyFlagged,
      },
    });
  } catch (error) {
    console.error("[POST /api/teen/intake]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error ? error.message : "Failed to submit intake form",
      },
      {
        status:
          error instanceof Error && error.message.includes("Missing") ? 401 : 500,
      }
    );
  }
}
