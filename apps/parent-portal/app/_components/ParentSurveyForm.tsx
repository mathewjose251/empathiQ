"use client";

import { useState } from "react";

const TEEN_AGE_BANDS = ["13–14", "15–16", "17–18"];

const HOUSEHOLD_CONTEXTS = [
  "Single parent",
  "Two parents",
  "Joint / extended family",
  "Other",
];

const MAIN_CONCERNS = [
  "Academic performance",
  "Peer relationships",
  "Mental health & mood",
  "Screen time & social media",
  "Future & career pressure",
  "Physical health",
  "Risk-taking behaviour",
  "Communication at home",
  "Self-image & confidence",
];

const PRESSURE_POINTS = [
  "Board or entrance exams",
  "Competitive peers",
  "Family expectations",
  "Career decisions",
  "Social comparison",
  "Romantic relationships",
  "Financial stress",
];

const HOME_CONFLICT_THEMES = [
  "Screen time limits",
  "Curfew and boundaries",
  "Academic pressure",
  "Privacy and trust",
  "Sibling conflict",
  "Communication breakdown",
  "Defiance or withdrawal",
];

const SCHOOL_CONFLICT_THEMES = [
  "Peer conflict or bullying",
  "Teacher relationships",
  "Attendance issues",
  "Academic underperformance",
  "Lack of motivation",
  "Extracurricular stress",
];

const SUPPORT_NEEDS = [
  "Better communication tools",
  "Understanding teen behaviour",
  "Managing my own stress",
  "Professional guidance",
  "Community of parents",
  "Resources on adolescence",
  "Early warning signs",
];

const chipBase: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: "999px",
  fontSize: "0.82rem",
  border: "1px solid",
  cursor: "pointer",
  fontFamily: "'Trebuchet MS', sans-serif",
  letterSpacing: "0.04em",
  transition: "all 0.15s",
};

