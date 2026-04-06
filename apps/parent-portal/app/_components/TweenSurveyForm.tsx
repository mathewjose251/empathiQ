"use client";

import { useState } from "react";

const AGE_BANDS = ["10–11", "11–12", "12–13"];

const MAIN_CONCERNS = [
  "School and homework",
  "Friends and fitting in",
  "Family arguments",
  "How I look",
  "Screen time and phones",
  "Feeling left out",
  "Sports or activities",
  "Being bullied",
];

const PRESSURE_POINTS = [
  "Too much homework",
  "Mum or dad expectations",
  "Wanting to be liked",
  "Comparing myself to others",
  "Exams and tests",
  "Sibling fights",
];

const HOME_CONFLICT_THEMES = [
  "Screen time rules",
  "Bedtime rules",
  "Arguments with parents",
  "Arguments with siblings",
  "Not feeling heard",
  "Privacy",
];

const SCHOOL_CONFLICT_THEMES = [
  "Someone being mean to me",
  "Trouble with a teacher",
  "Not having enough friends",
  "Too much work",
  "Feeling different",
  "Group projects",
];

const SUPPORT_NEEDS = [
  "Someone to listen",
  "Tips to feel less worried",
  "Help making friends",
  "Better sleep",
  "Feeling more confident",
  "Dealing with anger",
];

const FEELING_WORDS = [
  "Worried",
  "Happy",
  "Bored",
  "Lonely",
  "Excited",
  "Angry",
  "Sad",
  "Confused",
  "Tired",
  "Okay",
];

const NONE = "None of these";
const ALRIGHT = "I'm alright";

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

function SectionHeader({ icon, bg }: { icon: string; bg: string }) {
  return (
    <div
      style={{
        fontSize: "2.6rem",
        textAlign: "center",
        padding: "1rem 0 0.75rem",
        borderRadius: "12px",
        marginBottom: "1rem",
        background: bg,
      }}
    >
      {icon}
    </div>
  );
}

function ChipGroup({
  label,
  options,
  selected,
  onChange,
  noneLabel = NONE,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  noneLabel?: string;
}) {
  function toggle(opt: string) {
    if (opt === noneLabel) {
      onChange(selected.includes(noneLabel) ? [] : [noneLabel]);
    } else {
      const withoutNone = selected.filter((v) => v !== noneLabel);
      onChange(
        withoutNone.includes(opt)
          ? withoutNone.filter((v) => v !== opt)
          : [...withoutNone, opt],
      );
    }
  }

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <span className="panel-label" style={{ display: "block", marginBottom: "0.6rem" }}>
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
                borderColor: active ? "rgba(136,224,255,0.6)" : "rgba(173,201,255,0.14)",
                background: active ? "rgba(136,224,255,0.15)" : "rgba(255,255,255,0.03)",
                color: active ? "var(--cyan)" : "var(--muted)",
              }}
            >
              {opt}
            </button>
          );
        })}
        {/* None / alright option */}
        <button
          type="button"
          onClick={() => toggle(noneLabel)}
          style={{
            ...chipBase,
            borderColor: selected.includes(noneLabel)
              ? "rgba(142,243,207,0.6)"
              : "rgba(173,201,255,0.14)",
            background: selected.includes(noneLabel)
              ? "rgba(142,243,207,0.15)"
              : "rgba(255,255,255,0.03)",
            color: selected.includes(noneLabel) ? "var(--mint)" : "var(--muted)",
          }}
        >
          {noneLabel}
        </button>
      </div>
    </div>
  );
}

