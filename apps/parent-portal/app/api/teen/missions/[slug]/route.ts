/**
 * GET /api/teen/missions/[slug]
 *
 * Returns a single mission with all its decision options and thinking trap metadata.
 * Requires: Bearer token in Authorization header (dev mode: any token)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";
import { getMissionBySlug } from "@empathiq/shared/missions/missionFactory";
import { getAuthContext } from "../../../../_lib/teenAuth";
import { ensureMissionCatalogSynced } from "../../../../_lib/missionCatalogStore";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);
    void teenId;

    await ensureMissionCatalogSynced();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { status: "error", message: "Missing slug parameter" },
        { status: 400 }
      );
    }

    // Fetch mission with decision options
    const mission = await prisma.mission.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        narrativeIntro: true,
        sensoryPrompt: true,
        estimatedMinutes: true,
        decisionOptions: {
          select: {
            id: true,
            label: true,
            narrativeOutcome: true,
            sortOrder: true,
            trapLinks: {
              select: {
                thinkingTrap: {
                  select: {
                    id: true,
                    code: true,
                    label: true,
                    description: true,
                  },
                },
              },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    if (!mission) {
      return NextResponse.json(
        { status: "error", message: "Mission not found" },
        { status: 404 }
      );
    }

    const sharedMission = getMissionBySlug(mission.slug);

    // Transform to match mobile app format
    const formattedMission = {
      id: mission.id,
      slug: mission.slug,
      title: mission.title,
      chapterLabel: sharedMission?.chapterLabel || `Mission: ${mission.slug}`,
      prompt: mission.narrativeIntro,
      atmosphere: mission.sensoryPrompt,
      estimatedMinutes: mission.estimatedMinutes,
      theme: sharedMission?.theme || null,
      decisions: mission.decisionOptions.map((option) => ({
        id: option.id,
        label: option.label,
        consequence: option.narrativeOutcome,
        thinkingTrapId:
          option.trapLinks[0]?.thinkingTrap.code || "UNKNOWN",
        thinkingTrap: option.trapLinks[0]?.thinkingTrap || null,
      })),
    };

    return NextResponse.json({
      status: "success",
      data: formattedMission,
    });
  } catch (error) {
    console.error("[GET /api/teen/missions/[slug]]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch mission",
      },
      { status: 500 }
    );
  }
}
