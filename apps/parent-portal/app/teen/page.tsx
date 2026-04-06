"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useTeen,
  MOOD_OPTIONS_QUICK,
  MoodKey,
  getAvatarStage,
  AVATAR_EMOJI,
} from "./_context/TeenContext";

const MOOD_MISSIONS: Record<string, { slug: string; title: string; theme: string; desc: string; minutes: number; xp: number }> = {
  anxious: {
    slug: "night-before-finals",
    title: "The Night Before Finals",
    theme: "School",
    desc: "Your phone lights up with an exam reminder. 40% of your grade. Your heart starts pounding...",
    minutes: 5,
    xp: 30,
  },
  low: {
    slug: "mirror-moment",
    title: "Mirror Moment",
    theme: "Self",
    desc: "You catch your reflection and the voice in your head starts picking apart every detail...",
    minutes: 3,
    xp: 25,
  },
  great: {
    slug: "peer-achievement",
    title: "When a Friend Wins Big",
    theme: "Peer",
    desc: "Your best friend just got the scholarship you both applied for. They're celebrating...",
    minutes: 4,
    xp: 25,
  },
  okay: {
    slug: "friend-text-unanswered",
    title: "The Text That Was Left on Read",
    theme: "Peer",
    desc: "Your best friend hasn't replied in 3 hours. Your mind starts spinning...",
    minutes: 4,
    xp: 25,
  },
  default: {
    slug: "social-media-comparison",
    title: "The Scroll That Stings",
    theme: "Digital",
    desc: "Everyone on your feed looks like they're having the best summer. Meanwhile you're just...",
    minutes: 4,
    xp: 25,
  },
};

const PACK_COUNTS = [23, 27, 31, 18, 34, 29];

// Animated XP counter hook
function useCountUp(target: number, duration = 800) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target, duration]);

  return display;
}

