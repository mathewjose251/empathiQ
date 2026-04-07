import Link from "next/link";

import { getParentInsightsData } from "../../_lib/portalApi";
import type { ThinkingTrapTrend, MoodTimelineItem, EngagementStat, VisibilityIndicator } from "../../_lib/parentDataEngine";

/*
 * ─── PARENT INSIGHTS ─────────────────────────────────────────
 *
 * Deeper view: thinking trap trends, mood trajectory, engagement
 * timeline, and privacy indicators. All data is aggregated — no
 * raw reflections are ever shown.
 *
 * Data fetched from /api/parent/insights with real Prisma queries.
 */

// TODO: Get teenId from auth context
const DEMO_TEEN_ID = "demo-teen-001";

const TRAP_TRENDS_FALLBACK: ThinkingTrapTrend[] = [
  {
    name: "Catastrophizing",
    percentage: 41,
    trend: "rising" as const,
    description:
      "Pressure moments are fast-tracking into worst-case stories, especially around exams and performance events.",
    weeklyChange: "+8%",
  },
  {
    name: "All-or-Nothing Thinking",
    percentage: 26,
    trend: "steady" as const,
    description:
      "Shows up after social setbacks. One bad event becomes evidence that everything is failing.",
    weeklyChange: "+1%",
  },
  {
    name: "Mind Reading",
    percentage: 18,
    trend: "softening" as const,
    description:
      "Assuming what peers think without asking. This pattern is softening as social missions complete.",
    weeklyChange: "-4%",
  },
  {
    name: "Emotional Reasoning",
    percentage: 10,
    trend: "steady" as const,
    description:
      "Feeling anxious is being read as proof that something is wrong, rather than a normal stress signal.",
    weeklyChange: "0%",
  },
  {
    name: "Should Statements",
    percentage: 5,
    trend: "softening" as const,
    description:
      "Rigid rules about how things 'should' be. Easing as family-themed missions widen perspective.",
    weeklyChange: "-2%",
  },
];

const MOOD_TRAJECTORY_FALLBACK: MoodTimelineItem[] = [
  { week: "Week 1", label: "Mixed" as const, emoji: "🌦️", note: "Onboarding period — adjusting to the format" },
  { week: "Week 2", label: "Dipping" as const, emoji: "🌧️", note: "Exam week spike in anxiety-related check-ins" },
  { week: "Week 3", label: "Steady" as const, emoji: "⛅", note: "Started using breathing tool regularly" },
  { week: "Week 4", label: "Improving" as const, emoji: "🌤️", note: "Streak building, more grounded path choices" },
];

const ENGAGEMENT_STATS_FALLBACK: EngagementStat[] = [
  { label: "Total missions completed", value: "8" },
  { label: "Grounded path choices", value: "62%" },
  { label: "Reflections shared to Pack", value: "5" },
  { label: "Tools used this month", value: "12" },
  { label: "Average session length", value: "4.2 min" },
  { label: "Longest streak", value: "7 days" },
];

const VISIBILITY_INDICATORS_FALLBACK: VisibilityIndicator[] = [
  { feature: "Mood trend line", visible: true, teenLabel: "Shared by your teen" },
  { feature: "Thinking trap categories", visible: true, teenLabel: "Shared by your teen" },
  { feature: "Engagement frequency", visible: true, teenLabel: "Always visible" },
  { feature: "Avatar and XP progress", visible: true, teenLabel: "Always visible" },
  { feature: "Specific mission choices", visible: false, teenLabel: "Your teen chose to keep this private" },
  { feature: "Pack reflections", visible: false, teenLabel: "Never shared — Pack privacy boundary" },
  { feature: "Raw mood check-in values", visible: false, teenLabel: "Your teen chose to keep this private" },
];

function trendIcon(trend: "rising" | "steady" | "softening") {
  if (trend === "rising") return "📈";
  if (trend === "softening") return "📉";
  return "➡️";
}

function trendColor(trend: "rising" | "steady" | "softening") {
  if (trend === "rising") return "parent-trend-rising";
  if (trend === "softening") return "parent-trend-softening";
  return "parent-trend-steady";
}

