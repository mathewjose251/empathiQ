/**
 * GET /api/teen/recommendation
 *
 * Get recommended mission for the teen based on their baseline
 * assessment and mission lane. Returns a PUBLISHED mission matching
 * the theme that they haven't completed yet.
 *
 * Requires: Bearer token in Authorization header
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";
import { getMissionBySlug } from "@empathiq/shared/missions/missionFactory";
import { getAuthContext } from "../../../_lib/teenAuth";
import { ensureMissionCatalogSynced } from "../../../_lib/missionCatalogStore";

/**
 * Determine mission lane based on primary concerns
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

/**
 * Extract theme from mission slug or title
 * Matches against known mission lane keywords
 */
function extractMissionTheme(mission: { slug: string; title: string }): string {
  const sharedMission = getMissionBySlug(mission.slug);

  if (sharedMission) {
    return sharedMission.theme;
  }

  const slug = mission.slug.toLowerCase();
  const title = mission.title.toLowerCase();

  if (slug.includes("school") || title.includes("school")) return "school";
  if (slug.includes("digital") || title.includes("digital") || slug.includes("screen") || title.includes("screen")) return "digital";
  if (slug.includes("family") || title.includes("family")) return "family";
  if (slug.includes("peer") || slug.includes("social") || title.includes("peer") || title.includes("social")) return "peer";
  if (slug.includes("self") || title.includes("self")) return "self";

  return "self"; // default
}

export async function GET(request: NextRequest) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);

    await ensureMissionCatalogSynced();

    // Fetch teen's baseline (intake record)
    const intakeRecord = await prisma.intakeRecord.findUnique({
      where: { teenId },
    });

    if (!intakeRecord) {
      return NextResponse.json(
        {
          status: "error",
          message: "No intake record found. Complete baseline assessment first.",
        },
        { status: 404 }
      );
    }

    // Determine mission lane from primary concerns
    const missionLane = determineMissionLane(intakeRecord.primaryConcerns);

    // Get completed mission IDs for this teen
    const completedMissions = await prisma.missionAttempt.findMany({
      where: {
        teenId,
        status: "COMPLETED",
      },
      select: {
        missionId: true,
      },
    });

    const completedMissionIds = completedMissions.map((m) => m.missionId);

    // Find all published missions
    const publishedMissions = await prisma.mission.findMany({
      where: {
        status: "PUBLISHED",
      },
      select: {
        id: true,
        slug: true,
        title: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Filter: not completed yet + matches mission lane theme
    const availableMissions = publishedMissions.filter((mission) => {
      if (completedMissionIds.includes(mission.id)) {
        return false; // skip completed
      }

      const theme = extractMissionTheme(mission);
      return theme === missionLane;
    });

    // If no matching missions found, recommend the first available published mission
    let recommendedMission = availableMissions[0];
    if (!recommendedMission) {
      const anyAvailable = publishedMissions.find(
        (m) => !completedMissionIds.includes(m.id)
      );
      recommendedMission = anyAvailable || publishedMissions[0];
    }

    if (!recommendedMission) {
      return NextResponse.json(
        {
          status: "error",
          message: "No missions available",
        },
        { status: 404 }
      );
    }

    const recommendationReason =
      missionLane === "self"
        ? `Based on your concerns, we recommend exploring self-awareness and personal growth with "${recommendedMission.title}".`
        : `Based on your primary concerns about ${missionLane}, we recommend "${recommendedMission.title}".`;

    return NextResponse.json({
      status: "success",
      data: {
        recommendedMission: {
          slug: recommendedMission.slug,
          title: recommendedMission.title,
          theme: missionLane,
        },
        reason: recommendationReason,
      },
    });
  } catch (error) {
    console.error("[GET /api/teen/recommendation]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to get recommendation",
      },
      {
        status:
          error instanceof Error && error.message.includes("Missing") ? 401 : 500,
      }
    );
  }
}
