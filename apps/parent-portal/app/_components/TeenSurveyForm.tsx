"use client";

import { useState } from "react";

import type {
  SurveySubmissionResult,
  TeenSurveyInput,
} from "@empathiq/shared/contracts/surveys";

const IDENTITY_OPTIONS = [
  {
    value: "ANONYMOUS",
    label: "Anonymous",
    description: "Best for honest signal gathering without linking it back to your identity.",
  },
  {
    value: "GOOGLE_ID",
    label: "Google ID",
    description: "Use a Google-linked identifier if you want follow-up later. This is not verified OAuth yet.",
  },
] as const;

const AGE_BANDS = ["13-14", "15-16", "17-18"] as const;

const MAIN_CONCERNS = [
  "Academic pressure",
  "Conflict at home",
  "Arguments between parents",
  "Teacher pressure",
  "Peer comparison",
  "Feeling alone",
  "Screen overload",
  "Sleep problems",
  "Identity or self-image",
  "Substance use around me",
  "None of these",
];

const PRESSURE_POINTS = [
  "Marks feel tied to my worth",
  "Adults compare me to others",
  "Home conflict spills into study time",
  "Teachers assume I am lazy",
  "Tuition load leaves no breathing room",
  "I shut down when adults start questioning me",
  "I feel like I have to manage everyone's mood",
  "I cannot switch off my phone or thoughts",
  "None of these",
];

const HOME_CONFLICTS = [
  "Shouting",
  "Silent treatment",
  "Blame loops",
  "Mixed rules from adults",
  "Pressure about grades",
  "One parent undermines the other",
  "Adults do not listen fully",
  "I hide what I feel to keep the peace",
  "None of these",
];

const SCHOOL_CONFLICTS = [
  "Teacher humiliation or sarcasm",
  "Fear of disappointing teachers",
  "Public comparison",
  "Too many corrections, not enough support",
  "No safe adult at school",
  "Attendance or punctuality pressure",
  "Presentation anxiety",
  "Teachers do not understand home stress",
  "None of these",
];

const SUPPORT_NEEDS = [
  "A calmer home tone",
  "One adult who listens without fixing",
  "Help planning studies without panic",
  "Less comparison",
  "Support with sleep and phone habits",
  "A mediator between me and adults",
  "A mentor who checks in privately",
  "Teachers understanding the context before judging",
  "None of these",
];

