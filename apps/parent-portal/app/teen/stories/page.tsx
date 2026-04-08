"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { getTeenStoryCards } from "../../_lib/teenMissionCatalog";
import { useTeen } from "../_context/TeenContext";

const THEME_FILTERS = ["All", "School", "Peer", "Family", "Self", "Digital"] as const;

type GoalFilter = "All" | "anxious" | "comparing" | "low" | "conflict" | "pressure" | "self";

const GOAL_FILTERS: { key: GoalFilter; emoji: string; label: string }[] = [
  { key: "All", emoji: "✦", label: "All stories" },
  { key: "anxious", emoji: "😰", label: "I'm anxious" },
  { key: "comparing", emoji: "📱", label: "Comparing myself" },
  { key: "low", emoji: "😔", label: "Feeling low" },
  { key: "conflict", emoji: "⚡", label: "Family/friend drama" },
  { key: "pressure", emoji: "📚", label: "School pressure" },
  { key: "self", emoji: "🪞", label: "Struggling with myself" },
];

// Which slugs map to each goal
const GOAL_SLUG_MAP: Record<Exclude<GoalFilter, "All">, string[]> = {
  anxious: ["night-before-finals", "presentation-fear", "college-decision", "crush-worry", "phone-late-night", "caffeine-before-bed"],
  comparing: ["peer-achievement", "social-media-comparison", "different-from-peers"],
  low: ["mirror-moment", "mistake-at-work", "friend-text-unanswered"],
  conflict: ["family-dinner-tension", "sibling-boundary-crossed"],
  pressure: ["night-before-finals", "grade-on-test", "presentation-fear", "college-decision"],
  self: ["mirror-moment", "mistake-at-work", "different-from-peers", "phone-late-night"],
};

type FilterMode = "theme" | "goal";

export default function StoriesPage() {
  const teen = useTeen();
  const [filterMode, setFilterMode] = useState<FilterMode>("goal");
  const [activeTheme, setActiveTheme] = useState<(typeof THEME_FILTERS)[number]>("All");
  const [activeGoal, setActiveGoal] = useState<GoalFilter>("All");
  const stories = useMemo(() => getTeenStoryCards(), []);

  const filteredStories = useMemo(() => {
    if (filterMode === "theme") {
      return activeTheme === "All"
        ? stories
        : stories.filter((s) => s.themeLabel === activeTheme);
    }
    if (activeGoal === "All") return stories;
    return stories.filter((s) => GOAL_SLUG_MAP[activeGoal].includes(s.slug));
  }, [filterMode, activeTheme, activeGoal, stories]);

  const exploredCount = Math.min(teen.storiesCompleted, stories.length);

  return (
    <div className="teen-page">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <p className="section-heading">Stories</p>
        <div className="social-proof">
          {exploredCount} of {stories.length} explored
        </div>
      </div>

      {/* Mode toggle */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 14,
          padding: "4px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 12,
          border: "1px solid var(--teen-border)",
        }}
      >
        {(["goal", "theme"] as FilterMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setFilterMode(mode)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: 9,
              border: "none",
              background: filterMode === mode ? "rgba(6,182,212,0.15)" : "transparent",
              color: filterMode === mode ? "var(--teen-accent)" : "var(--teen-muted)",
              fontSize: "0.82rem",
              cursor: "pointer",
              fontWeight: filterMode === mode ? 600 : 400,
              transition: "all 0.2s",
            }}
          >
            {mode === "goal" ? "By feeling" : "By topic"}
          </button>
        ))}
      </div>

      {/* Goal-based filters */}
      {filterMode === "goal" && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "12px",
            marginBottom: "16px",
            scrollbarWidth: "none",
          }}
        >
          {GOAL_FILTERS.map(({ key, emoji, label }) => (
            <button
              key={key}
              onClick={() => setActiveGoal(key)}
              style={{
                flexShrink: 0,
                padding: "8px 14px",
                borderRadius: 999,
                border: `1px solid ${activeGoal === key ? "var(--teen-accent)" : "var(--teen-border)"}`,
                background: activeGoal === key ? "rgba(6,182,212,0.1)" : "transparent",
                color: activeGoal === key ? "var(--teen-accent)" : "var(--teen-muted)",
                fontSize: "0.83rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      )}

      {/* Theme-based filters */}
      {filterMode === "theme" && (
        <div
          style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            paddingBottom: "12px",
            marginBottom: "16px",
            scrollbarWidth: "none",
          }}
        >
          {THEME_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveTheme(filter)}
              style={{
                flexShrink: 0,
                padding: "8px 16px",
                borderRadius: 999,
                border: `1px solid ${activeTheme === filter ? "var(--teen-accent)" : "var(--teen-border)"}`,
                background: activeTheme === filter ? "rgba(6,182,212,0.1)" : "transparent",
                color: activeTheme === filter ? "var(--teen-accent)" : "var(--teen-muted)",
                fontSize: "0.85rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "all 0.2s",
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      )}

      {/* Story cards */}
      <div>
        {filteredStories.length === 0 ? (
          <div className="teen-text-center teen-text-muted" style={{ marginTop: "32px" }}>
            No stories found
          </div>
        ) : (
          filteredStories.map((story) => (
            <Link key={story.slug} href={`/teen/mission/${story.slug}`}>
              <div className="story-card">
                <div className="story-theme">{story.theme.toUpperCase()}</div>
                <div className="story-title">{story.title}</div>
                <div className="story-desc">{story.shortDesc}</div>
                <div className="story-meta">
                  <span>⏱️ {story.minutes} min</span>
                  <span>✨ {story.xpReward} XP</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
