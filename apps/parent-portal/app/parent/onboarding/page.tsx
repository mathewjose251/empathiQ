"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/*
 * ─── PARENT ONBOARDING ───────────────────────────────────────────
 *
 * 4-step flow shown to parents after first login.
 * Steps: Welcome → Link teen → Privacy explainer → Done
 *
 * No data fetching — this is a client-side orientation flow.
 * Teen linking is handled separately via the account settings.
 */

type Step = 1 | 2 | 3 | 4;

const PRIVACY_TIERS = [
  {
    icon: "🟢",
    label: "Always visible",
    items: [
      "Whether your teen is active or inactive",
      "Avatar stage (Seedling → Radiant)",
      "Safety alerts — with your teen told what was shared",
    ],
    color: "#10b981",
  },
  {
    icon: "🟡",
    label: "Visible if your teen chooses",
    items: [
      "Mood trend (as a weather report, not a number)",
      "Thinking trap category this week",
      "Streak and progress metrics",
    ],
    color: "#f59e0b",
  },
  {
    icon: "🔴",
    label: "Never visible — not even to us",
    items: [
      "Specific mission choices or answers",
      "Pack reflections and peer posts",
      "Journal entries and free text",
      "Exact mood check-in values",
    ],
    color: "#f43f5e",
  },
];

