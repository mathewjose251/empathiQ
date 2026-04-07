import Link from "next/link";

import { ParentPackDigestView } from "../_components/PackViews";
import {
  getParentPackDigestData,
  getParentWeatherData,
  getParentTeenPackDigest,
} from "../_lib/portalApi";

/*
 * ─── DATA LAYER ──────────────────────────────────────────────
 *
 * Real data fetched from /api/parent/weather and other routes.
 * In production, teenId comes from user context (parent linked to teen).
 * For preview/demo, using fallback mock data.
 */

// TODO: Get teenId from auth context / parent user session
const DEMO_TEEN_ID = "demo-teen-001";

// Fallback data if real data fetch fails
const WEATHER_FALLBACK = {
  moodTrend: "improving" as const,
  moodLabel: "Mood trend is gently improving over the last 7 days.",
  engagementDays: 5,
  currentStreak: 4,
  avatarStage: "Sprout",
  avatarEmoji: "🌱",
  topTrap: "Catastrophizing",
  trapContext:
    "Academic pressure is turning normal stress into worst-case predictions. This is the most common pattern at this age — and it responds well to calm, curious questions from home.",
};

const PULSE_METRICS = [
  {
    label: "Active Days",
    value: "5 / 7",
    trend: "up" as const,
    detail: "Engaged 5 of the last 7 days",
  },
  {
    label: "Stories Completed",
    value: "8",
    trend: "up" as const,
    detail: "3 this week, up from 2 last week",
  },
  {
    label: "Tools Used",
    value: "12",
    trend: "steady" as const,
    detail: "Breathing and grounding are favourites",
  },
  {
    label: "Streak",
    value: "4 days",
    trend: "up" as const,
    detail: "Longest streak this month",
  },
];

const SIDEWAYS_MOMENT = {
  title: "Walk and wonder",
  emoji: "🚶",
  description:
    "During a short walk, try comparing the worst case, the best case, and the most likely outcome of one thing they are stressed about. No fixing needed — just widening the frame.",
  context:
    "Suggested because catastrophizing is the current focus area. Walking conversations reduce eye-contact pressure and let ideas flow sideways.",
};

const PRIVACY_LAYERS = [
  {
    icon: "🟢",
    label: "Always visible",
    items: "Safety alerts, general engagement (active/inactive), avatar stage",
  },
  {
    icon: "🟡",
    label: "Teen-controlled",
    items:
      "Mood trends, thinking trap focus, specific progress metrics, streak data",
  },
  {
    icon: "🔴",
    label: "Never visible",
    items:
      "Raw reflections, specific mission answers, pack posts, exact mood entries, journal content",
  },
];

function trendArrow(trend: "up" | "down" | "steady") {
  if (trend === "up") return "↑";
  if (trend === "down") return "↓";
  return "→";
}

function trendClass(trend: "up" | "down" | "steady") {
  if (trend === "up") return "parent-trend-up";
  if (trend === "down") return "parent-trend-down";
  return "parent-trend-steady";
}

