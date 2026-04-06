"use client";

import { useState } from "react";

const AGE_BANDS = ["13–14", "15–16", "17–18"];

const MAIN_CONCERNS = [
  "School performance",
  "Friendships & social life",
  "Family relationships",
  "Self-image & body image",
  "Social media & online life",
  "Future & career",
  "Romantic relationships",
  "Mental health",
  "Physical health",
];

const PRESSURE_POINTS = [
  "Exam pressure",
  "Parent expectations",
  "Peer pressure",
  "Social media",
  "Career decisions",
  "Sibling conflict",
  "Body image",
  "Loneliness",
];

const HOME_CONFLICT_THEMES = [
  "Rules & boundaries",
  "Privacy",
  "Screen time",
  "Grades & academics",
  "Sibling rivalry",
  "Communication",
  "Trust",
];

const SCHOOL_CONFLICT_THEMES = [
  "Peer conflict / bullying",
  "Teacher relationships",
  "Academic pressure",
  "Group projects",
  "Belonging & fitting in",
  "Extracurriculars",
];

const SUPPORT_NEEDS = [
  "Someone to talk to",
  "Tips to manage stress",
  "Better sleep",
  "More confidence",
  "Help with relationships",
  "Guidance on future",
  "Managing anger",
];

const FEELING_WORDS = [
  "Anxious",
  "Overwhelmed",
  "Lonely",
  "Hopeful",
  "Confident",
  "Angry",
  "Sad",
  "Numb",
  "Excited",
  "Confused",
];

function CheckGroup({
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
      <p
        style={{
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--teen-muted)",
          marginBottom: "0.75rem",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "0.4rem 0.9rem",
                borderRadius: "9999px",
                fontSize: "0.8rem",
                border: `1px solid ${active ? "var(--teen-accent)" : "var(--teen-border)"}`,
                background: active
                  ? "rgba(6,182,212,0.15)"
                  : "transparent",
                color: active ? "var(--teen-accent)" : "var(--teen-muted)",
                cursor: "pointer",
                transition: "all 0.15s",
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

export function TeenSurveyForm() {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ageBand || !mainConcerns.length) return;
    setStatus("submitting");

    try {
      const res = await fetch("/api/survey/teen", {
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
      <div className="teen-card" style={{ textAlign: "center", padding: "2.5rem 1.5rem" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🌱</div>
        <h2
          className="home-greeting"
          style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}
        >
          Thank you!
        </h2>
        <p style={{ color: "var(--teen-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="teen-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <h1
          className="home-greeting"
          style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}
        >
          Quick check-in
        </h1>
        <p style={{ color: "var(--teen-muted)", fontSize: "0.85rem" }}>
          Anonymous · takes ~2 min
        </p>
      </div>

      <div className="teen-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--teen-muted)",
            marginBottom: "0.75rem",
            fontWeight: 600,
          }}
        >
          Your age group
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {AGE_BANDS.map((band) => (
            <button
              key={band}
              type="button"
              onClick={() => setAgeBand(band)}
              style={{
                padding: "0.5rem 1.2rem",
                borderRadius: "9999px",
                fontSize: "0.85rem",
                border: `1px solid ${ageBand === band ? "var(--teen-purple)" : "var(--teen-border)"}`,
                background:
                  ageBand === band ? "rgba(139,92,246,0.2)" : "transparent",
                color:
                  ageBand === band ? "var(--teen-purple)" : "var(--teen-muted)",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      <div className="teen-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <CheckGroup
          label="What do you worry about most? (pick any)"
          options={MAIN_CONCERNS}
          selected={mainConcerns}
          onChange={setMainConcerns}
        />
        <CheckGroup
          label="What puts pressure on you?"
          options={PRESSURE_POINTS}
          selected={pressurePoints}
          onChange={setPressurePoints}
        />
        <CheckGroup
          label="What causes tension at home?"
          options={HOME_CONFLICT_THEMES}
          selected={homeConflictThemes}
          onChange={setHomeConflictThemes}
        />
        <CheckGroup
          label="What's hard at school?"
          options={SCHOOL_CONFLICT_THEMES}
          selected={schoolConflictThemes}
          onChange={setSchoolConflictThemes}
        />
        <CheckGroup
          label="What kind of support would help?"
          options={SUPPORT_NEEDS}
          selected={supportNeeds}
          onChange={setSupportNeeds}
        />
        <CheckGroup
          label="How do you usually feel lately?"
          options={FEELING_WORDS}
          selected={feelingWords}
          onChange={setFeelingWords}
        />
      </div>

      <div className="teen-card" style={{ padding: "1.5rem", marginBottom: "1rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--teen-muted)",
            marginBottom: "0.75rem",
            fontWeight: 600,
          }}
        >
          Anything else on your mind? (optional)
        </p>
        <textarea
          value={openText}
          onChange={(e) => setOpenText(e.target.value)}
          maxLength={1200}
          rows={3}
          placeholder="Share anything you'd like us to know..."
          style={{
            width: "100%",
            background: "var(--teen-bg)",
            border: "1px solid var(--teen-border)",
            borderRadius: "0.5rem",
            color: "var(--teen-text)",
            fontSize: "0.9rem",
            padding: "0.75rem",
            resize: "vertical",
            boxSizing: "border-box",
            outline: "none",
            fontFamily: "inherit",
          }}
        />
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginTop: "1rem",
            cursor: "pointer",
            fontSize: "0.85rem",
            color: "var(--teen-muted)",
          }}
        >
          <input
            type="checkbox"
            checked={followUpConsent}
            onChange={(e) => setFollowUpConsent(e.target.checked)}
            style={{ accentColor: "var(--teen-accent)", width: "1rem", height: "1rem" }}
          />
          I&apos;m okay with EmpathiQ using my answers to improve the experience.
        </label>
      </div>

      {status === "error" && (
        <p
          style={{
            color: "var(--teen-rose)",
            fontSize: "0.85rem",
            marginBottom: "0.75rem",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={!ageBand || !mainConcerns.length || status === "submitting"}
        className="teen-btn teen-btn-accent"
        style={{ width: "100%" }}
      >
        {status === "submitting" ? "Submitting…" : "Submit check-in"}
      </button>
    </form>
  );
}
