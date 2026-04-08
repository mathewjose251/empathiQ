"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useTeen,
  MOOD_OPTIONS_FULL,
  CONCERN_OPTIONS,
  MoodKey,
} from "../_context/TeenContext";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { setMood, completeOnboarding } = useTeen();
  const [step, setStep] = useState<Step>(1);
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>([]);
  const [safeHome, setSafeHome] = useState<boolean | null>(null);
  const [selfHarm, setSelfHarm] = useState<boolean | null>(null);

  const progress = (step / 4) * 100;

  const toggleConcern = (key: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(key)
        ? prev.filter((c) => c !== key)
        : prev.length < 3
          ? [...prev, key]
          : prev
    );
  };

  const handleFinish = () => {
    const safetyFlagged = safeHome === false || selfHarm === true;
    if (selectedMood) setMood(selectedMood);
    completeOnboarding(selectedConcerns, safetyFlagged);
    if (safetyFlagged) {
      router.push("/teen/safety");
    } else {
      router.push("/teen");
    }
  };

  const MOOD_MISSION_SLUG: Record<MoodKey, string> = {
    anxious: "night-before-finals",
    low: "mirror-moment",
    great: "peer-achievement",
    okay: "friend-text-unanswered",
    stressed: "night-before-finals",
    frustrated: "sibling-boundary-crossed",
    tired: "phone-late-night",
    numb: "mirror-moment",
    sad: "mirror-moment",
    confused: "different-from-peers",
    confident: "peer-achievement",
  };

  const firstMission = selectedMood ? MOOD_MISSION_SLUG[selectedMood] : "night-before-finals";

  return (
    <div className="teen-page" style={{ paddingBottom: 32 }}>
      {/* Progress bar */}
      <div className="teen-progress" style={{ marginBottom: 4 }}>
        <div className="teen-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="teen-text-center teen-text-muted teen-text-small teen-mb-24">
        Step {step} of 4
      </p>

      {/* ── Step 1: Welcome ── */}
      {step === 1 && (
        <div className="teen-fade-in">
          <div className="teen-text-center" style={{ marginBottom: 28 }}>
            <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>🧠</div>
            <h2 style={{ fontSize: "1.5rem", marginBottom: 10 }}>
              This isn&apos;t therapy.
            </h2>
            <p className="teen-text-muted" style={{ lineHeight: 1.7, fontSize: "0.95rem" }}>
              It&apos;s a map for your head. Short story missions that show you the
              thinking patterns behind your worst moments — without the clipboard,
              the waiting room, or anyone reading your answers.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {[
              { icon: "🎭", text: "5-minute story missions matched to how you feel" },
              { icon: "👥", text: "Anonymous peer feed — you're not the only one" },
              { icon: "🛠️", text: "15 tools for the moments when nothing helps" },
              { icon: "🔒", text: "Your reflections stay with you. Always." },
            ].map(({ icon, text }) => (
              <div
                key={text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--teen-border)",
                }}
              >
                <span style={{ fontSize: "1.3rem" }}>{icon}</span>
                <span style={{ fontSize: "0.92rem", color: "var(--teen-muted)", lineHeight: 1.5 }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          <button className="teen-btn teen-btn-accent" onClick={() => setStep(2)}>
            Let&apos;s go →
          </button>
        </div>
      )}

      {/* ── Step 2: Mood ── */}
      {step === 2 && (
        <div className="teen-fade-in">
          <h2 className="teen-text-center teen-mb-8" style={{ fontSize: "1.35rem" }}>
            How are you actually feeling right now?
          </h2>
          <p className="teen-text-center teen-text-muted teen-text-small teen-mb-16">
            No wrong answers. We&apos;ll match your first story to this.
          </p>
          <div className="mood-grid">
            {MOOD_OPTIONS_FULL.map((m) => (
              <button
                key={m.key}
                className={`mood-item ${selectedMood === m.key ? "selected" : ""}`}
                onClick={() => setSelectedMood(m.key)}
              >
                {m.emoji}
                <span className="mood-label">{m.label}</span>
              </button>
            ))}
          </div>
          <button
            className="teen-btn teen-btn-accent teen-mt-24"
            disabled={!selectedMood}
            onClick={() => setStep(3)}
          >
            Next
          </button>
          <button
            className="teen-btn teen-btn-outline teen-mt-8"
            onClick={() => setStep(1)}
          >
            Back
          </button>
        </div>
      )}

      {/* ── Step 3: Concerns + Safety ── */}
      {step === 3 && (
        <div className="teen-fade-in">
          <h2 className="teen-text-center teen-mb-8" style={{ fontSize: "1.35rem" }}>
            What&apos;s been taking up space lately?
          </h2>
          <p className="teen-text-center teen-text-muted teen-text-small teen-mb-16">
            Pick up to 3 — this shapes which missions we surface first
          </p>
          <div className="mood-grid mood-grid-2col">
            {CONCERN_OPTIONS.map((c) => (
              <button
                key={c.key}
                className={`mood-item ${selectedConcerns.includes(c.key) ? "selected" : ""}`}
                onClick={() => toggleConcern(c.key)}
              >
                {c.emoji}
                <span className="mood-label">{c.label}</span>
              </button>
            ))}
          </div>

          {/* Safety gate — inline, low-friction */}
          <div
            style={{
              marginTop: 24,
              padding: "16px 18px",
              borderRadius: 16,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--teen-border)",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--teen-muted)",
                marginBottom: 14,
                lineHeight: 1.6,
              }}
            >
              Two quick questions so we can show you the right version of this
              app. Your answers stay private.
            </p>

            <p style={{ fontSize: "0.9rem", marginBottom: 10, fontWeight: 600 }}>
              Do you feel safe at home?
            </p>
            <div className="teen-flex teen-gap-12" style={{ marginBottom: 16 }}>
              <button
                className={`teen-btn teen-btn-outline ${safeHome === true ? "teen-btn-green" : ""}`}
                style={{ flex: 1, fontSize: "0.85rem" }}
                onClick={() => setSafeHome(true)}
              >
                Yes, generally
              </button>
              <button
                className={`teen-btn teen-btn-outline ${safeHome === false ? "teen-btn-rose" : ""}`}
                style={{ flex: 1, fontSize: "0.85rem" }}
                onClick={() => setSafeHome(false)}
              >
                Not always
              </button>
            </div>

            <p style={{ fontSize: "0.9rem", marginBottom: 10, fontWeight: 600 }}>
              Have you had thoughts of hurting yourself?
            </p>
            <div className="teen-flex teen-gap-12">
              <button
                className={`teen-btn teen-btn-outline ${selfHarm === false ? "teen-btn-green" : ""}`}
                style={{ flex: 1, fontSize: "0.85rem" }}
                onClick={() => setSelfHarm(false)}
              >
                No
              </button>
              <button
                className={`teen-btn teen-btn-outline ${selfHarm === true ? "teen-btn-rose" : ""}`}
                style={{ flex: 1, fontSize: "0.85rem" }}
                onClick={() => setSelfHarm(true)}
              >
                Yes
              </button>
            </div>
          </div>

          <button
            className="teen-btn teen-btn-accent teen-mt-24"
            disabled={selectedConcerns.length === 0 || safeHome === null || selfHarm === null}
            onClick={() => setStep(4)}
          >
            Next
          </button>
          <button
            className="teen-btn teen-btn-outline teen-mt-8"
            onClick={() => setStep(2)}
          >
            Back
          </button>
        </div>
      )}

      {/* ── Step 4: Avatar + Mission-first CTA ── */}
      {step === 4 && (
        <div className="teen-fade-in teen-text-center">
          <div style={{ fontSize: "3.5rem", marginBottom: 4 }}>🌱</div>
          <h2 style={{ fontSize: "1.35rem", marginBottom: 4 }}>You&apos;re a Seedling.</h2>
          <p className="teen-text-muted teen-text-small teen-mb-16">
            Your guide grows as you do. There are 5 stages — no rush.
          </p>

          {/* Evolution track */}
          <div className="teen-flex teen-flex-center teen-gap-8 teen-mb-24">
            {["🌱", "🌿", "🌳", "🌲", "✨"].map((emoji, i) => (
              <div
                key={i}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: `2px solid ${i === 0 ? "var(--teen-accent)" : "var(--teen-border)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.3rem",
                  opacity: i === 0 ? 1 : 0.3,
                  background: i === 0 ? "rgba(6,182,212,0.1)" : "transparent",
                }}
              >
                {emoji}
              </div>
            ))}
          </div>

          {/* Matched first mission */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 16,
              border: "1px solid var(--teen-accent)",
              background: "rgba(6,182,212,0.06)",
              marginBottom: 20,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--teen-accent)",
                marginBottom: 6,
              }}
            >
              ✨ Your first story — matched to your vibe
            </p>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4 }}>
              {firstMission === "night-before-finals" && "The Night Before Finals"}
              {firstMission === "mirror-moment" && "Mirror Moment"}
              {firstMission === "peer-achievement" && "When a Friend Wins Big"}
              {firstMission === "friend-text-unanswered" && "The Text That Was Left on Read"}
              {firstMission === "sibling-boundary-crossed" && "Sibling Drama"}
              {firstMission === "phone-late-night" && "Phone Doom Scroll"}
              {firstMission === "different-from-peers" && "Different From Everyone"}
            </p>
            <p className="teen-text-muted teen-text-small">
              5 minutes · +15 XP · Tap to start
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <span className="streak-badge">🔥 Day 1 — Your streak starts now</span>
          </div>

          <button
            className="teen-btn teen-btn-accent"
            onClick={() => {
              handleFinish();
            }}
          >
            Start my first story →
          </button>
          <button
            className="teen-btn teen-btn-outline teen-mt-8"
            onClick={() => setStep(3)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