function ChipGroup({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(opt: string) {
    onChange(
      selected.includes(opt)
        ? selected.filter((v) => v !== opt)
        : [...selected, opt],
    );
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <span
        className="panel-label"
        style={{ display: "block", marginBottom: "0.6rem" }}
      >
        {label}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                ...chipBase,
                borderColor: active
                  ? "rgba(136,224,255,0.6)"
                  : "rgba(173,201,255,0.14)",
                background: active
                  ? "rgba(136,224,255,0.15)"
                  : "rgba(255,255,255,0.03)",
                color: active ? "var(--cyan)" : "var(--muted)",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ParentSurveyForm() {
  const [teenAgeBand, setTeenAgeBand] = useState("");
  const [householdContext, setHouseholdContext] = useState("");
  const [mainConcerns, setMainConcerns] = useState<string[]>([]);
  const [pressurePoints, setPressurePoints] = useState<string[]>([]);
  const [homeConflictThemes, setHomeConflictThemes] = useState<string[]>([]);
  const [schoolConflictThemes, setSchoolConflictThemes] = useState<string[]>([]);
  const [supportNeeds, setSupportNeeds] = useState<string[]>([]);
  const [openText, setOpenText] = useState("");
  const [followUpConsent, setFollowUpConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const canSubmit =
    teenAgeBand.length > 0 &&
    householdContext.length > 0 &&
    mainConcerns.length > 0 &&
    status !== "submitting";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/survey/parent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityMode: "ANONYMOUS",
          teenAgeBand,
          householdContext,
          mainConcerns,
          pressurePoints,
          homeConflictThemes,
          schoolConflictThemes,
          supportNeeds,
          openText: openText.trim() || undefined,
          followUpConsent,
        }),
      });
      const data = (await res.json()) as { success: boolean; message: string };
      if (data.success) {
        setStatus("done");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message);
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "done") {
    return (
      <section className="panel" style={{ textAlign: "center", padding: "3rem 2rem" }}>
        <p style={{ fontSize: "2.5rem", margin: "0 0 1rem" }}>🙏</p>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.5rem" }}>Thank you</h2>
        <p className="lede" style={{ margin: "0 auto", fontSize: "0.95rem" }}>
          {message}
        </p>
      </section>
    );
  }

  const selectStyle: React.CSSProperties = {
    padding: "8px 14px",
    borderRadius: "999px",
    border: "1px solid",
    cursor: "pointer",
    fontFamily: "'Trebuchet MS', sans-serif",
    letterSpacing: "0.04em",
    fontSize: "0.82rem",
    transition: "all 0.15s",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(173,201,255,0.14)",
    borderRadius: "12px",
    color: "var(--text)",
    fontSize: "0.95rem",
    padding: "0.75rem 1rem",
    resize: "vertical" as const,
    boxSizing: "border-box" as const,
    outline: "none",
    fontFamily: "Georgia, serif",
    lineHeight: 1.6,
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {/* Header */}
      <section className="panel">
        <span className="eyebrow">Parent Survey</span>
        <h2 style={{ margin: "12px 0 6px", fontSize: "1.6rem" }}>
          Help us understand your family
        </h2>
        <p className="lede" style={{ fontSize: "0.9rem" }}>
          Anonymous · takes about 3 minutes · your perspective matters
        </p>
      </section>

      {/* Teen age + household */}
      <section className="panel">
        <div style={{ marginBottom: "1.5rem" }}>
          <span className="panel-label" style={{ display: "block", marginBottom: "0.75rem" }}>
            Your teen&apos;s age group
          </span>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {TEEN_AGE_BANDS.map((band) => (
              <button
                key={band}
                type="button"
                onClick={() => setTeenAgeBand(band)}
                style={{
                  ...selectStyle,
                  borderColor:
                    teenAgeBand === band
                      ? "rgba(255,210,143,0.6)"
                      : "rgba(173,201,255,0.14)",
                  background:
                    teenAgeBand === band
                      ? "rgba(255,210,143,0.12)"
                      : "rgba(255,255,255,0.03)",
                  color: teenAgeBand === band ? "var(--amber)" : "var(--muted)",
                }}
              >
                {band}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="panel-label" style={{ display: "block", marginBottom: "0.75rem" }}>
            Household setup
          </span>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {HOUSEHOLD_CONTEXTS.map((ctx) => (
              <button
                key={ctx}
                type="button"
                onClick={() => setHouseholdContext(ctx)}
                style={{
                  ...selectStyle,
                  borderColor:
                    householdContext === ctx
                      ? "rgba(255,210,143,0.6)"
                      : "rgba(173,201,255,0.14)",
                  background:
                    householdContext === ctx
                      ? "rgba(255,210,143,0.12)"
                      : "rgba(255,255,255,0.03)",
                  color:
                    householdContext === ctx ? "var(--amber)" : "var(--muted)",
                }}
              >
                {ctx}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Multi-select sections */}
      <section className="panel">
        <ChipGroup
          label="What concerns you most about your teen? (pick any)"
          options={MAIN_CONCERNS}
          selected={mainConcerns}
          onChange={setMainConcerns}
        />
        <ChipGroup
          label="What creates the most pressure in your teen's life?"
          options={PRESSURE_POINTS}
          selected={pressurePoints}
          onChange={setPressurePoints}
        />
        <ChipGroup
          label="What causes tension at home?"
          options={HOME_CONFLICT_THEMES}
          selected={homeConflictThemes}
          onChange={setHomeConflictThemes}
        />
        <ChipGroup
          label="What challenges do you see at school?"
          options={SCHOOL_CONFLICT_THEMES}
          selected={schoolConflictThemes}
          onChange={setSchoolConflictThemes}
        />
        <ChipGroup
          label="What support would help you most as a parent?"
          options={SUPPORT_NEEDS}
          selected={supportNeeds}
          onChange={setSupportNeeds}
        />
      </section>

      {/* Open text + consent */}
      <section className="panel">
        <span className="panel-label" style={{ display: "block", marginBottom: "0.75rem" }}>
          Anything else you&apos;d like us to know? (optional)
        </span>
        <textarea
          value={openText}
          onChange={(e) => setOpenText(e.target.value)}
          maxLength={1200}
          rows={4}
          placeholder="Share any context that might help us understand your family's situation better..."
          style={inputStyle}
        />

        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.6rem",
            marginTop: "1.25rem",
            cursor: "pointer",
            color: "var(--muted)",
            fontSize: "0.85rem",
            lineHeight: 1.5,
          }}
        >
          <input
            type="checkbox"
            checked={followUpConsent}
            onChange={(e) => setFollowUpConsent(e.target.checked)}
            style={{ marginTop: "2px", accentColor: "var(--cyan)", flexShrink: 0 }}
          />
          I&apos;m okay with EmpathiQ using my answers to improve support for families.
        </label>
      </section>

      {status === "error" && (
        <p style={{ color: "var(--rose)", fontSize: "0.85rem", textAlign: "center" }}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        style={{
          padding: "14px",
          borderRadius: "999px",
          border: "none",
          background: canSubmit
            ? "linear-gradient(135deg, var(--cyan), var(--amber))"
            : "rgba(255,255,255,0.08)",
          color: canSubmit ? "#050914" : "var(--muted)",
          fontSize: "0.9rem",
          fontFamily: "'Trebuchet MS', sans-serif",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          cursor: canSubmit ? "pointer" : "not-allowed",
          transition: "all 0.2s",
        }}
      >
        {status === "submitting" ? "Submitting…" : "Submit survey"}
      </button>
    </form>
  );
}