export default async function ParentInsightsPage() {
  // Fetch real data from API
  const insightsData = await getParentInsightsData(DEMO_TEEN_ID);

  const TRAP_TRENDS = insightsData.trapTrends.length > 0
    ? insightsData.trapTrends
    : TRAP_TRENDS_FALLBACK;

  const MOOD_TRAJECTORY = insightsData.moodTrajectory.length > 0
    ? insightsData.moodTrajectory
    : MOOD_TRAJECTORY_FALLBACK;

  const ENGAGEMENT_STATS = insightsData.engagementStats.length > 0
    ? insightsData.engagementStats
    : ENGAGEMENT_STATS_FALLBACK;

  const VISIBILITY_INDICATORS = insightsData.visibilityIndicators.length > 0
    ? insightsData.visibilityIndicators
    : VISIBILITY_INDICATORS_FALLBACK;

  return (
    <div className="parent-page">
      <section className="parent-hero parent-hero-compact">
        <div className="parent-hero-eyebrow">Insights</div>
        <h1 className="parent-hero-title">Patterns, not pages.</h1>
        <p className="parent-hero-lede">
          These insights are generated from aggregated activity — mood trends,
          thinking trap categories, and engagement patterns. No raw text,
          specific answers, or Pack reflections are shown.
        </p>
      </section>

      {/* ── Thinking Trap Trend Bars ── */}
      <section className="parent-section">
        <div className="parent-section-header">
          <span className="parent-section-chip">Thinking trap trends</span>
          <Link className="parent-link-subtle" href="/parent/learn">
            Learn about these traps →
          </Link>
        </div>
        <div className="parent-trap-list">
          {TRAP_TRENDS.map((trap) => (
            <div className="parent-trap-row" key={trap.name}>
              <div className="parent-trap-row-top">
                <span className="parent-trap-row-name">{trap.name}</span>
                <span className={`parent-trap-row-change ${trendColor(trap.trend)}`}>
                  {trendIcon(trap.trend)} {trap.weeklyChange}
                </span>
              </div>
              <div className="parent-bar-track">
                <div
                  className={`parent-bar-fill ${trendColor(trap.trend)}`}
                  style={{ width: `${trap.percentage}%` }}
                />
              </div>
              <p className="parent-trap-row-desc">{trap.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mood Trajectory ── */}
      <section className="parent-section">
        <span className="parent-section-chip">Mood trajectory</span>
        <div className="parent-trajectory">
          {MOOD_TRAJECTORY.map((week, i) => (
            <div className="parent-trajectory-step" key={week.week}>
              <div className="parent-trajectory-dot">
                <span className="parent-trajectory-emoji">{week.emoji}</span>
                {i < MOOD_TRAJECTORY.length - 1 && (
                  <div className="parent-trajectory-line" />
                )}
              </div>
              <div className="parent-trajectory-content">
                <strong>{week.week}</strong>
                <span className="parent-trajectory-label">{week.label}</span>
                <p>{week.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Engagement Stats ── */}
      <section className="parent-section">
        <span className="parent-section-chip">Engagement summary</span>
        <div className="parent-stat-grid">
          {ENGAGEMENT_STATS.map((stat) => (
            <div className="parent-stat-card" key={stat.label}>
              <strong className="parent-stat-value">{stat.value}</strong>
              <span className="parent-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Visibility Indicators ── */}
      <section className="parent-section">
        <span className="parent-section-chip">What you can and cannot see</span>
        <p className="parent-visibility-lede">
          Your teen controls the privacy dial. Items marked &quot;private&quot; are
          hidden because your teen chose that. Safety alerts always override
          privacy — and when they do, your teen is told what was shared.
        </p>
        <div className="parent-visibility-list">
          {VISIBILITY_INDICATORS.map((item) => (
            <div
              className={`parent-visibility-row ${item.visible ? "parent-vis-on" : "parent-vis-off"}`}
              key={item.feature}
            >
              <span className="parent-vis-icon">
                {item.visible ? "👁️" : "🔒"}
              </span>
              <div className="parent-vis-text">
                <strong>{item.feature}</strong>
                <span>{item.teenLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
