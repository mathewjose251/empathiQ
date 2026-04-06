import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getThinkingTrapTrends,
  getMoodTrajectory,
  getEngagementStats,
  getVisibilityIndicators,
  type ThinkingTrapTrend,
  type MoodTimelineItem,
  type EngagementStat,
  type VisibilityIndicator,
} from "../../../_lib/parentDataEngine";

/**
 * GET /api/parent/insights?teenId=...
 *
 * Returns deeper insight data for a teen:
 * - Thinking trap trends (4 weeks, %)
 * - Mood trajectory (4-week timeline)
 * - Engagement stats (missions, tools, reflections)
 * - Visibility indicators (what parent can see)
 *
 * Used by /parent/insights page for detailed analysis.
 */

interface InsightsResponse {
  trapTrends: ThinkingTrapTrend[];
  moodTrajectory: MoodTimelineItem[];
  engagementStats: EngagementStat[];
  visibilityIndicators: VisibilityIndicator[];
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<InsightsResponse | { error: string }>> {
  try {
    const teenId = request.nextUrl.searchParams.get("teenId");

    if (!teenId) {
      return NextResponse.json(
        { error: "Missing required parameter: teenId" },
        { status: 400 }
      );
    }

    const [trapTrends, moodTrajectory, engagementStats, visibilityIndicators] =
      await Promise.all([
        getThinkingTrapTrends(teenId),
        getMoodTrajectory(teenId),
        getEngagementStats(teenId),
        getVisibilityIndicators(teenId),
      ]);

    return NextResponse.json({
      trapTrends,
      moodTrajectory,
      engagementStats,
      visibilityIndicators,
    });
  } catch (error) {
    console.error("[/api/parent/insights] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
