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

  return (
    <div className="teen-page" style={{ paddingBottom: 32 }}>
      {/* Progress */}
      <div className="teen-progress" style={{ marginBottom: 4 }}>
        <div className="teen-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="teen-text-center teen-text-muted teen-text-small teen-mb-24">
        {step} of 4
      </p>

      {/* Step 1: Mood */}
      {step === 1 && (
        <div className="teen-fade-in">
          <h2 className="teen-text-center teen-mb-16">
            Pick your vibe right now
          </h2>
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
          <p className="teen-text-center teen-text-muted teen-text-small teen-mt-16">
            Tap the one that fits
          </p>
          <button
            className="teen-btn teen-btn-accent teen-mt-24"
            disabled={!selectedMood}
            onClick={() => setStep(2)}
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Concerns */}
      {step === 2 && (
        <div className="teen-fade-in">
          <h2 className="teen-text-center teen-mb-8">
            What&apos;s been heavy lately?
          </h2>
          <p className="teen-text-center teen-text-muted teen-text-small teen-mb-16">
            Pick up to 3
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
          <button
            className="teen-btn teen-btn-accent teen-mt-24"
            disabled={selectedConcerns.length === 0}
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

      {/* Step 3: Safety Gate */}
      {step === 3 && (
        <div className="teen-fade-in">
          <h2 className="teen-text-center teen-mb-8">One more thing...</h2>
          <p className="teen-text-center teen-text-muted teen-mb-24" style={{ fontSize: "0.85rem" }}>
            So we can make this the right fit for you
          </p>

          <div className="teen-card teen-mb-16">
            <p style={{ fontSize: "0.9rem", marginBottom: 12 }}>
              Do you feel safe at home?
            </p>
            <div className="teen-flex teen-gap-12">
              <button
                className={`teen-btn teen-btn-outline ${safeHome === true ? "teen-btn-green" : ""}`}
                style={{ flex: 1 }}
                onClick={() => setSafeHome(true)}
              >
                Yes
              </button>
              <button
                className={`teen-btn teen-btn-outline ${safeHome === false ? "teen-btn-rose" : ""}`}
                style={{ flex: 1 }}
                onClick={() => setSafeHome(false)}
              >
                Not always
              </button>
            </div>
          </div>

          <div className="teen-card">
            <p style={{ fontSize: "0.9rem", marginBottom: 12 }}>
              Have you had thoughts of hurting yourself?
            </p>
            <div className="teen-flex teen-gap-12">
              <button
                className={`teen-btn teen-btn-outline ${selfHarm === false ? "teen-btn-green" : ""}`}
                style={{ flex: 1 }}
                onClick={() => setSelfHarm(false)}
              >
                No
              </button>
              <button
                className={`teen-btn teen-btn-outline ${selfHarm === true ? "teen-btn-rose" : ""}`}
                style={{ flex: 1 }}
                onClick={() => setSelfHarm(true)}
              >
                Yes
              </button>
            </div>
          </div>

          <p className="teen-text-center teen-text-muted teen-text-xs teen-mt-16">
            Your answers are private and help us keep you safe
          </p>

          <button
            className="teen-btn teen-btn-accent teen-mt-24"
            disabled={safeHome === null || selfHarm === null}
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

      {/* Step 4: Avatar Intro + Ready */}
      {step === 4 && (
        <div className="teen-fade-in teen-text-center">
          <h2 className="teen-mb-8">Meet your guide</h2>
          <p className="teen-text-muted teen-text-small teen-mb-16">
            This character grows with you
          </p>

          <div className="avatar-display teen-pulse">
            {"\u{1F331}"}
          </div>
          <p style={{ fontWeight: 700, fontSize: "1.1rem" }}>Seedling Stage</p>
          <p className="teen-text-accent teen-text-small teen-mb-24">
            Level 1 — Just getting started
          </p>

          <div className="teen-flex teen-flex-center teen-gap-8 teen-mb-24">
            {["\u{1F331}", "\u{1F33F}", "\u{1F333}", "\u{1F332}", "\u2728"].map(
              (emoji, i) => (
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
                    fontSize: "1.4rem",
                    opacity: i === 0 ? 1 : 0.3,
                    background: i === 0 ? "rgba(6,182,212,0.1)" : "transparent",
                  }}
                >
                  {emoji}
                </div>
              )
            )}
          </div>

          <div className="social-proof">
            {"\u{1F3AF}"} 247 teens started their journey today
          </div>

          <div className="teen-mt-16 teen-mb-16">
            <span className="streak-badge">
              {"\u{1F525}"} Day 1 — Your streak starts now
            </span>
          </div>

          <button className="teen-btn teen-btn-accent" onClick={handleFinish}>
            Start My First Story
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
