"use client";

import { useState } from "react";
import Link from "next/link";
import { useTeen } from "../_context/TeenContext";

// Mission data (15 missions)
const MISSIONS = [
  {
    slug: "night-before-finals",
    title: "Night Before Finals",
    theme: "school",
    shortDesc: "Can't sleep the night before your big exam? Let's work through the anxiety.",
    minutes: 8,
    xpReward: 30,
  },
  {
    slug: "grade-on-test",
    title: "That Grade on the Test",
    theme: "school",
    shortDesc: "You studied hard but the grade disappointed you. What's going through your head?",
    minutes: 10,
    xpReward: 30,
  },
  {
    slug: "presentation-fear",
    title: "Presentation Fear",
    theme: "school",
    shortDesc: "Presenting in front of the whole class tomorrow. The panic is real.",
    minutes: 7,
    xpReward: 30,
  },
  {
    slug: "college-decision",
    title: "College Decision Stress",
    theme: "school",
    shortDesc: "Where should you apply? The pressure is mounting from all sides.",
    minutes: 12,
    xpReward: 30,
  },
  {
    slug: "peer-achievement",
    title: "When Friends Succeed",
    theme: "peer",
    shortDesc: "Your friend got something you wanted. Celebrating for them feels complicated.",
    minutes: 9,
    xpReward: 30,
  },
  {
    slug: "social-media-comparison",
    title: "Scroll and Compare",
    theme: "digital",
    shortDesc: "Everyone's life looks perfect online. Why does yours feel so average?",
    minutes: 8,
    xpReward: 30,
  },
  {
    slug: "crush-worry",
    title: "Crush Worry",
    theme: "peer",
    shortDesc: "Do they like you back? The uncertainty is eating at you.",
    minutes: 9,
    xpReward: 30,
  },
  {
    slug: "friend-text-unanswered",
    title: "That Text Left on Read",
    theme: "peer",
    shortDesc: "You sent a message and... radio silence. Are they mad? Did you say something wrong?",
    minutes: 7,
    xpReward: 30,
  },
  {
    slug: "different-from-peers",
    title: "Different From Peers",
    theme: "peer",
    shortDesc: "You're interested in things your friends don't care about. Do you belong?",
    minutes: 10,
    xpReward: 30,
  },
  {
    slug: "family-dinner-tension",
    title: "Family Dinner Tension",
    theme: "family",
    shortDesc: "Dinner conversations turn into arguments. Why can't things just be calm?",
    minutes: 9,
    xpReward: 30,
  },
  {
    slug: "sibling-boundary-crossed",
    title: "Sibling Drama",
    theme: "family",
    shortDesc: "Your sibling crossed a line. You're furious and they don't get why.",
    minutes: 8,
    xpReward: 30,
  },
  {
    slug: "mistake-at-work",
    title: "Mistake at Work",
    theme: "self",
    shortDesc: "You messed up at your job. Now you're replaying it in your head.",
    minutes: 7,
    xpReward: 30,
  },
  {
    slug: "caffeine-before-bed",
    title: "Wired Before Bed",
    theme: "digital",
    shortDesc: "Coffee at 4pm seemed like a good idea. Now you can't sleep and your mind won't shut up.",
    minutes: 6,
    xpReward: 30,
  },
  {
    slug: "mirror-moment",
    title: "Mirror Moment",
    theme: "self",
    shortDesc: "You caught your reflection and the thoughts went dark. Let's untangle this.",
    minutes: 8,
    xpReward: 30,
  },
  {
    slug: "phone-late-night",
    title: "Phone Doom Scroll",
    theme: "digital",
    shortDesc: "It's 2am and you're still scrolling. Why can't you put it down?",
    minutes: 7,
    xpReward: 30,
  },
];

// Theme display names and colors
const THEME_DISPLAY: Record<string, string> = {
  school: "School",
  peer: "Peer",
  family: "Family",
  self: "Self",
  digital: "Digital",
};

export default function StoriesPage() {
  const teen = useTeen();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  // Filter missions
  const filteredMissions =
    activeFilter === "All"
      ? MISSIONS
      : MISSIONS.filter((m) => m.theme === activeFilter.toLowerCase());

  const exploredCount = Math.min(teen.storiesCompleted, 15);
  const filters = ["All", "School", "Peer", "Family", "Self", "Digital"];

  return (
    <div className="teen-page">
      {/* Progress banner */}
      <div className="social-proof">
        {exploredCount} of 15 stories explored
      </div>

      {/* Filter tabs */}
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
        {filters.map((filter) => (
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

      {/* Missions list */}
      <div>
        {filteredMissions.length === 0 ? (
          <div className="teen-text-center teen-text-muted" style={{ marginTop: "32px" }}>
            No stories found
          </div>
        ) : (
          filteredMissions.map((mission) => (
            <Link key={mission.slug} href={`/teen/mission/${mission.slug}`}>
              <div className="story-card">
                <div className="story-theme">{mission.theme.toUpperCase()}</div>
                <div className="story-title">{mission.title}</div>
                <div className="story-desc">{mission.shortDesc}</div>
                <div className="story-meta">
                  <span>⏱️ {mission.minutes} min</span>
                  <span>✨ {mission.xpReward} XP</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