export default function TeenHomePage() {
  const router = useRouter();
  const teen = useTeen();
  const [moodSelected, setMoodSelected] = useState<MoodKey | null>(null);
  const [showMoodConfirm, setShowMoodConfirm] = useState(false);
  const [packCount] = useState(() => PACK_COUNTS[Math.floor(Math.random() * PACK_COUNTS.length)]);

  const xpDisplay = useCountUp(teen.totalXP, 900);

  useEffect(() => {
    if (!teen.isOnboarded) {
      router.replace("/teen/onboarding");
    }
  }, [teen.isOnboarded, router]);

  if (!teen.isOnboarded) return null;

  const stage = getAvatarStage(teen.totalXP);
  const stageEmoji = AVATAR_EMOJI[stage];
  const mission = teen.todayMood
    ? MOOD_MISSIONS[teen.todayMood] || MOOD_MISSIONS.default
    : moodSelected
      ? MOOD_MISSIONS[moodSelected] || MOOD_MISSIONS.default
      : null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleMoodSelect = (mood: MoodKey) => {
    setMoodSelected(mood);
    setShowMoodConfirm(true);
    teen.setMood(mood);
  };

  const currentMoodOption = MOOD_OPTIONS_QUICK.find(
    (m) => m.key === (teen.todayMood || moodSelected)
  );

  return (
    <div className="teen-page page-enter">

      {/* === HEADER: Greeting + Live XP === */}
      <div className="teen-flex-between" style={{ paddingTop: 8, marginBottom: 16 }}>
        <div className="home-greeting">
          <p className="home-greeting-sub">{getGreeting()} ✦</p>
          <p className="home-greeting-name">
            Hey there 👋
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="xp-badge" style={{ marginBottom: 6 }}>
            {stageEmoji} {xpDisplay} XP
          </div>
          {teen.currentStreak > 0 && (
            <div className="streak-badge">
              <span className="streak-fire">🔥</span>
              {teen.currentStreak} day{teen.currentStreak !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>

      {/* === VIBE CHECK / Confirmed mood === */}
      {!teen.moodCheckedToday && !showMoodConfirm ? (
        <div className="teen-card teen-card-glow-cyan teen-fade-in" style={{ marginBottom: 16 }}>
          <p
            style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 4 }}
            className="teen-text-center"
          >
            What&apos;s your vibe right now?
          </p>
          <p className="teen-text-center teen-text-muted teen-text-small" style={{ marginBottom: 14 }}>
            Tap one — takes 2 seconds
          </p>
          <div className="mood-grid">
            {MOOD_OPTIONS_QUICK.map((m) => (
              <button
                key={m.key}
                className={`mood-item ${moodSelected === m.key ? "selected" : ""}`}
                onClick={() => handleMoodSelect(m.key)}
              >
                {m.emoji}
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="teen-card teen-fade-in"
          style={{ borderColor: "var(--teen-amber)", background: "rgba(245,158,11,0.05)", marginBottom: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: "1.8rem" }}>{currentMoodOption?.emoji || "✨"}</span>
            <div>
              <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--teen-amber)" }}>
                {teen.todayMood === "great" || moodSelected === "great"
                  ? "Feeling great — let's channel it."
                  : teen.todayMood === "anxious" || moodSelected === "anxious"
                    ? "Anxious? That's okay. You're not alone."
                    : teen.todayMood === "low" || moodSelected === "low"
                      ? "Feeling low? We're here with you."
                      : "Checked in ✓ Let's make it count."}
              </p>
              <p className="teen-text-muted teen-text-xs">+10 XP for checking in</p>
            </div>
          </div>
        </div>
      )}

      {/* === SOCIAL PROOF === */}
      <div className="social-proof" style={{ marginBottom: 16 }}>
        🌊 {packCount} teens in your pack checked in today
      </div>

      <div className="teen-card teen-card-glow-purple teen-fade-in" style={{ marginBottom: 16 }}>
        <div className="teen-flex-between" style={{ gap: 12, alignItems: "center" }}>
          <div>
            <p className="section-heading" style={{ marginBottom: 6 }}>Voice survey</p>
            <p className="teen-text-muted teen-text-small">
              Tell us what is really causing the pressure at home and school. It saves inline and does not redirect.
            </p>
          </div>
          <button className="teen-btn teen-btn-secondary" onClick={() => router.push("/teen/survey")}>
            Open survey
          </button>
        </div>
      </div>

      {/* === TODAY'S STORY (pulsing CTA) === */}
      <p className="section-heading">Today&apos;s Story</p>

      {mission ? (
        <>
          <div
            className="story-card story-card-pulse teen-fade-in"
            onClick={() => router.push(`/teen/mission/${mission.slug}`)}
            style={{ cursor: "pointer" }}
          >
            <div className="story-theme">
              {teen.moodCheckedToday || moodSelected ? "✨ Matched for your vibe" : "📖 Today's Pick"}
            </div>
            <div className="story-title">{mission.title}</div>
            <div className="story-desc">{mission.desc}</div>
            <div className="story-meta">
              <span>⏱ {mission.minutes} min</span>
              <span>🏷 {mission.theme}</span>
              <span>⭐ +{mission.xp} XP</span>
            </div>
          </div>
          <button
            className="teen-btn teen-btn-accent"
            onClick={() => router.push(`/teen/mission/${mission.slug}`)}
            style={{ marginBottom: 8 }}
          >
            Start This Story →
          </button>
          <button
            className="teen-btn teen-btn-outline"
            onClick={() => router.push("/teen/stories")}
          >
            Browse All Stories
          </button>
        </>
      ) : (
        <div className="teen-card teen-card-glow-cyan teen-text-center" style={{ marginBottom: 8 }}>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Tap your vibe above to unlock today&apos;s story</p>
          <p className="teen-text-muted teen-text-small">
            We match the story to how you feel right now
          </p>
        </div>
      )}

      {/* === QUICK LINKS GRID === */}
      <p className="section-heading">Quick Access</p>
      <div className="quick-link-grid">
        <a className="quick-link-card" onClick={() => router.push("/teen/toolbox")} style={{ cursor: "pointer" }}>
          <span className="quick-link-icon">🧰</span>
          <span className="quick-link-label">Toolbox</span>
        </a>
        <a className="quick-link-card" onClick={() => router.push("/teen/pack")} style={{ cursor: "pointer" }}>
          <span className="quick-link-icon">🏕️</span>
          <span className="quick-link-label">
            My Pack {packCount > 20 && <span className="pack-new-dot" />}
          </span>
        </a>
        <a className="quick-link-card" onClick={() => router.push("/teen/me")} style={{ cursor: "pointer" }}>
          <span className="quick-link-icon">📈</span>
          <span className="quick-link-label">My Progress</span>
        </a>
        <a className="quick-link-card" onClick={() => router.push("/teen/safety")} style={{ cursor: "pointer" }}>
          <span className="quick-link-icon">🤝</span>
          <span className="quick-link-label">Need Help?</span>
        </a>
      </div>

      {/* === AVATAR TEASER === */}
      {teen.totalXP < 500 && (
        <div
          className="teen-card teen-text-center"
          style={{ borderColor: "var(--teen-purple)", background: "rgba(139,92,246,0.05)", marginTop: 8 }}
        >
          <p style={{ fontSize: "1.8rem", marginBottom: 6 }}>{stageEmoji}</p>
          <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>Your seedling is growing</p>
          <p className="teen-text-muted teen-text-small" style={{ marginBottom: 10 }}>
            {500 - teen.totalXP} XP until your next evolution
          </p>
          <div className="teen-progress">
            <div
              className="teen-progress-fill"
              style={{ width: `${Math.min((teen.totalXP / 500) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
