"use client";

import { useState } from "react";

import type {
  SurveySubmissionResult,
  TweenSurveyInput,
} from "@empathiq/shared/contracts/surveys";

const IDENTITY_OPTIONS = [
  {
    value: "ANONYMOUS",
    label: "Anonymous",
    description: "Good for an honest check-in without using your name.",
  },
  {
    value: "GOOGLE_ID",
    label: "Google ID",
    description: "Use this only if you want a grown-up follow-up later.",
  },
] as const;

const AGE_BANDS = ["10-11", "11-12", "12-13"] as const;

const MAIN_CONCERNS = [
  "School feels too heavy",
  "Grown-ups at home argue",
  "Friendship stuff feels confusing",
  "I get corrected a lot",
  "I worry when someone at home is upset",
  "Teacher pressure or fear",
  "Screens are hard to stop",
  "I feel left out or misunderstood",
  "Big feelings come fast",
  "I want more freedom but still need help",
  "None of these",
];

const PRESSURE_POINTS = [
  "Adults talk about me instead of with me",
  "I get compared to older kids",
  "Rules change depending on mood",
  "I do not know how to explain what I feel",
  "When adults fight, I cannot focus",
  "People try to fix things before listening",
  "School moves too fast when my head is full",
  "I am told I am not a kid, but not treated grown-up either",
  "None of these",
];

const HOME_CONFLICTS = [
  "Shouting",
  "Long tense silence",
  "I get pulled between adults",
  "I feel blamed for the stress",
  "Home feels unpredictable",
  "No one has time to really listen",
  "Routines keep changing",
  "I worry about an adult's mood",
  "None of these",
];

const SCHOOL_CONFLICTS = [
  "Fear of getting scolded",
  "Friend drama",
  "Being laughed at or left out",
  "Too much homework",
  "Hard to focus in class",
  "Teacher thinks I am lazy",
  "No safe adult at school",
  "I feel behind and embarrassed",
  "None of these",
];

const SUPPORT_NEEDS = [
  "One calm grown-up who listens first",
  "Less shouting around me",
  "Help saying what I feel",
  "A steadier routine",
  "Teacher kindness and patience",
  "Friendship support",
  "A reset plan when things get too big",
  "A later check-in with someone safe",
  "None of these",
];

const FEELING_WORDS = [
  "Worried",
  "Mixed-up",
  "Angry",
  "Embarrassed",
  "Lonely",
  "Pressured",
  "Confused",
  "Tired",
  "Left out",
  "Hopeful",
  "None of these",
];

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function TweenSurveyForm() {
  const [form, setForm] = useState<TweenSurveyInput>({
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
      const response = await fetch("/api/surveys/tween", {
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
    <form className="survey-shell tween-survey-shell" onSubmit={handleSubmit}>
      <div className="survey-header">
        <span className="chip">Tween check-in</span>
        <h1>Not a little kid. Not fully teen either. Still a lot to carry.</h1>
        <p>
          This check-in is built for ages 10 to 12. The tone is softer on purpose:
          more listening, less judging, and no redirect when you press save.
        </p>
      </div>

      <section className="survey-section">
        <h2>How should this check-in be stored?</h2>
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
              placeholder="name@gmail.com or a linked identifier"
              type="text"
              value={form.googleId}
            />
          </label>
        ) : null}

        <label className="survey-field">
          <span>Optional nickname</span>
          <input
            onChange={(event) =>
              setForm((current) => ({ ...current, respondentAlias: event.target.value }))
            }
            placeholder="Only if you want a friendly follow-up name"
            type="text"
            value={form.respondentAlias}
          />
        </label>
      </section>

      <section className="survey-section">
        <h2>Tell us about your world right now</h2>
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
          label="What feels biggest right now?"
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
          label="What makes the pressure grow?"
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
        <h2>Where does the hard part show up most?</h2>
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
          label="At school"
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
        <h2>What would help you feel safer or steadier?</h2>
        <SurveyMultiSelect
          label="Support that would actually help"
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
          label="Words that match lately"
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
          <span>If grown-ups understood one thing first, what should it be?</span>
          <textarea
            onChange={(event) =>
              setForm((current) => ({ ...current, openText: event.target.value }))
            }
            placeholder="Example: I look moody when I am overloaded, not because I want to be rude."
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
          <span>I am okay with a later check-in from someone safe.</span>
        </label>
      </section>

      {error ? <div className="survey-banner survey-banner-danger">{error}</div> : null}

      {result ? (
        <TweenThankYouMessage responseId={result.responseId} />
      ) : (
        <div className="survey-footer">
          <p>
            This page stays here after submit. If a trusted grown-up is helping, they
            can sit beside you, but the words can still be yours.
          </p>
          <button className="teen-btn teen-btn-accent" disabled={isSubmitting || !canSubmit} type="submit">
            {isSubmitting ? "Saving..." : "Save tween check-in"}
          </button>
        </div>
      )}
    </form>
  );
}

function TweenThankYouMessage({ responseId }: { responseId: string }) {
  return (
    <div
      style={{
        padding: "2.5rem 2rem",
        background: "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
        borderRadius: "12px",
        border: "2px solid var(--teen-accent)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>⭐</div>

      <h2
        style={{
          fontSize: "1.3rem",
          fontWeight: "700",
          color: "var(--teen-text)",
          marginBottom: "1rem",
        }}
      >
        You just helped make things better
      </h2>

      <p
        style={{
          fontSize: "0.95rem",
          lineHeight: "1.6",
          color: "var(--teen-text)",
          marginBottom: "1.5rem",
        }}
      >
        By telling us what's really going on, you're helping other kids like you feel understood.
        And you know what? That helps them be braver too.
      </p>

      <p
        style={{
          fontSize: "0.95rem",
          lineHeight: "1.6",
          color: "var(--teen-accent)",
          marginBottom: "1.5rem",
          fontWeight: "600",
        }}
      >
        The brave thing you just did—naming what's hard—that's exactly how people grow stronger.
      </p>

      <div
        style={{
          padding: "0.75rem",
          background: "rgba(6, 182, 212, 0.08)",
          borderRadius: "6px",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ fontSize: "0.75rem", color: "var(--teen-muted)", margin: 0 }}>
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
            fontSize: "0.9rem",
          }}
        >
          Back Home
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
            fontSize: "0.9rem",
          }}
        >
          Share Again
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
