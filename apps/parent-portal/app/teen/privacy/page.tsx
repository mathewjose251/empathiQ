"use client";

import { useRouter } from "next/navigation";
import {
  useTeen,
  PRIVACY_FEATURES,
  type PrivacyKey,
} from "../_context/TeenContext";

/*
 * ─── TEEN PRIVACY CONTROLS ──────────────────────────────────
 *
 * This page gives teens explicit control over what flows to
 * their parent's dashboard. The design principles:
 *
 * 1. Default to OFF — nothing shared until the teen chooses
 * 2. Each toggle shows EXACTLY what the parent would see
 * 3. Safety alerts can never be hidden (green tier)
 * 4. Raw reflections, pack posts, exact moods never flow (red tier)
 * 5. Teen-friendly language — no legalese
 */

const ALWAYS_VISIBLE = [
  {
    label: "Safety alerts",
    description:
      "If our safety check detects something serious, your parent is told. You will always be shown what was shared and why.",
  },
  {
    label: "General engagement",
    description: "Your parent can see whether you are active or inactive — not what you are doing.",
  },
  {
    label: "Avatar stage",
    description: "Your avatar evolution is visible. It shows growth without revealing specifics.",
  },
];

const NEVER_VISIBLE = [
  "What you wrote in reflections",
  "Your specific mission answers or choices",
  "Your Pack posts and reactions",
  "Your exact mood check-in values",
  "Anything you type in free-text fields",
  "Who you interact with in the Pack",
];

export default function TeenPrivacyPage() {
  const teen = useTeen();
  const router = useRouter();

  return (
    <div className="teen-page">
      {/* ── Header ── */}
      <div style={{ marginBottom: 20 }}>
        <button
          className="teen-btn-back"
          onClick={() => router.push("/teen/me")}
          style={{
            background: "none",
            border: "none",
            color: "var(--teen-muted)",
            fontSize: "0.85rem",
            cursor: "pointer",
            padding: "4px 0",
            marginBottom: 8,
          }}
        >
          ← Back to Me
        </button>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            marginBottom: 6,
          }}
        >
          Your Privacy Dial
        </h1>
        <p
          style={{
            fontSize: "0.88rem",
            color: "var(--teen-muted)",
            lineHeight: 1.55,
          }}
        >
          You control what your parent can see on their dashboard. Toggles
          default to off. Turn on what feels right for you. You can change
          these any time.
        </p>
      </div>

      {/* ── Your Toggles (Yellow Tier) ── */}
      <div className="teen-card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🟡</span>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
            You control these
          </h2>
        </div>

        <div className="privacy-toggle-list">
          {PRIVACY_FEATURES.map((feature) => {
            const isOn = teen.privacy[feature.key];
            return (
              <div className="privacy-toggle-card" key={feature.key}>
                <div className="privacy-toggle-top">
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        marginBottom: 2,
                      }}
                    >
                      {feature.label}
                    </div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--teen-muted)",
                        margin: 0,
                        lineHeight: 1.45,
                      }}
                    >
                      {feature.description}
                    </p>
                  </div>
                  <button
                    className={`privacy-toggle-switch ${isOn ? "privacy-toggle-on" : ""}`}
                    onClick={() =>
                      teen.togglePrivacy(feature.key as PrivacyKey)
                    }
                    type="button"
                    aria-label={`Toggle ${feature.label}`}
                  >
                    <span className="privacy-toggle-knob" />
                  </button>
                </div>

                {/* What parent sees preview */}
                <div
                  className={`privacy-preview ${isOn ? "privacy-preview-on" : ""}`}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: isOn
                        ? "var(--teen-green)"
                        : "var(--teen-muted)",
                      fontWeight: 600,
                    }}
                  >
                    {isOn ? "Your parent sees:" : "Your parent would see:"}
                  </span>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      fontStyle: "italic",
                      color: isOn
                        ? "var(--teen-text)"
                        : "var(--teen-muted)",
                      margin: "4px 0 0",
                      opacity: isOn ? 1 : 0.6,
                    }}
                  >
                    {feature.parentSees}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Always Visible (Green Tier) ── */}
      <div className="teen-card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🟢</span>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
            Always visible — safety first
          </h2>
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--teen-muted)",
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          These stay visible to keep you safe. You cannot turn them off — but
          they only share the minimum needed.
        </p>
        {ALWAYS_VISIBLE.map((item) => (
          <div className="privacy-fixed-row" key={item.label}>
            <div className="privacy-fixed-icon">👁️</div>
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  marginBottom: 2,
                }}
              >
                {item.label}
              </div>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "var(--teen-muted)",
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Never Visible (Red Tier) ── */}
      <div className="teen-card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 14,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>🔴</span>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
            Never shared — no exceptions
          </h2>
        </div>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--teen-muted)",
            lineHeight: 1.5,
            marginBottom: 12,
          }}
        >
          These are hardcoded private. No parent, mentor, or admin can ever see
          them. Not even in a safety override.
        </p>
        <div className="privacy-never-list">
          {NEVER_VISIBLE.map((item) => (
            <div className="privacy-never-row" key={item}>
              <span className="privacy-never-icon">🔒</span>
              <span style={{ fontSize: "0.85rem" }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Safety Override Explainer ── */}
      <div
        className="teen-card"
        style={{
          borderColor: "var(--teen-amber)",
          background: "rgba(245, 158, 11, 0.04)",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>⚠️</span>
          <h2 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
            When safety overrides privacy
          </h2>
        </div>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--teen-text)",
            lineHeight: 1.55,
            marginBottom: 8,
          }}
        >
          If our safety system detects that you might be in danger — like
          thoughts of hurting yourself or someone hurting you — your parent
          will be notified immediately.
        </p>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--teen-amber)",
            lineHeight: 1.55,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          You will always be told exactly what was shared and why.
        </p>
        <p
          style={{
            fontSize: "0.82rem",
            color: "var(--teen-muted)",
            lineHeight: 1.5,
          }}
        >
          Once you are safe, your parent&apos;s access goes back to whatever
          you set on this page. The override is temporary, not permanent.
        </p>
      </div>

      {/* ── Summary ── */}
      <div
        className="teen-card teen-card-glow-purple"
        style={{ marginBottom: 20 }}
      >
        <p
          style={{
            fontSize: "0.88rem",
            lineHeight: 1.55,
            textAlign: "center",
          }}
        >
          <strong>
            {Object.entries(teen.privacy).filter(
              ([k, v]) => k !== "shareAvatarStage" && v === true
            ).length}{" "}
            of 4
          </strong>{" "}
          optional features shared with your parent.
          <br />
          <span style={{ color: "var(--teen-muted)", fontSize: "0.82rem" }}>
            Change these any time. Your parent is never told when you adjust
            privacy.
          </span>
        </p>
      </div>
    </div>
  );
}
