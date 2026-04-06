"use client";

import { useRouter } from "next/navigation";
import { useTeen, getAvatarStage, getLevel, AVATAR_EMOJI, AVATAR_LABELS, getNextThreshold } from "../_context/TeenContext";

// Achievement definitions
interface Achievement {
  id: string;
  name: string;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  { id: "first_story", name: "First Story", color: "var(--teen-accent)" },
  { id: "five_stories", name: "5 Stories", color: "var(--teen-purple)" },
  { id: "7_day_streak", name: "7-Day Streak", color: "var(--teen-amber)" },
  { id: "30_day_streak", name: "30-Day Streak", color: "var(--teen-amber)" },
  { id: "first_evolution", name: "First Evolution", color: "var(--teen-green)" },
  { id: "first_100xp", name: "100 XP Club", color: "var(--teen-purple)" },
];

// Weekly thinking trap pattern
const WEEKLY_PATTERN = [
  { label: "Accurate Thinking", count: 6, color: "var(--teen-green)" },
  { label: "Catastrophizing", count: 2, color: "var(--teen-rose)" },
  { label: "Mind Reading", count: 1, color: "var(--teen-amber)" },
];

// Weekly streak calendar
const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const COMPLETED_DAYS = [true, true, false, true, true, false, false]; // hardcoded pattern

export default function MePage() {
  const teen = useTeen();
  const router = useRouter();

  const stage = getAvatarStage(teen.totalXP);
  const level = getLevel(teen.totalXP);
  const nextThreshold = getNextThreshold(teen.totalXP);
  const currentStageThreshold = stage === "SEEDLING" ? 0 : stage === "SPROUT" ? 500 : stage === "SAPLING" ? 1000 : stage === "TREE" ? 2500 : 5000;
  const xpRange = nextThreshold - currentStageThreshold;
  const xpProgress = xpRange > 0 ? ((teen.totalXP - currentStageThreshold) / xpRange) * 100 : 100;

  const handleResetJourney = () => {
    if (confirm("Are you sure you want to reset your journey? This cannot be undone.")) {
      teen.resetState();
      router.push("/teen/onboarding");
    }
  };

  return (
    <div className="teen-page">
      {/* Avatar display */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <div className="avatar-display">{AVATAR_EMOJI[stage]}</div>
        <h1 className="teen-text-center" style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "4px" }}>
          {AVATAR_LABELS[stage]}
        </h1>
        <div className="teen-text-center teen-text-muted">
          Level {level} • {teen.totalXP} XP
        </div>
      </div>

      {/* XP Progress bar */}
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "0.75rem", color: "var(--teen-muted)", marginBottom: "6px" }}>
          {teen.totalXP} / {nextThreshold} XP to next stage
        </div>
        <div className="teen-progress">
          <div className="teen-progress-fill" style={{ width: `${xpProgress}%` }} />
        </div>
      </div>

      {/* Stat row */}
      <div className="stat-row">
        <div className="stat">
          <div className="stat-value teen-text-amber">🔥 {teen.currentStreak}</div>
          <div className="stat-label">Streak</div>
        </div>
        <div className="stat">
          <div className="stat-value teen-text-accent">📖 {teen.storiesCompleted}</div>
          <div className="stat-label">Stories</div>
        </div>
        <div className="stat">
          <div className="stat-value teen-text-green">{teen.pathARate}%</div>
          <div className="stat-label">Path A</div>
        </div>
      </div>

      {/* Achievements section */}
      <div className="teen-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>
          Achievements
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {ACHIEVEMENTS.map((achievement) => {
            const isEarned = teen.achievements.includes(achievement.id);
            return (
              <div
                key={achievement.id}
                style={{
                  padding: "6px 12px",
                  borderRadius: "16px",
                  fontSize: "0.8rem",
                  fontWeight: "600",
                  border: `1px solid ${isEarned ? achievement.color : "var(--teen-border)"}`,
                  backgroundColor: isEarned
                    ? `${achievement.color}20`
                    : "transparent",
                  color: isEarned ? achievement.color : "var(--teen-muted)",
                  opacity: isEarned ? 1 : 0.5,
                }}
              >
                {achievement.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* My Thinking Growth card */}
      <div className="teen-card teen-card-glow-purple" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>
          My Thinking Growth
        </h2>
        <p style={{ fontSize: "0.85rem", lineHeight: "1.6", color: "var(--teen-text)" }}>
          You're building awareness of how your mind works. Every story you explore, every choice you make—it's helping you recognize your thinking patterns. Keep going. Growth isn't linear, but you're on the path. 🌱
        </p>
      </div>

      {/* Thinking trap breakdown */}
      <div className="teen-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>
          Thinking Patterns This Week
        </h2>
        {WEEKLY_PATTERN.map((pattern) => (
          <div key={pattern.label} style={{ marginBottom: "12px" }}>
            <div style={{ fontSize: "0.8rem", marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
              <span>{pattern.label}</span>
              <span style={{ color: pattern.color, fontWeight: "600" }}>{pattern.count}x</span>
            </div>
            <div className="teen-progress">
              <div
                className="teen-progress-fill"
                style={{
                  background: pattern.color,
                  width: `${(pattern.count / 9) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Weekly streak calendar */}
      <div className="teen-card" style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>
          This Week
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "8px" }}>
          {WEEK_DAYS.map((day, idx) => (
            <div key={day} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.75rem", color: "var(--teen-muted)", marginBottom: "4px" }}>
                {day}
              </div>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  margin: "0 auto",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  border: COMPLETED_DAYS[idx]
                    ? "2px solid var(--teen-green)"
                    : "2px dashed var(--teen-border)",
                  backgroundColor: COMPLETED_DAYS[idx]
                    ? "rgba(16, 185, 129, 0.1)"
                    : "transparent",
                }}
              >
                {COMPLETED_DAYS[idx] ? "✓" : ""}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Controls Link */}
      <div
        className="privacy-link-card"
        onClick={() => router.push("/teen/privacy")}
        style={{ marginBottom: "20px" }}
      >
        <span className="privacy-link-card-icon">🔒</span>
        <div className="privacy-link-card-text">
          <div className="privacy-link-card-title">Your Privacy Dial</div>
          <div className="privacy-link-card-desc">
            Control what your parent sees on their dashboard
          </div>
        </div>
        <span className="privacy-link-card-count">
          {Object.entries(teen.privacy).filter(
            ([k, v]) => k !== "shareAvatarStage" && v === true
          ).length} / 4 shared
        </span>
      </div>

      {/* Reset Journey button */}
      <button
        onClick={handleResetJourney}
        className="teen-btn teen-btn-rose"
        style={{ marginTop: "24px" }}
      >
        Reset Journey
      </button>
    </div>
  );
}
