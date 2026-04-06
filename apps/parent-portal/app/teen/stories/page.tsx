"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { getTeenStoryCards } from "../../_lib/teenMissionCatalog";
import { useTeen } from "../_context/TeenContext";

const FILTERS = ["All", "School", "Peer", "Family", "Self", "Digital"] as const;

export default function StoriesPage() {
  const teen = useTeen();
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All");
  const stories = useMemo(() => getTeenStoryCards(), []);

  const filteredStories =
    activeFilter === "All"
      ? stories
      : stories.filter((story) => story.themeLabel === activeFilter);

  const exploredCount = Math.min(teen.storiesCompleted, stories.length);

  return (
    <div className="teen-page">
      <div className="social-proof">
        {exploredCount} of {stories.length} stories explored
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "12px",
          marginBottom: "16px",
          scrollBehavior: "smooth",
        }}
      >
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`teen-btn-outline ${activeFilter === filter ? "active" : ""}`}
            style={{
              flexShrink: 0,
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              width: "auto",
              ...(activeFilter === filter && {
                borderColor: "var(--teen-accent)",
                color: "var(--teen-accent)",
              }),
            }}
          >
            {filter}
          </button>
        ))}
      </div>

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
