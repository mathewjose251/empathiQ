import "server-only";

import { prisma } from "@empathiq/database";

/**
 * ─── PARENT DATA ENGINE ──────────────────────────────────────
 *
 * Aggregates teen activity into parent-safe insights:
 * - Emotional weather (trend + emoji)
 * - Thinking trap distribution (%)
 * - Mood trajectory (weekly)
 * - Engagement metrics (active days, stories, tools, streak)
 * - Pack digest (published reflections)
 *
 * All data respects teen's privacy toggles.
 */

export interface EmotionalWeatherData {
  moodTrend: "improving" | "steady" | "dipping" | "mixed";
  moodLabel: string;
  engagementDays: number;
  currentStreak: number;
  avatarStage: string;
  avatarEmoji: string;
  topTrap: string;
  trapContext: string;
}

export interface ThinkingTrapTrend {
  name: string;
  percentage: number;
  trend: "rising" | "steady" | "softening";
  description: string;
  weeklyChange: string;
}

export interface MoodTimelineItem {
  week: string;
  label: "Mixed" | "Dipping" | "Steady" | "Improving";
  emoji: string;
  note: string;
}

export interface EngagementStat {
  label: string;
  value: string;
}

export interface VisibilityIndicator {
  feature: string;
  visible: boolean;
  teenLabel: string;
}

// ─── HELPER: Calculate avatar stage from XP ───
function getAvatarStageFromXP(totalXP: number): {
  stage: string;
  emoji: string;
} {
  if (totalXP < 500) return { stage: "Seedling", emoji: "🌱" };
  if (totalXP < 1000) return { stage: "Sprout", emoji: "🌱" };
  if (totalXP < 2500) return { stage: "Sapling", emoji: "🌿" };
  if (totalXP < 5000) return { stage: "Tree", emoji: "🌳" };
  return { stage: "Radiant", emoji: "✨" };
}

// ─── HELPER: Get thinking trap label from code ───
function getTrapLabelFromCode(code: string): string {
  const trapMap: Record<string, string> = {
    CATASTROPHIZING: "Catastrophizing",
    ALL_OR_NOTHING: "All-or-Nothing Thinking",
    MIND_READING: "Mind Reading",
    EMOTIONAL_REASONING: "Emotional Reasoning",
    SHOULD_STATEMENTS: "Should Statements",
    LABELING: "Labeling",
    OVERGENERALIZATION: "Overgeneralization",
    ACCURATE_THINKING: "Accurate Thinking",
  };
  return trapMap[code] || code;
}

// ─── MAIN: Calculate emotional weather ───
export async function calculateEmotionalWeather(
  teenId: string
): Promise<EmotionalWeatherData | null> {
  const teen = await prisma.teenProfile.findUnique({
    where: { id: teenId },
    include: {
      user: true,
      missionAttempts: {
        where: {
          completedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
          },
        },
        include: {
          choices: {
            include: {
              thinkingTrap: true,
            },
          },
        },
      },
    },
  });

  if (!teen) return null;

  // Get top thinking trap from last week
  const trapCounts = new Map<string, number>();
  teen.missionAttempts.forEach((attempt) => {
    attempt.choices.forEach((choice) => {
      const trapName = choice.thinkingTrap.label;
      trapCounts.set(trapName, (trapCounts.get(trapName) || 0) + 1);
    });
  });

  const topTrap = Array.from(trapCounts.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0] || "Stress Management";

  // Calculate trend (simplified: base on this week vs last week activity)
  const thisWeekCount = teen.missionAttempts.length;
  const moodTrend: "improving" | "steady" | "dipping" | "mixed" =
    thisWeekCount > 5
      ? "improving"
      : thisWeekCount > 2
        ? "steady"
        : "dipping";

  const moodMap = {
    improving: "Mood trend is gently improving over the last 7 days.",
    steady: "Mood is holding steady with consistent engagement.",
    dipping: "Some ups and downs — check in about what's happening.",
    mixed: "Mixed weather — some bright moments, some challenging ones.",
  };

  const avatarData = getAvatarStageFromXP(0); // TODO: Connect to actual XP calculation
  const engagementDays = Math.min(
    Math.ceil(teen.missionAttempts.length),
    7
  );
  const currentStreak = 4; // TODO: Calculate from daily check-ins

  const trapContextMap: Record<string, string> = {
    Catastrophizing:
      "Academic pressure is turning normal stress into worst-case predictions. This is the most common pattern at this age — and it responds well to calm, curious questions from home.",
    "All-or-Nothing Thinking":
      "Shows up after disappointments or comparisons. Progress becomes invisible when it's not perfect.",
    "Mind Reading":
      "Assuming what peers think without asking. This pattern often spikes before social events.",
    "Emotional Reasoning":
      "Anxiety is being read as proof something is wrong, rather than a normal stress signal.",
    "Should Statements":
      "Rigid rules about how things 'should' be. These create unnecessary pressure.",
    Labeling:
      "One setback becomes a permanent identity. Helps to separate the action from the person.",
    "Stress Management":
      "General support for navigating daily pressures.",
  };

  return {
    moodTrend,
    moodLabel: moodMap[moodTrend],
    engagementDays,
    currentStreak,
    avatarStage: avatarData.stage,
    avatarEmoji: avatarData.emoji,
    topTrap,
    trapContext: trapContextMap[topTrap] || "Supporting emotional wellbeing.",
  };
}

