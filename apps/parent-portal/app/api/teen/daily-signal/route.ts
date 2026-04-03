/**
 * POST /api/teen/daily-signal
 * Submit daily emotional check-in
 *
 * Body: {
 *   moodSignal: number (1-10),
 *   freeTextNote?: string,
 *   arcPosition?: number (1-5)
 * }
 *
 * Returns: {
 *   signalId: string,
 *   moodSignal: number,
 *   submittedAt: string,
 *   streak: number (count of consecutive days with check-ins)
 * }
 *
 * GET /api/teen/daily-signal
 * Get teen's recent daily signals (last 7 days)
 *
 * Returns: {
 *   signals: [...],
 *   weeklyAvgMood: number,
 *   trend: "improving" | "stable" | "declining",
 *   totalCheckIns: number
 * }
 *
 * Requires: Bearer token in Authorization header
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@empathiq/database";
import { getAuthContext } from "../../../_lib/teenAuth";

// POST handler - Submit daily signal
export async function POST(request: NextRequest) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);

    // Parse and validate request body
    const body = await request.json();
    const { moodSignal, freeTextNote, arcPosition } = body;

    // Validate moodSignal
    if (typeof moodSignal !== "number" || moodSignal < 1 || moodSignal > 10) {
      return NextResponse.json(
        {
          status: "error",
          message: "moodSignal must be a number between 1 and 10",
        },
        { status: 400 }
      );
    }

    // Validate optional arcPosition
    if (
      arcPosition !== undefined &&
      (typeof arcPosition !== "number" || arcPosition < 1 || arcPosition > 5)
    ) {
      return NextResponse.json(
        {
          status: "error",
          message: "arcPosition must be a number between 1 and 5",
        },
        { status: 400 }
      );
    }

    // Create daily signal record
    const signal = await prisma.dailySignal.create({
      data: {
        teenId,
        moodSignal,
        freeTextNote: freeTextNote || null,
        arcPosition: arcPosition || null,
      },
    });

    // Calculate streak (consecutive days with check-ins)
    const streak = await calculateStreak(teenId);

    return NextResponse.json(
      {
        status: "success",
        data: {
          signalId: signal.id,
          moodSignal: signal.moodSignal,
          submittedAt: signal.submittedAt.toISOString(),
          streak,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/teen/daily-signal]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit daily signal",
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

// GET handler - Fetch recent signals
export async function GET(request: NextRequest) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    const { teenId } = getAuthContext(authHeader);

    // Get signals from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const signals = await prisma.dailySignal.findMany({
      where: {
        teenId,
        submittedAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    // Calculate statistics
    const weeklyAvgMood =
      signals.length > 0
        ? signals.reduce((sum, s) => sum + s.moodSignal, 0) / signals.length
        : 0;

    // Determine trend
    let trend: "improving" | "stable" | "declining" = "stable";
    if (signals.length >= 2) {
      const firstHalf = signals
        .slice(Math.ceil(signals.length / 2))
        .reduce((sum, s) => sum + s.moodSignal, 0);
      const secondHalf = signals
        .slice(0, Math.ceil(signals.length / 2))
        .reduce((sum, s) => sum + s.moodSignal, 0);

      const firstHalfAvg = firstHalf / Math.ceil(signals.length / 2);
      const secondHalfAvg = secondHalf / Math.ceil(signals.length / 2);

      if (secondHalfAvg > firstHalfAvg + 0.5) {
        trend = "improving";
      } else if (secondHalfAvg < firstHalfAvg - 0.5) {
        trend = "declining";
      }
    }

    return NextResponse.json({
      status: "success",
      data: {
        signals: signals.map((s) => ({
          id: s.id,
          moodSignal: s.moodSignal,
          freeTextNote: s.freeTextNote,
          arcPosition: s.arcPosition,
          submittedAt: s.submittedAt.toISOString(),
        })),
        weeklyAvgMood: Math.round(weeklyAvgMood * 10) / 10,
        trend,
        totalCheckIns: signals.length,
      },
    });
  } catch (error) {
    console.error("[GET /api/teen/daily-signal]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch daily signals",
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

/**
 * Calculate streak of consecutive days with check-ins
 * A streak ends when there's a gap of more than 1 day
 */
async function calculateStreak(teenId: string): Promise<number> {
  const signals = await prisma.dailySignal.findMany({
    where: { teenId },
    orderBy: { submittedAt: "desc" },
    take: 30, // Look at last 30 signals
  });

  if (signals.length === 0) return 1;

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the most recent signal is from today or yesterday
  const mostRecentSignalDate = new Date(signals[0].submittedAt);
  mostRecentSignalDate.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor(
    (today.getTime() - mostRecentSignalDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If most recent signal is more than 1 day old, streak is broken
  if (daysDiff > 1) {
    return 1;
  }

  // Count consecutive days
  for (let i = 1; i < signals.length; i++) {
    const currentDate = new Date(signals[i - 1].submittedAt);
    const prevDate = new Date(signals[i].submittedAt);

    currentDate.setHours(0, 0, 0, 0);
    prevDate.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor(
      (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