export default function ParentOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [teenCode, setTeenCode] = useState("");
  const [linkAttempted, setLinkAttempted] = useState(false);

  const progress = (step / 4) * 100;

  const handleLinkTeen = () => {
    setLinkAttempted(true);
    // TODO: real teen-linking API call when available
    // For now advance to next step
    setStep(3);
  };

  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "24px 20px 48px",
        minHeight: "100vh",
      }}
    >
      {/* Progress */}
      <div
        style={{
          height: 4,
          borderRadius: 999,
          background: "rgba(255,255,255,0.1)",
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "var(--amber)",
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--muted)",
          marginBottom: 32,
        }}
      >
        Step {step} of 4
      </p>

      {/* ── Step 1: Welcome ── */}
      {step === 1 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>☁️</div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginBottom: 12,
                lineHeight: 1.25,
              }}
            >
              You see the weather. Not the diary.
            </h1>
            <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "0.95rem" }}>
              EmpathiQ gives you a calm, translated view of your teen&apos;s
              emotional patterns. Never raw content. Never surveillance. Enough to
              know when to reach out — not enough to intrude.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
            {[
              {
                icon: "🌤️",
                title: "Emotional weather",
                body: "Mood trend as a metaphor — improving, steady, or cloudy. Not a number.",
              },
              {
                icon: "🧠",
                title: "Thinking trap spotlight",
                body: "Which pattern is showing up most this week. The category, not the content.",
              },
              {
                icon: "💡",
                title: "Suggested moments",
                body: "One activity each week — a walk, a car ride, a side-by-side conversation.",
              },
              {
                icon: "🔔",
                title: "Safety alerts only when needed",
                body: "If a safety concern is triggered, you're notified. And your teen is told what was shared.",
              },
            ].map(({ icon, title, body }) => (
              <div
                key={title}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: "1px solid rgba(173,201,255,0.14)",
                  background: "rgba(8,20,39,0.5)",
                }}
              >
                <span style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: 2 }}>{icon}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 3 }}>{title}</p>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.5 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep(2)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 999,
              background: "linear-gradient(135deg, var(--amber), #ffb347)",
              color: "#0a1628",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Got it — let&apos;s set up →
          </button>
        </div>
      )}

      {/* ── Step 2: Link teen ── */}
      {step === 2 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔗</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: 10 }}>
              Connect to your teen&apos;s account
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
              Your teen generates a link code in their app. Enter it here to
              connect. You can skip this and do it later from your dashboard.
            </p>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.8rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 8,
              }}
            >
              Teen&apos;s link code
            </label>
            <input
              type="text"
              value={teenCode}
              onChange={(e) => setTeenCode(e.target.value.toUpperCase())}
              placeholder="e.g. EQ-A4B2C"
              maxLength={8}
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: 12,
                border: "1px solid rgba(173,201,255,0.2)",
                background: "rgba(8,20,39,0.7)",
                color: "var(--text)",
                fontSize: "1.1rem",
                letterSpacing: "0.12em",
                fontFamily: "monospace",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
              Your teen finds their code under <strong>Me → Privacy</strong> in the
              EmpathiQ teen app.
            </p>
          </div>

          <div
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              background: "rgba(255,210,143,0.06)",
              border: "1px solid rgba(255,210,143,0.15)",
              marginBottom: 24,
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.65 }}>
              <strong style={{ color: "var(--amber)" }}>Your teen controls this connection.</strong>{" "}
              They can revoke it at any time from their privacy settings, and they
              always see exactly what data reaches you.
            </p>
          </div>

          <button
            onClick={handleLinkTeen}
            disabled={teenCode.length < 5}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 999,
              background:
                teenCode.length >= 5
                  ? "linear-gradient(135deg, var(--amber), #ffb347)"
                  : "rgba(255,255,255,0.07)",
              color: teenCode.length >= 5 ? "#0a1628" : "var(--muted)",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: teenCode.length >= 5 ? "pointer" : "default",
              marginBottom: 10,
            }}
          >
            Link account
          </button>
          <button
            onClick={() => setStep(3)}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 999,
              background: "transparent",
              border: "1px solid rgba(173,201,255,0.2)",
              color: "var(--muted)",
              fontSize: "0.88rem",
              cursor: "pointer",
            }}
          >
            Skip for now — I&apos;ll do this later
          </button>
          <button
            onClick={() => setStep(1)}
            style={{
              width: "100%",
              padding: "10px",
              background: "none",
              border: "none",
              color: "var(--muted)",
              fontSize: "0.82rem",
              marginTop: 6,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* ── Step 3: Privacy explainer ── */}
      {step === 3 && (
        <div>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔒</div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 600, marginBottom: 10 }}>
              Here&apos;s exactly what you can and can&apos;t see.
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>
              This isn&apos;t buried in settings. It&apos;s the foundation of how
              EmpathiQ works.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
            {PRIVACY_TIERS.map((tier) => (
              <div
                key={tier.label}
                style={{
                  padding: "18px 18px 16px",
                  borderRadius: 16,
                  border: `1px solid ${tier.color}33`,
                  background: `${tier.color}0a`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 12,
                  }}
                >
                  <span style={{ fontSize: "1.1rem" }}>{tier.icon}</span>
                  <strong style={{ fontSize: "0.9rem", color: tier.color }}>{tier.label}</strong>
                </div>
                <ul style={{ margin: 0, padding: "0 0 0 4px", listStyle: "none" }}>
                  {tier.items.map((item) => (
                    <li
                      key={item}
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--muted)",
                        lineHeight: 1.6,
                        paddingLeft: 12,
                        position: "relative",
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: 0,
                          color: tier.color,
                          opacity: 0.6,
                        }}
                      >
                        ·
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(173,201,255,0.12)",
              marginBottom: 24,
              fontSize: "0.82rem",
              color: "var(--muted)",
              lineHeight: 1.65,
            }}
          >
            One more thing: <strong style={{ color: "var(--text)" }}>never reference this
            dashboard in conversation with your teen.</strong> If they find out you&apos;re
            checking it before talking to them, it breaks the trust that makes the
            whole thing work.
          </div>

          <button
            onClick={() => setStep(4)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 999,
              background: "linear-gradient(135deg, var(--amber), #ffb347)",
              color: "#0a1628",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: "pointer",
              marginBottom: 10,
            }}
          >
            Understood — show me the dashboard →
          </button>
          <button
            onClick={() => setStep(2)}
            style={{
              width: "100%",
              padding: "10px",
              background: "none",
              border: "none",
              color: "var(--muted)",
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* ── Step 4: Done ── */}
      {step === 4 && (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌤️</div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: 12 }}>
            You&apos;re set up.
          </h2>
          <p style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "0.95rem", marginBottom: 32 }}>
            Your dashboard shows the emotional weather — not the diary. Check it
            once or twice a week. Use the suggested moments when one feels right.
            That&apos;s the whole job.
          </p>

          <div
            style={{
              padding: "18px",
              borderRadius: 16,
              border: "1px solid rgba(173,201,255,0.14)",
              background: "rgba(8,20,39,0.5)",
              marginBottom: 28,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--muted)",
                marginBottom: 12,
              }}
            >
              What&apos;s on your dashboard
            </p>
            {[
              "Emotional weather this week",
              "Thinking trap in focus",
              "Engagement pulse (active days, streak)",
              "Suggested sideways moment",
              "REBT learning library — understand the same patterns your teen is working on",
            ].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <span style={{ color: "var(--mint)", fontSize: "0.9rem", marginTop: 2 }}>✓</span>
                <span style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <Link
            href="/parent"
            style={{
              display: "block",
              width: "100%",
              padding: "14px",
              borderRadius: 999,
              background: "linear-gradient(135deg, var(--amber), #ffb347)",
              color: "#0a1628",
              fontWeight: 700,
              fontSize: "0.9rem",
              textAlign: "center",
              textDecoration: "none",
              marginBottom: 10,
            }}
          >
            Go to my dashboard →
          </Link>
          <Link
            href="/parent/learn"
            style={{
              display: "block",
              width: "100%",
              padding: "12px",
              borderRadius: 999,
              border: "1px solid rgba(173,201,255,0.2)",
              color: "var(--muted)",
              fontSize: "0.88rem",
              textAlign: "center",
              textDecoration: "none",
            }}
          >
            Start with the learning library
          </Link>
        </div>
      )}
    </div>
  );
}
