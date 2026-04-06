"use client";

import { useState } from "react";

import type {
  ParentSurveyInput,
  SurveySubmissionResult,
} from "@empathiq/shared/contracts/surveys";

const IDENTITY_OPTIONS = [
  {
    value: "ANONYMOUS",
    label: "Anonymous",
    description: "Useful when you want to describe the family system honestly without naming anyone.",
  },
  {
    value: "GOOGLE_ID",
    label: "Google ID",
    description: "Useful if you want future workshop or mentor follow-up. This is not verified OAuth yet.",
  },
] as const;

const TEEN_AGE_BANDS = ["13-14", "15-16", "17-18", "Mixed ages"] as const;

const MAIN_CONCERNS = [
  "Academic underperformance",
  "Teen shuts down when stressed",
  "Frequent arguments at home",
  "Teacher conflict",
  "Screen or gaming overuse",
  "Sleep and routine breakdown",
  "Peer influence worries",
  "Substance risk",
  "Low confidence",
  "Emotional overload during exam periods",
  "None of these",
];

const PRESSURE_POINTS = [
  "High expectations at home",
  "Parents are not aligned",
  "The teen says teachers do not understand them",
  "Too much tuition or coaching load",
  "Home conflict carries into study time",
  "The teen feels judged before being heard",
  "Adults escalate quickly once grades drop",
  "The family only talks when there is a problem",
  "None of these",
];

const HOME_CONFLICTS = [
  "Shouting or harsh tone",
  "Blame between adults",
  "Inconsistent rules",
  "Comparison with siblings or cousins",
  "One parent protects, one parent pressures",
  "Substance use in the home",
  "Parental separation or emotional distance",
  "No shared routine for study, sleep, and meals",
  "None of these",
];

const SCHOOL_CONFLICTS = [
  "Teacher only contacts us after escalation",
  "Public comparison or shame",
  "Teen feels targeted or labelled",
  "Attendance and punctuality stress",
  "Presentation or speaking anxiety",
  "Bullying or social exclusion",
  "School does not understand home context",
  "Study load is crowding out recovery time",
  "None of these",
];

const SUPPORT_NEEDS = [
  "Parent coaching on calmer responses",
  "A shared home routine plan",
  "Mentor mediation with the teen",
  "School bridge or teacher conversation support",
  "Screen and sleep reset plan",
  "Conflict de-escalation tools",
  "Help naming the real pressure, not just behaviour",
  "Follow-up workshop or group session",
  "None of these",
];

function toggleValue(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}