const FEELING_WORDS = [
  "Overloaded",
  "Misunderstood",
  "Numb",
  "Anxious",
  "Angry",
  "Embarrassed",
  "Hopeless",
  "Pressured",
  "Lonely",
  "Tired",
  "None of these",
];

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function TeenSurveyForm() {
  const [form, setForm] = useState<TeenSurveyInput>({
    identityMode: "ANONYMOUS",
    googleId: "",
    respondentAlias: "",
    ageBand: "",
    mainConcerns: [],
    pressurePoints: [],
    homeConflictThemes: [],
    schoolConflictThemes: [],
    supportNeeds: [],
    feelingWords: [],
    openText: "",
    followUpConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SurveySubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    form.ageBand &&
    form.mainConcerns.length > 0 &&
    form.pressurePoints.length > 0 &&
    form.supportNeeds.length > 0;

  async function parseSurveyResponse(response: Response) {
    const raw = await response.text();

    if (!raw.trim()) {
      return {
        error:
          "The survey endpoint returned an empty response. Please try again.",
      };
    }

    try {
      return JSON.parse(raw) as SurveySubmissionResult | { error?: string };
    } catch {
      return {
        error:
          "The survey endpoint returned an unreadable response. Please try again.",
      };
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setError("Pick your age band, at least one concern, one pressure point, and one support need.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/surveys/teen", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await parseSurveyResponse(response);

      if (!response.ok) {
        throw new Error("error" in payload ? payload.error : "Unable to save survey right now.");
      }

      setResult(payload as SurveySubmissionResult);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to save survey right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="survey-shell teen-card" onSubmit={handleSubmit}>
      <div className="survey-header">
        <span className="chip">Teen survey</span>
        <h1>Help us understand the real pressure behind the story</h1>
        <p>
          This stays on the same page. We use it to sharpen missions, mentor context,
          and family support without pushing you into a public flow.
        </p>
        <p className="survey-helper-link">
          If you are closer to 10-12 than 13-18, use the gentler{" "}
          <a href="/tween/survey">Tween Check-In</a> instead.
        </p>
      </div>

      <section className="survey-section">
        <h2>How should this response be stored?</h2>
        <div className="survey-choice-grid">
          {IDENTITY_OPTIONS.map((option) => (
            <button
              className={`survey-choice ${form.identityMode === option.value ? "survey-choice-active" : ""}`}
              key={option.value}
              onClick={() => setForm((current) => ({ ...current, identityMode: option.value }))}
              type="button"
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>

        {form.identityMode === "GOOGLE_ID" ? (
          <label className="survey-field">
            <span>Google-linked identifier</span>
            <input
              onChange={(event) =>
                setForm((current) => ({ ...current, googleId: event.target.value }))
              }
              placeholder="name@gmail.com or Google subject id"
              type="text"
              value={form.googleId}
            />
          </label>
        ) : null}

        <label className="survey-field">
          <span>Optional alias</span>
          <input
            onChange={(event) =>
              setForm((current) => ({ ...current, respondentAlias: event.target.value }))
            }
            placeholder="Used only if you want a named follow-up"
            type="text"
            value={form.respondentAlias}
          />
        </label>
      </section>

      <section className="survey-section">
        <h2>Tell us about this season</h2>
        <div className="survey-chip-row">
          {AGE_BANDS.map((band) => (
            <button
              className={`survey-pill ${form.ageBand === band ? "survey-pill-active" : ""}`}
              key={band}
              onClick={() => setForm((current) => ({ ...current, ageBand: band }))}
              type="button"
            >
              {band}
            </button>
          ))}
        </div>

        <SurveyMultiSelect
          label="What feels heaviest right now?"
          options={MAIN_CONCERNS}
          selected={form.mainConcerns}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              mainConcerns: toggleValue(current.mainConcerns, value),
            }))
          }
        />

        <SurveyMultiSelect
          label="What creates the most pressure between you and adults?"
          options={PRESSURE_POINTS}
          selected={form.pressurePoints}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              pressurePoints: toggleValue(current.pressurePoints, value),
            }))
          }
        />
      </section>

      <section className="survey-section">
        <h2>Where does conflict usually show up?</h2>
        <SurveyMultiSelect
          label="At home"
          options={HOME_CONFLICTS}
          selected={form.homeConflictThemes}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              homeConflictThemes: toggleValue(current.homeConflictThemes, value),
            }))
          }
        />

        <SurveyMultiSelect
          label="At school or with teachers"
          options={SCHOOL_CONFLICTS}
          selected={form.schoolConflictThemes}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              schoolConflictThemes: toggleValue(current.schoolConflictThemes, value),
            }))
          }
        />
      </section>

      <section className="survey-section">
        <h2>What would actually help?</h2>
        <SurveyMultiSelect
          label="Support needs"
          options={SUPPORT_NEEDS}
          selected={form.supportNeeds}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              supportNeeds: toggleValue(current.supportNeeds, value),
            }))
          }
        />

        <SurveyMultiSelect
          label="Words that match your recent mood"
          options={FEELING_WORDS}
          selected={form.feelingWords}
          onToggle={(value) =>
            setForm((current) => ({
              ...current,
              feelingWords: toggleValue(current.feelingWords, value),
            }))
          }
        />

        <label className="survey-field">
          <span>If adults understood one thing before reacting, what should it be?</span>
          <textarea
            onChange={(event) =>
              setForm((current) => ({ ...current, openText: event.target.value }))
            }
            placeholder="Example: When home is loud, I look disengaged at school, but really I am just trying not to explode."
            rows={5}
            value={form.openText}
          />
        </label>

        <label className="survey-checkbox">
          <input
            checked={form.followUpConsent}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                followUpConsent: event.target.checked,
              }))
            }
            type="checkbox"
          />
          <span>I am open to a follow-up check-in later.</span>
        </label>
      </section>

      {error ? <div className="survey-banner survey-banner-danger">{error}</div> : null}

      {result ? (
        <ThankYouMessage responseId={result.responseId} />
      ) : (
        <div className="survey-footer">
          <p>This page never redirects on submit. You stay here and get a saved-state message inline.</p>
          <button className="teen-btn teen-btn-accent" disabled={isSubmitting || !canSubmit} type="submit">
            {isSubmitting ? "Saving..." : "Save teen survey"}
          </button>
        </div>
      )}
    </form>
  );
}

function ThankYouMessage({ responseId }: { responseId: string }) {
  return (
    <div
      style={{
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
        borderRadius: "12px",
        border: "2px solid var(--teen-accent)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✨</div>

      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "var(--teen-text)",
          marginBottom: "1rem",
        }}
      >
        Your voice matters
      </h2>

      <p
        style={{
          fontSize: "1.05rem",
          lineHeight: "1.6",
          color: "var(--teen-text)",
          marginBottom: "1.5rem",
        }}
      >
        By sharing what you're experiencing, you're doing something powerful: you're helping other
        teens who are going through similar situations feel less alone. Their stories matter because
        your story matters.
      </p>

      <p
        style={{
          fontSize: "1.05rem",
          lineHeight: "1.6",
          color: "var(--teen-accent)",
          marginBottom: "1.5rem",
          fontWeight: "600",
        }}
      >
        And here's the thing—while you're helping them, you're also helping yourself grow. Every
        time you name what you're feeling, every time you speak truth, you learn a little more about
        who you are and what you actually need.
      </p>

      <p style={{ fontSize: "0.9rem", color: "var(--teen-muted)", marginBottom: "2rem" }}>
        Your response has been saved and will shape how EmpathiQ evolves to meet teens where they
        actually are.
      </p>

      <div
        style={{
          padding: "1rem",
          background: "rgba(6, 182, 212, 0.08)",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "var(--teen-muted)", margin: 0 }}>
          Response ID: <strong>{responseId}</strong>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <a
          href="/teen"
          style={{
            padding: "0.75rem 1.5rem",
            background: "var(--teen-accent)",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Back to Home
        </a>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.75rem 1.5rem",
            background: "transparent",
            color: "var(--teen-accent)",
            borderRadius: "6px",
            border: "2px solid var(--teen-accent)",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Share Another Response
        </button>
      </div>
    </div>
  );
}

function SurveyMultiSelect({
  label,
  onToggle,
  options,
  selected,
}: {
  label: string;
  onToggle: (value: string) => void;
  options: string[];
  selected: string[];
}) {
  return (
    <div className="survey-group">
      <p>{label}</p>
      <div className="survey-pill-grid">
        {options.map((option) => (
          <button
            className={`survey-pill ${selected.includes(option) ? "survey-pill-active" : ""}`}
            key={option}
            onClick={() => onToggle(option)}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