export default async function ParentHomePage() {
  // Fetch real data from APIs
  const [weatherData, packDigest, teenPackDigest] = await Promise.all([
    getParentWeatherData(DEMO_TEEN_ID),
    getParentPackDigestData(),
    getParentTeenPackDigest(DEMO_TEEN_ID), // Real pack reflections
  ]);

  // Use real data if available, otherwise fallback to mock
  const WEATHER = weatherData || WEATHER_FALLBACK;

  return (
    <div className="parent-page">
      {/* ── Hero ── */}
      <section className="parent-hero">
        <div className="parent-hero-eyebrow">Parent Dashboard</div>
        <h1 className="parent-hero-title">
          Support without surveillance.
        </h1>
        <p className="parent-hero-lede">
          This dashboard translates your teen&apos;s emotional patterns into
          calm, practical language. You see the weather — not the diary.
        </p>
      </section>

      {/* ── Emotional Weather Report ── */}
      <section className="parent-weather-card">
        <div className="parent-weather-header">
          <span className="parent-section-chip">This week&apos;s emotional weather</span>
        </div>
        <div className="parent-weather-body">
          <div className="parent-weather-main">
            <div className="parent-weather-icon">
              {WEATHER.moodTrend === "improving"
                ? "🌤️"
                : WEATHER.moodTrend === "steady"
                  ? "⛅"
                  : WEATHER.moodTrend === "dipping"
                    ? "🌧️"
                    : "🌦️"}
            </div>
            <div className="parent-weather-text">
              <h2>
                {WEATHER.moodTrend === "improving"
                  ? "Skies are clearing"
                  : WEATHER.moodTrend === "steady"
                    ? "Overcast but steady"
                    : WEATHER.moodTrend === "dipping"
                      ? "Some clouds gathering"
                      : "Mixed weather"}
              </h2>
              <p>{WEATHER.moodLabel}</p>
            </div>
          </div>
          <div className="parent-weather-stats">
            <div className="parent-weather-stat">
              <span className="parent-weather-stat-value">
                {WEATHER.avatarEmoji} {WEATHER.avatarStage}
              </span>
              <span className="parent-weather-stat-label">Avatar stage</span>
            </div>
            <div className="parent-weather-stat">
              <span className="parent-weather-stat-value">
                🔥 {WEATHER.currentStreak}
              </span>
              <span className="parent-weather-stat-label">Day streak</span>
            </div>
            <div className="parent-weather-stat">
              <span className="parent-weather-stat-value">
                📅 {WEATHER.engagementDays}/7
              </span>
              <span className="parent-weather-stat-label">Active days</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Thinking Trap Spotlight ── */}
      <section className="parent-trap-spotlight">
        <div className="parent-trap-header">
          <span className="parent-section-chip">Current focus area</span>
          <Link className="parent-link-subtle" href="/parent/learn">
            Learn more →
          </Link>
        </div>
        <div className="parent-trap-body">
          <div className="parent-trap-name">
            <span className="parent-trap-icon">🧠</span>
            <h3>{WEATHER.topTrap}</h3>
          </div>
          <p>{WEATHER.trapContext}</p>
        </div>
      </section>

      {/* ── Weekly Pulse Metrics ── */}
      <section className="parent-pulse">
        <span className="parent-section-chip">Weekly pulse</span>
        <div className="parent-pulse-grid">
          {PULSE_METRICS.map((m) => (
            <div className="parent-pulse-card" key={m.label}>
              <div className="parent-pulse-top">
                <span className="parent-pulse-label">{m.label}</span>
                <span className={trendClass(m.trend)}>
                  {trendArrow(m.trend)}
                </span>
              </div>
              <strong className="parent-pulse-value">{m.value}</strong>
              <p className="parent-pulse-detail">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sideways Moment ── */}
      <section className="parent-moment-card">
        <div className="parent-moment-header">
          <span className="parent-section-chip">Suggested moment</span>
          <Link className="parent-link-subtle" href="/parent/moments">
            See all →
          </Link>
        </div>
        <div className="parent-moment-body">
          <span className="parent-moment-emoji">{SIDEWAYS_MOMENT.emoji}</span>
          <div>
            <h3>{SIDEWAYS_MOMENT.title}</h3>
            <p>{SIDEWAYS_MOMENT.description}</p>
            <p className="parent-moment-context">{SIDEWAYS_MOMENT.context}</p>
          </div>
        </div>
      </section>

      {/* ── Survey Callout ── */}
      <section className="parent-survey-callout">
        <div>
          <span className="parent-section-chip">Parent survey</span>
          <h3>
            Capture the home and school pressure before it turns into blame
          </h3>
          <p>
            This survey stays on the same page after submit. It helps us map
            the family system, teacher tension, and academic overload so that
            insights here are sharper.
          </p>
        </div>
        <Link className="parent-cta-btn" href="/parent/survey">
          Open survey
        </Link>
      </section>

      {/* ── Privacy Architecture ── */}
      <section className="parent-privacy-section">
        <span className="parent-section-chip">How privacy works</span>
        <h3>Your teen controls the dial</h3>
        <p className="parent-privacy-lede">
          EmpathiQ uses a graduated privacy model. Teens choose what flows to
          you. Safety is the only exception, and even then your teen is told
          exactly what was shared and why.
        </p>
        <div className="parent-privacy-grid">
          {PRIVACY_LAYERS.map((layer) => (
            <div className="parent-privacy-row" key={layer.label}>
              <span className="parent-privacy-dot">{layer.icon}</span>
              <div>
                <strong>{layer.label}</strong>
                <p>{layer.items}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pack Digest ── */}
      <section className="parent-pack-section">
        <span className="parent-section-chip">Pack community trends</span>
        <ParentPackDigestView digest={packDigest} />
      </section>
    </div>
  );
}
