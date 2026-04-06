/**
 * GET /api/teen/missions
 *
 * Returns a list of all available missions with basic metadata.
 * Requires: Bearer token in Authorization header (dev mode: any token)
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";
import { getAuthContext } from "../../../_lib/teenAuth";
import { ensureMissionCatalogSynced } from "../../../_lib/missionCatalogStore";

export async function GET(request: NextRequest) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);
    void teenId;

    await ensureMissionCatalogSynced();

    // Fetch all published missions with their decision options
    const missions = await prisma.mission.findMany({
      where: { status: "PUBLISHED" },
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
            sortOrder: true,
            trapLinks: {
              select: {
                thinkingTrap: {
                  select: {
                    code: true,
                    label: true,
                  },
                },
              },
            },
          },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Transform to match mobile app's expected format
    const formattedMissions = missions.map((mission) => ({
      id: mission.id,
      slug: mission.slug,
      title: mission.title,
      prompt: mission.narrativeIntro,
      atmosphere: mission.sensoryPrompt,
      estimatedMinutes: mission.estimatedMinutes,
      decisions: mission.decisionOptions.map((option) => ({
        id: option.id,
        label: option.label,
        thinkingTrapId: option.trapLinks[0]?.thinkingTrap.code || "UNKNOWN",
      })),
    }));

    return NextResponse.json({
      status: "success",
      data: formattedMissions,
      count: formattedMissions.length,
    });
  } catch (error) {
    console.error("[GET /api/teen/missions]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch missions",
      },
      { status: error instanceof Error && error.message.includes("Missing") ? 401 : 500 }
    );
  }
}