export function TweenSurveyForm() {
  const [ageBand, setAgeBand] = useState("");
  const [mainConcerns, setMainConcerns] = useState<string[]>([]);
  const [pressurePoints, setPressurePoints] = useState<string[]>([]);
  const [homeConflictThemes, setHomeConflictThemes] = useState<string[]>([]);
  const [schoolConflictThemes, setSchoolConflictThemes] = useState<string[]>([]);
  const [supportNeeds, setSupportNeeds] = useState<string[]>([]);
  const [feelingWords, setFeelingWords] = useState<string[]>([]);
  const [openText, setOpenText] = useState("");
  const [followUpConsent, setFollowUpConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const canSubmit = ageBand.length > 0 && mainConcerns.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/survey/tween", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identityMode: "ANONYMOUS",
          ageBand,
          mainConcerns,
          pressurePoints,
          homeConflictThemes,
          schoolConflictThemes,
          supportNeeds,
          feelingWords,
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
        <p style={{ fontSize: "3rem", margin: "0 0 1rem" }}>🌈</p>
        <h2 style={{ margin: "0 0 0.75rem", fontSize: "1.5rem" }}>Thanks!</h2>
        <p className="lede" style={{ margin: "0 auto", fontSize: "0.95rem" }}>
          {message}
        </p>
      </section>
    );
  }

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
      <section className="panel" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🌟</div>
        <span className="eyebrow">Tween Check-in</span>
        <h2 style={{ margin: "10px 0 6px", fontSize: "1.5rem" }}>
          Tell us a little about you
        </h2>
        <p className="lede" style={{ fontSize: "0.88rem" }}>
          Anonymous · takes about 2 minutes · no wrong answers
        </p>
      </section>

      {/* Age */}
      <section className="panel">
        <SectionHeader icon="🎂" bg="linear-gradient(135deg,rgba(255,210,143,0.1),rgba(142,243,207,0.1))" />
        <span className="panel-label" style={{ display: "block", marginBottom: "0.75rem" }}>
          How old are you?
        </span>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {AGE_BANDS.map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => setAgeBand(band)}
              style={{
                ...chipBase,
                borderColor: ageBand === band ? "rgba(142,243,207,0.6)" : "rgba(173,201,255,0.14)",
                background: ageBand === band ? "rgba(142,243,207,0.15)" : "rgba(255,255,255,0.03)",
                color: ageBand === band ? "var(--mint)" : "var(--muted)",
              }}
            >
              {band}
            </button>
          ))}
        </div>
      </section>

      {/* Concerns */}
      <section className="panel">
        <SectionHeader icon="💭" bg="linear-gradient(135deg,rgba(136,224,255,0.1),rgba(142,243,207,0.08))" />
        <ChipGroup
          label="What worries you most? (pick any)"
          options={MAIN_CONCERNS}
          selected={mainConcerns}
          onChange={setMainConcerns}
          noneLabel="Nothing right now"
        />
      </section>

      {/* Pressure */}
      <section className="panel">
        <SectionHeader icon="⚡" bg="linear-gradient(135deg,rgba(255,139,167,0.1),rgba(255,210,143,0.08))" />
        <ChipGroup
          label="What puts the most pressure on you?"
          options={PRESSURE_POINTS}
          selected={pressurePoints}
          onChange={setPressurePoints}
        />
      </section>

      {/* Home */}
      <section className="panel">
        <SectionHeader icon="🏡" bg="linear-gradient(135deg,rgba(255,210,143,0.1),rgba(136,224,255,0.08))" />
        <ChipGroup
          label="What causes trouble at home?"
          options={HOME_CONFLICT_THEMES}
          selected={homeConflictThemes}
          onChange={setHomeConflictThemes}
        />
      </section>

      {/* School */}
      <section className="panel">
        <SectionHeader icon="🎒" bg="linear-gradient(135deg,rgba(136,224,255,0.1),rgba(255,139,167,0.08))" />
        <ChipGroup
          label="What's hard at school?"
          options={SCHOOL_CONFLICT_THEMES}
          selected={schoolConflictThemes}
          onChange={setSchoolConflictThemes}
        />
      </section>

      {/* Support */}
      <section className="panel">
        <SectionHeader icon="🤗" bg="linear-gradient(135deg,rgba(142,243,207,0.1),rgba(136,224,255,0.08))" />
        <ChipGroup
          label="What kind of help would you want?"
          options={SUPPORT_NEEDS}
          selected={supportNeeds}
          onChange={setSupportNeeds}
          noneLabel={ALRIGHT}
        />
      </section>

      {/* Feelings */}
      <section className="panel">
        <SectionHeader icon="😊" bg="linear-gradient(135deg,rgba(142,243,207,0.1),rgba(255,210,143,0.08))" />
        <ChipGroup
          label="How have you been feeling lately?"
          options={FEELING_WORDS}
          selected={feelingWords}
          onChange={setFeelingWords}
          noneLabel={ALRIGHT}
        />
      </section>

      {/* Open text */}
      <section className="panel">
        <SectionHeader icon="✏️" bg="linear-gradient(135deg,rgba(136,224,255,0.08),rgba(142,243,207,0.06))" />
        <span className="panel-label" style={{ display: "block", marginBottom: "0.75rem" }}>
          Anything else you want to say? (optional)
        </span>
        <textarea
          value={openText}
          onChange={(e) => setOpenText(e.target.value)}
          maxLength={1200}
          rows={3}
          placeholder="You can write anything here..."
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
          It&apos;s okay if EmpathiQ uses my answers to make the app better.
        </label>
      </section>

      {status === "error" && (
        <p style={{ color: "var(--rose)", fontSize: "0.85rem", textAlign: "center" }}>
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || status === "submitting"}
        style={{
          padding: "14px",
          borderRadius: "999px",
          border: "none",
          background: canSubmit
            ? "linear-gradient(135deg, var(--cyan), var(--mint))"
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
        {status === "submitting" ? "Submitting…" : "Submit my check-in"}
      </button>
    </form>
  );
}
