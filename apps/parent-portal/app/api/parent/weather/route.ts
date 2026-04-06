import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  calculateEmotionalWeather,
  type EmotionalWeatherData,
} from "../../../_lib/parentDataEngine";

/**
 * GET /api/parent/weather?teenId=...
 *
 * Returns emotional weather data for a teen:
 * - Mood trend (improving/steady/dipping/mixed)
 * - Current avatar stage
 * - Current streak
 * - Top thinking trap this week
 * - Context about the top trap
 *
 * Used by parent home page to display weather card.
 */

export async function GET(request: NextRequest) {
  try {
    const teenId = request.nextUrl.searchParams.get("teenId");

    if (!teenId) {
      return NextResponse.json(
        { error: "Missing required parameter: teenId" },
        { status: 400 }
      );
    }

    const weather = await calculateEmotionalWeather(teenId);

    if (!weather) {
      return NextResponse.json(
        { error: "Teen not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(weather);
  } catch (error) {
    console.error("[/api/parent/weather] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