export function ParentSurveyForm() {
  const [form, setForm] = useState<ParentSurveyInput>({
    identityMode: "ANONYMOUS",
    googleId: "",
    respondentAlias: "",
    teenAgeBand: "",
    householdContext: "",
    mainConcerns: [],
    pressurePoints: [],
    homeConflictThemes: [],
    schoolConflictThemes: [],
    supportNeeds: [],
    openText: "",
    followUpConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SurveySubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    form.teenAgeBand &&
    form.householdContext &&
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
      setError("Pick the teen age band, household context, and at least one concern, pressure point, and support need.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/surveys/parent", {
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
    <form className="survey-shell" onSubmit={handleSubmit}>
      <div className="survey-header">
        <span className="chip">Parent survey</span>
        <h1>Map the family pressure before it becomes only a grades conversation</h1>
        <p>
          This form is designed to surface the load under the behaviour: home conflict,
          teacher tension, routine breakdown, and emotional overload.
        </p>
      </div>

      <section className="survey-section">
        <h2>Identity and follow-up</h2>
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
          <span>Optional name or alias</span>
          <input
            onChange={(event) =>
              setForm((current) => ({ ...current, respondentAlias: event.target.value }))
            }
            placeholder="Helpful if you want workshop follow-up"
            type="text"
            value={form.respondentAlias}
          />
        </label>
      </section>

      <section className="survey-section">
        <h2>Family context</h2>
        <div className="survey-chip-row">
          {TEEN_AGE_BANDS.map((band) => (
            <button
              className={`survey-pill ${form.teenAgeBand === band ? "survey-pill-active" : ""}`}
              key={band}
              onClick={() => setForm((current) => ({ ...current, teenAgeBand: band }))}
              type="button"
            >
              {band}
            </button>
          ))}
        </div>

        <label className="survey-field">
          <span>Household context in one line</span>
          <input
            onChange={(event) =>
              setForm((current) => ({ ...current, householdContext: event.target.value }))
            }
            placeholder="Example: Two working parents, high tuition load, frequent evening arguments."
            type="text"
            value={form.householdContext}
          />
        </label>

        <SurveyMultiSelect
          label="What concerns you most?"
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
          label="Where does the pressure build fastest?"
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
        <h2>Conflict map</h2>
        <SurveyMultiSelect
          label="Home conflict patterns"
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
          label="School or teacher conflict patterns"
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
        <h2>What kind of help would move this family forward?</h2>
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

        <label className="survey-field">
          <span>
            If one thing changed at home or school in the next month, what would make the biggest difference?
          </span>
          <textarea
            onChange={(event) =>
              setForm((current) => ({ ...current, openText: event.target.value }))
            }
            placeholder="Example: We need a calmer after-school routine and a teacher conversation that focuses on support, not public pressure."
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
          <span>I am open to a follow-up conversation or workshop invite.</span>
        </label>
      </section>

      {error ? <div className="survey-banner survey-banner-danger">{error}</div> : null}

      {result ? (
        <ParentThankYouMessage responseId={result.responseId} />
      ) : (
        <div className="survey-footer">
          <p>This form does not redirect after submit. It stays here and confirms the save inline.</p>
          <button className="shell-link shell-link-accent" disabled={isSubmitting || !canSubmit} type="submit">
            {isSubmitting ? "Saving..." : "Save parent survey"}
          </button>
        </div>
      )}
    </form>
  );
}

function ParentThankYouMessage({ responseId }: { responseId: string }) {
  return (
    <div
      style={{
        padding: "3rem 2rem",
        background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)",
        borderRadius: "12px",
        border: "2px solid rgb(139, 92, 246)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🙏</div>

      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "rgb(30, 41, 59)",
          marginBottom: "1rem",
        }}
      >
        Thank you for showing up
      </h2>

      <p
        style={{
          fontSize: "1.05rem",
          lineHeight: "1.6",
          color: "rgb(51, 65, 85)",
          marginBottom: "1.5rem",
        }}
      >
        By sharing what you're noticing in your teen's world, you're helping create a platform
        that understands real families. Other parents in similar situations will benefit from your
        honesty.
      </p>

      <p
        style={{
          fontSize: "1.05rem",
          lineHeight: "1.6",
          color: "rgb(139, 92, 246)",
          marginBottom: "1.5rem",
          fontWeight: "600",
        }}
      >
        And while you're helping them, you're also helping yourself—and your teen. Understanding
        the pressure they're under is the first step toward being the kind of parent that helps
        them grow stronger, not just perform better.
      </p>

      <p style={{ fontSize: "0.9rem", color: "rgb(107, 114, 128)", marginBottom: "2rem" }}>
        Your insights will directly influence how we design mentor guidance, family resources, and
        the stories your teen encounters on EmpathiQ.
      </p>

      <div
        style={{
          padding: "1rem",
          background: "rgba(139, 92, 246, 0.08)",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <p style={{ fontSize: "0.8rem", color: "rgb(107, 114, 128)", margin: 0 }}>
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
          href="/parent"
          style={{
            padding: "0.75rem 1.5rem",
            background: "rgb(139, 92, 246)",
            color: "white",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "600",
            border: "none",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Back to Dashboard
        </a>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "0.75rem 1.5rem",
            background: "transparent",
            color: "rgb(139, 92, 246)",
            borderRadius: "6px",
            border: "2px solid rgb(139, 92, 246)",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          Add Another Response
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
