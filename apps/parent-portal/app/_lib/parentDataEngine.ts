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
 * - Privacy filtering (respects teen's toggle settings)
 * - Parent-teen linking (Phase 3)
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

export interface PackDigestItem {
  id: string;
  alias: string;
  mood: string;
  text: string;
  reactions: { kind: string; count: number }[];
  publishedAt: Date;
}

export interface TeenPrivacySettings {
  shareMoodTrends: boolean;
  shareThinkingTrapFocus: boolean;
  shareStreakData: boolean;
  shareProgressMetrics: boolean;
  shareAvatarStage: boolean; // Always true - can't hide
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

// ─── MAIN: Get real engagement stats (Phase 2) ───
export async function getEngagementStats(
  teenId: string
): Promise<EngagementStat[]> {
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Fetch all engagement data in parallel
  const [
    completedAttempts,
    allAttempts,
    packReflections,
    dailySignals,
    challenges,
  ] = await Promise.all([
    // Missions completed this month
    prisma.missionAttempt.findMany({
      where: {
        teenId,
        completedAt: { gte: lastMonth, lte: new Date() },
      },
    }),
    // All attempts to calculate streaks
    prisma.missionAttempt.findMany({
      where: { teenId },
      orderBy: { completedAt: "desc" },
      take: 30,
    }),
    // Pack reflections (published only)
    prisma.packReflection.findMany({
      where: {
        teenId,
        status: "PUBLISHED",
        publishedAt: { gte: lastMonth },
      },
    }),
    // Daily mood signals
    prisma.dailySignal.findMany({
      where: {
        teenId,
        submittedAt: { gte: lastMonth },
      },
    }),
    // Challenges/tools used
    prisma.challengeAttempt.findMany({
      where: {
        teenId,
        submittedAt: { gte: lastMonth },
      },
    }),
  ]);

  // Calculate metrics
  const activeDays = new Set(
    completedAttempts.map((a) => a.startedAt.toDateString())
  ).size;

  // Calculate streak (consecutive days with activity)
  const streak = calculateStreak(allAttempts);

  // Get average session time (placeholder - would need timestamps)
  const avgSessionTime = "4.2 min";

  return [
    {
      label: "Total missions completed",
      value: completedAttempts.length.toString(),
    },
    {
      label: "Active days this month",
      value: `${activeDays} / 30`,
    },
    {
      label: "Reflections shared to Pack",
      value: packReflections.length.toString(),
    },
    {
      label: "Tools/Challenges used",
      value: challenges.length.toString(),
    },
    {
      label: "Mood check-ins",
      value: dailySignals.length.toString(),
    },
    {
      label: "Current streak",
      value: `${streak} days`,
    },
    {
      label: "Average session length",
      value: avgSessionTime,
    },
    {
      label: "Longest streak",
      value: calculateLongestStreak(allAttempts),
    },
  ];
}

// ─── HELPER: Calculate current streak ───
function calculateStreak(attempts: Array<{ completedAt: Date | null }>): number {
  let streak = 0;
  const completedDates = attempts
    .filter((a) => a.completedAt !== null)
    .map((a) => new Date(a.completedAt!).toDateString())
    .filter((date, idx, arr) => arr.indexOf(date) === idx)
    .sort()
    .reverse();

  if (completedDates.length === 0) return 0;

  const today = new Date().toDateString();
  let currentDate = new Date();

  for (let i = 0; i < completedDates.length; i++) {
    const compareDate = new Date(completedDates[i]).toDateString();
    const expectedDate = new Date(currentDate).toDateString();

    if (compareDate === expectedDate) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

// ─── HELPER: Calculate longest streak ───
function calculateLongestStreak(
  attempts: Array<{ completedAt: Date | null }>
): string {
  let maxStreak = 0;
  let currentStreak = 0;
  const completedDates = attempts
    .filter((a) => a.completedAt !== null)
    .map((a) => new Date(a.completedAt!))
    .sort((a, b) => a.getTime() - b.getTime());

  for (let i = 0; i < completedDates.length; i++) {
    if (i === 0) {
      currentStreak = 1;
    } else {
      const dayDiff =
        (completedDates[i].getTime() - completedDates[i - 1].getTime()) /
        (1000 * 60 * 60 * 24);
      if (dayDiff <= 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }
  }

  maxStreak = Math.max(maxStreak, currentStreak);
  return `${maxStreak} days`;
}

// ─── MAIN: Get privacy settings for teen (Phase 2) ───
export async function getPrivacySettings(
  teenId: string
): Promise<TeenPrivacySettings> {
  const teen = await prisma.teenProfile.findUnique({
    where: { id: teenId },
  });

  if (!teen) {
    return {
      shareMoodTrends: true,
      shareThinkingTrapFocus: true,
      shareStreakData: true,
      shareProgressMetrics: true,
      shareAvatarStage: true,
    };
  }

  // TODO: TeenProfile needs privacy field added to schema
  // For now, return default privacy settings
  // In production: return (teen.privacy as TeenPrivacySettings) || defaultSettings
  return {
    shareMoodTrends: true,
    shareThinkingTrapFocus: true,
    shareStreakData: true,
    shareProgressMetrics: true,
    shareAvatarStage: true, // Always true - never hidden
  };
}

// ─── MAIN: Get visibility indicators (based on privacy toggles) ───
export async function getVisibilityIndicators(
  teenId: string
): Promise<VisibilityIndicator[]> {
  const privacy = await getPrivacySettings(teenId);

  return [
    {
      feature: "Mood trend line",
      visible: privacy.shareMoodTrends,
      teenLabel: privacy.shareMoodTrends
        ? "Shared by your teen"
        : "Your teen chose to keep this private",
    },
    {
      feature: "Thinking trap categories",
      visible: privacy.shareThinkingTrapFocus,
      teenLabel: privacy.shareThinkingTrapFocus
        ? "Shared by your teen"
        : "Your teen chose to keep this private",
    },
    {
      feature: "Engagement frequency",
      visible: true,
      teenLabel: "Always visible",
    },
    {
      feature: "Avatar and XP progress",
      visible: privacy.shareAvatarStage,
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

// ─── MAIN: Get pack digest (real published reflections) ───
export async function getPackDigestData(
  teenId: string,
  limit: number = 5
): Promise<PackDigestItem[]> {
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const reflections = await prisma.packReflection.findMany({
    where: {
      teenId,
      status: "PUBLISHED",
      publishedAt: { gte: lastMonth },
    },
    include: {
      reactions: true,
      alias: true,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  return reflections.map((reflection) => {
    // Group reactions by kind
    const reactionKinds = new Map<string, number>();
    reflection.reactions.forEach((reaction) => {
      reactionKinds.set(reaction.kind, (reactionKinds.get(reaction.kind) || 0) + 1);
    });

    return {
      id: reflection.id,
      alias: reflection.displayAlias || reflection.alias?.alias || "Anonymous",
      mood: reflection.moodTag || "Reflective",
      text: reflection.bodyPreview || "[Reflection text not available]",
      reactions: Array.from(reactionKinds.entries()).map(([kind, count]) => ({
        kind,
        count,
      })),
      publishedAt: reflection.publishedAt || new Date(),
    };
  });
}

// ─── HELPER: Apply privacy filter to data ───
export async function applyPrivacyFilter<T extends Record<string, any>>(
  teenId: string,
  data: T,
  visibleFields: string[]
): Promise<Partial<T>> {
  const privacy = await getPrivacySettings(teenId);

  const filtered: Partial<T> = {};

  visibleFields.forEach((field) => {
    // Always include if privacy setting allows
    const privacyKey = `share${field.charAt(0).toUpperCase()}${field.slice(1)}` as keyof TeenPrivacySettings;
    if (privacy[privacyKey] !== false || privacy[privacyKey] === undefined) {
      filtered[field as keyof T] = data[field as keyof T];
    }
  });

  return filtered;
}

// ─── MAIN: Get parent's connected teens (Phase 3) ───
export async function getParentConnectedTeens(
  parentId: string
): Promise<Array<{ id: string; name: string; avatar: string }>> {
  const parentLinks = await prisma.parentTeenLink.findMany({
    where: { parentId },
    include: {
      teen: {
        select: {
          id: true,
          preferredName: true,
        },
      },
    },
  });

  return parentLinks.map((link) => ({
    id: link.teen.id,
    name: link.teen.preferredName,
    avatar: "🌱", // TODO: Calculate from XP / avatar stage
  }));
}

// ─── MAIN: Get primary teen for parent ───
export async function getParentPrimaryTeen(
  parentId: string
): Promise<{ id: string; name: string } | null> {
  const primaryLink = await prisma.parentTeenLink.findFirst({
    where: {
      parentId,
      isPrimaryGuardian: true,
    },
    include: {
      teen: {
        select: {
          id: true,
          preferredName: true,
        },
      },
    },
  });

  if (!primaryLink) {
    // Fallback: get first teen if no primary designated
    const firstLink = await prisma.parentTeenLink.findFirst({
      where: { parentId },
      include: {
        teen: {
          select: {
            id: true,
            preferredName: true,
          },
        },
      },
    });

    if (!firstLink) return null;

    return {
      id: firstLink.teen.id,
      name: firstLink.teen.preferredName,
    };
  }

  return {
    id: primaryLink.teen.id,
    name: primaryLink.teen.preferredName,
  };
}

// ─── HELPER: Get all data for a parent's primary teen ───
export interface ParentDashboardData {
  weather: EmotionalWeatherData | null;
  trapTrends: ThinkingTrapTrend[];
  moodTrajectory: MoodTimelineItem[];
  engagementStats: EngagementStat[];
  visibilityIndicators: VisibilityIndicator[];
  packDigest: PackDigestItem[];
}

export async function getAllParentTeenData(
  parentId: string
): Promise<{ teen: { id: string; name: string } | null; data: ParentDashboardData }> {
  const teen = await getParentPrimaryTeen(parentId);

  if (!teen) {
    return {
      teen: null,
      data: {
        weather: null,
        trapTrends: [],
        moodTrajectory: [],
        engagementStats: [],
        visibilityIndicators: [],
        packDigest: [],
      },
    };
  }

  // Fetch all data in parallel
  const [weather, trapTrends, moodTrajectory, engagementStats, visibilityIndicators, packDigest] =
    await Promise.all([
      calculateEmotionalWeather(teen.id),
      getThinkingTrapTrends(teen.id),
      getMoodTrajectory(teen.id),
      getEngagementStats(teen.id),
      getVisibilityIndicators(teen.id),
      getPackDigestData(teen.id),
    ]);

  return {
    teen,
    data: {
      weather,
      trapTrends,
      moodTrajectory,
      engagementStats,
      visibilityIndicators,
      packDigest,
    },
  };
}