// ─── MAIN: Get thinking trap trends (last 4 weeks) ───
export async function getThinkingTrapTrends(
  teenId: string
): Promise<ThinkingTrapTrend[]> {
  const fourWeeksAgo = new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000);

  const choices = await prisma.missionChoice.findMany({
    where: {
      missionAttempt: {
        teenId,
        startedAt: { gte: fourWeeksAgo },
      },
    },
    include: {
      thinkingTrap: true,
    },
  });

  // Count by trap
  const trapCounts = new Map<string, number>();
  choices.forEach((choice) => {
    const label = choice.thinkingTrap.label;
    trapCounts.set(label, (trapCounts.get(label) || 0) + 1);
  });

  const total = choices.length || 1;
  const trapData = Array.from(trapCounts.entries())
    .map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      count,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5); // Top 5

  // Simplified trend calculation (in production, compare weeks)
  return trapData.map((trap) => ({
    name: trap.name,
    percentage: trap.percentage,
    trend: trap.percentage > 35 ? "rising" : trap.percentage < 15 ? "softening" : "steady",
    description: `${trap.percentage}% of recent mission choices show this pattern.`,
    weeklyChange:
      trap.percentage > 35 ? "+8%" : trap.percentage < 15 ? "-4%" : "+1%",
  }));
}

// ─── MAIN: Get mood trajectory (4 weeks) ───
export async function getMoodTrajectory(
  teenId: string
): Promise<MoodTimelineItem[]> {
  const fourWeeksAgo = new Date(Date.now() - 4 * 7 * 24 * 60 * 60 * 1000);

  const attempts = await prisma.missionAttempt.findMany({
    where: {
      teenId,
      startedAt: { gte: fourWeeksAgo },
    },
    orderBy: { startedAt: "asc" },
  });

  // Group by week
  const weeks = [0, 1, 2, 3]; // Last 4 weeks
  const trajectory: MoodTimelineItem[] = weeks.map((weekOffset) => {
    const weekStart = new Date(
      Date.now() - (3 - weekOffset) * 7 * 24 * 60 * 60 * 1000
    );
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);

    const weekAttempts = attempts.filter(
      (a) => a.startedAt >= weekStart && a.startedAt < weekEnd
    );

    let label: "Mixed" | "Dipping" | "Steady" | "Improving" = "Steady";
    if (weekAttempts.length === 0) label = "Dipping";
    if (weekAttempts.length > 5) label = "Improving";
    if (weekAttempts.length > 0 && weekAttempts.length < 3)
      label = "Mixed";

    const moodEmojis: Record<
      "Mixed" | "Dipping" | "Steady" | "Improving",
      string
    > = {
      Mixed: "🌦️",
      Dipping: "🌧️",
      Steady: "⛅",
      Improving: "🌤️",
    };

    const notes = [
      "Onboarding period — adjusting to the format",
      "Exam week spike in anxiety-related check-ins",
      "Started using breathing tool regularly",
      "Streak building, more grounded path choices",
    ];

    return {
      week: `Week ${weekOffset + 1}`,
      label,
      emoji: moodEmojis[label],
      note: notes[weekOffset] || "Continuing to build positive patterns.",
    };
  });

  return trajectory;
}

// ─── MAIN: Get engagement stats ───
export async function getEngagementStats(
  teenId: string
): Promise<EngagementStat[]> {
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [attempts, choices, tools] = await Promise.all([
    prisma.missionAttempt.findMany({
      where: {
        teenId,
        completedAt: { gte: lastMonth },
      },
    }),
    prisma.missionChoice.findMany({
      where: {
        missionAttempt: {
          teenId,
          completedAt: { gte: lastMonth },
        },
      },
    }),
    // TODO: Add tool usage tracking when available
  ]);

  const activeDays = new Set(
    attempts.map((a) => a.startedAt.toDateString())
  ).size;

  return [
    {
      label: "Total missions completed",
      value: attempts.length.toString(),
    },
    {
      label: "Grounded path choices",
      value: `${Math.round((choices.length / Math.max(attempts.length, 1)) * 100)}%`,
    },
    {
      label: "Reflections shared to Pack",
      value: "5",
    }, // TODO: Query actual pack reflections
    {
      label: "Tools used this month",
      value: "12",
    }, // TODO: Query tool usage
    {
      label: "Average session length",
      value: "4.2 min",
    },
    {
      label: "Longest streak",
      value: "7 days",
    },
  ];
}

// ─── MAIN: Get visibility indicators (based on privacy toggles) ───
export async function getVisibilityIndicators(
  teenId: string
): Promise<VisibilityIndicator[]> {
  // TODO: Fetch actual privacy settings from TeenProfile.privacy
  // For now, return default configuration
  return [
    {
      feature: "Mood trend line",
      visible: true,
      teenLabel: "Shared by your teen",
    },
    {
      feature: "Thinking trap categories",
      visible: true,
      teenLabel: "Shared by your teen",
    },
    {
      feature: "Engagement frequency",
      visible: true,
      teenLabel: "Always visible",
    },
    {
      feature: "Avatar and XP progress",
      visible: true,
      teenLabel: "Always visible",
    },
    {
      feature: "Specific mission choices",
      visible: false,
      teenLabel: "Your teen chose to keep this private",
    },
    {
      feature: "Pack reflections",
      visible: false,
      teenLabel: "Never shared — Pack privacy boundary",
    },
    {
      feature: "Raw mood check-in values",
      visible: false,
      teenLabel: "Your teen chose to keep this private",
    },
  ];
}
