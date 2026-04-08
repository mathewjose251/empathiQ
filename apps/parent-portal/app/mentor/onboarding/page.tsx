"use client";

import { useState } from "react";
import Link from "next/link";

/*
 * ─── MENTOR ONBOARDING ──────────────────────────────────────────
 *
 * 4-step flow shown to mentors/counsellors after first login.
 *
 * Step 1: Role + institution details
 * Step 2: Create first cohort (name, level, size)
 * Step 3: Safety protocol acknowledgment (4 tiers, SLAs, responsibilities)
 * Step 4: Done → portal
 *
 * All state is local — this is an orientation flow.
 * Real cohort creation calls /api/mentor/cohort (wired up separately).
 */

type Step = 1 | 2 | 3 | 4;

type RoleType =
  | "school_counsellor"
  | "school_psychologist"
  | "pastoral_care"
  | "private_therapist"
  | "ngo_worker"
  | "other";

const ROLE_OPTIONS: { key: RoleType; label: string; desc: string }[] = [
  { key: "school_counsellor", label: "School Counsellor", desc: "Embedded in a school or group of schools" },
  { key: "school_psychologist", label: "School Psychologist", desc: "Clinical assessment and therapeutic support" },
  { key: "pastoral_care", label: "Pastoral / Welfare Staff", desc: "Form tutors, house staff, year heads" },
  { key: "private_therapist", label: "Private Therapist", desc: "Working with individual clients or families" },
  { key: "ngo_worker", label: "NGO / Youth Worker", desc: "Community or outreach-based support" },
  { key: "other", label: "Other", desc: "Tell us about your role in the setup" },
];

const YEAR_LEVELS = [
  "Grade 6 / Year 7", "Grade 7 / Year 8", "Grade 8 / Year 9",
  "Grade 9 / Year 10", "Grade 10 / Year 11", "Grade 11 / Year 12",
  "Grade 12 / Year 13", "Mixed / Multiple year groups",
];

const SAFETY_TIERS = [
  {
    icon: "🟢",
    tier: "GREEN",
    color: "#10b981",
    label: "No concern",
    sla: "No action required",
    description: "Student is engaging normally. No distress indicators. No action required from you.",
    mentorAction: "Continue monitoring via cohort dashboard.",
  },
  {
    icon: "🟡",
    tier: "AMBER",
    color: "#f59e0b",
    label: "Elevated distress",
    sla: "Check in within 48 hours",
    description: "Student's engagement patterns suggest elevated stress or withdrawal. Not an emergency, but warrants a check-in.",
    mentorAction: "Review the flag in your queue. Check in at the next natural opportunity — a scheduled session, a hallway conversation, or a message.",
  },
  {
    icon: "🔴",
    tier: "RED",
    color: "#ef4444",
    label: "Active distress signal",
    sla: "Same-day contact",
    description: "Student has indicated significant distress through their safety gate responses or activity patterns.",
    mentorAction: "Contact the student directly today. Do not delegate to a peer or admin. Document your action in the platform.",
  },
  {
    icon: "🆘",
    tier: "CRISIS",
    color: "#f43f5e",
    label: "Immediate safety concern",
    sla: "Within 5 minutes",
    description: "Student has indicated thoughts of self-harm or suicide. You and your school's designated safeguarding lead are alerted simultaneously.",
    mentorAction: "Activate your school's safeguarding protocol immediately. The student sees in-app crisis helplines and is told what was shared with whom. Document your response.",
  },
];

/* ── Shared input style ── */
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid rgba(173,201,255,0.18)",
  background: "rgba(8,20,39,0.6)",
  color: "#edf4ff",
  fontSize: "0.9rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "Georgia, serif",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#9fb2ca",
  marginBottom: 6,
};

const sectionStyle: React.CSSProperties = {
  maxWidth: 560,
  margin: "0 auto",
  padding: "24px 20px 56px",
  minHeight: "100vh",
};

export default function MentorOnboardingPage() {
  const [step, setStep] = useState<Step>(1);

  // Step 1 state
  const [fullName, setFullName] = useState("");
  const [institution, setInstitution] = useState("");
  const [role, setRole] = useState<RoleType | null>(null);
  const [studentCount, setStudentCount] = useState("");

  // Step 2 state
  const [cohortName, setCohortName] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [cohortSize, setCohortSize] = useState("");
  const [cohortNotes, setCohortNotes] = useState("");

  // Step 3 state
  const [acknowledgedTiers, setAcknowledgedTiers] = useState<Set<string>>(new Set());
  const [safeguardingContact, setSafeguardingContact] = useState("");

  const progress = (step / 4) * 100;

  const step1Valid = fullName.trim().length > 1 && institution.trim().length > 1 && role !== null;
  const step2Valid = cohortName.trim().length > 1 && yearLevel !== "";
  const step3Valid = acknowledgedTiers.size === 4 && safeguardingContact.trim().length > 1;

  const toggleAck = (tier: string) => {
    setAcknowledgedTiers((prev) => {
      const next = new Set(prev);
      if (next.has(tier)) next.delete(tier);
      else next.add(tier);
      return next;
    });
  };

  const handleFinish = async () => {
    // TODO: POST /api/mentor/onboarding with form data
    setStep(4);
  };

  return (
    <div style={sectionStyle}>
      {/* Progress */}
      <div
        style={{
          height: 3,
          borderRadius: 999,
          background: "rgba(255,255,255,0.08)",
          marginBottom: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, var(--mint), var(--cyan))",
            borderRadius: 999,
            transition: "width 0.4s ease",
          }}
        />
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.78rem",
          color: "#9fb2ca",
          marginBottom: 36,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "'Trebuchet MS', sans-serif",
        }}
      >
        Step {step} of 4
      </p>

      {/* ══════════════════════════════════════════════════════
          STEP 1 — Role + institution
      ══════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div>
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8ef3cf",
                marginBottom: 10,
              }}
            >
              Mentor portal setup
            </p>
            <h1
              style={{
                fontSize: "1.6rem",
                fontWeight: 600,
                lineHeight: 1.2,
                marginBottom: 10,
              }}
            >
              Let&apos;s set up your mentor account.
            </h1>
            <p style={{ color: "#9fb2ca", fontSize: "0.92rem", lineHeight: 1.7 }}>
              This takes about 4 minutes. Your details help us configure the right
              cohort view and safety routing for your context.
            </p>
          </div>

          {/* Name + institution */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}>
            <div>
              <label style={labelStyle}>Your full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Priya Sharma"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Institution or organisation</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="St. Xavier&apos;s School, Mumbai"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Role selector */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Your role</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ROLE_OPTIONS.map(({ key, label, desc }) => (
                <button
                  key={key}
                  onClick={() => setRole(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "13px 16px",
                    borderRadius: 14,
                    border: `1px solid ${role === key ? "#8ef3cf" : "rgba(173,201,255,0.14)"}`,
                    background: role === key ? "rgba(142,243,207,0.08)" : "rgba(8,20,39,0.4)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "border-color 0.2s, background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      border: `2px solid ${role === key ? "#8ef3cf" : "rgba(173,201,255,0.3)"}`,
                      background: role === key ? "#8ef3cf" : "transparent",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {role === key && (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0a1628" }} />
                    )}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0, color: "#edf4ff" }}>{label}</p>
                    <p style={{ fontSize: "0.8rem", color: "#9fb2ca", margin: 0, marginTop: 2 }}>{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Student count */}
          <div style={{ marginBottom: 32 }}>
            <label style={labelStyle}>Approximate number of students you support</label>
            <select
              value={studentCount}
              onChange={(e) => setStudentCount(e.target.value)}
              style={{ ...inputStyle, appearance: "none" }}
            >
              <option value="">Select a range</option>
              <option value="1-20">1 – 20</option>
              <option value="21-50">21 – 50</option>
              <option value="51-100">51 – 100</option>
              <option value="101-200">101 – 200</option>
              <option value="201-400">201 – 400</option>
              <option value="400+">400+</option>
            </select>
          </div>

          <button
            disabled={!step1Valid}
            onClick={() => setStep(2)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 999,
              background: step1Valid
                ? "linear-gradient(135deg, var(--mint), var(--cyan))"
                : "rgba(255,255,255,0.07)",
              color: step1Valid ? "#0a1628" : "#9fb2ca",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: step1Valid ? "pointer" : "default",
              letterSpacing: "0.04em",
              transition: "background 0.2s, color 0.2s",
            }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STEP 2 — Create first cohort
      ══════════════════════════════════════════════════════ */}
      {step === 2 && (
        <div>
          <div style={{ marginBottom: 32 }}>
            <p
              style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8ef3cf",
                marginBottom: 10,
              }}
            >
              Create your first cohort
            </p>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, lineHeight: 1.2, marginBottom: 10 }}>
              Which group of students are you setting this up for?
            </h2>
            <p style={{ color: "#9fb2ca", fontSize: "0.9rem", lineHeight: 1.7 }}>
              A cohort is a named group you monitor together — a year group, a
              class, a counselling caseload, or any custom grouping. You can add
              more cohorts from your portal dashboard.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
            <div>
              <label style={labelStyle}>Cohort name</label>
              <input
                type="text"
                value={cohortName}
                onChange={(e) => setCohortName(e.target.value)}
                placeholder="e.g. Year 10 — 2025/26"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Year group / level</label>
              <select
                value={yearLevel}
                onChange={(e) => setYearLevel(e.target.value)}
                style={{ ...inputStyle, appearance: "none" }}
              >
                <option value="">Select year group</option>
                {YEAR_LEVELS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Estimated cohort size (optional)</label>
              <input
                type="number"
                value={cohortSize}
                onChange={(e) => setCohortSize(e.target.value)}
                placeholder="e.g. 45"
                min={1}
                max={500}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Notes for yourself (optional)</label>
              <textarea
                value={cohortNotes}
                onChange={(e) => setCohortNotes(e.target.value)}
                placeholder="e.g. Board exam year, high academic pressure cohort"
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  lineHeight: 1.6,
                  fontFamily: "Georgia, serif",
                }}
              />
            </div>
          </div>

          {/* What you'll see in the cohort view */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: 14,
              border: "1px solid rgba(142,243,207,0.15)",
              background: "rgba(142,243,207,0.04)",
              marginBottom: 28,
            }}
          >
            <p
              style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#8ef3cf",
                marginBottom: 10,
              }}
            >
              What you&apos;ll see for this cohort
            </p>
            {[
              "Cohort-level thinking trap distribution (weekly)",
              "Engagement heat map — who's active, who's dropped off",
              "Individual risk flags sorted by tier (Amber → Red → Crisis)",
              "Session prompts generated from pattern data, not raw content",
            ].map((item) => (
              <div key={item} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <span style={{ color: "#8ef3cf", fontSize: "0.85rem", marginTop: 1, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: "0.85rem", color: "#9fb2ca", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          <button
            disabled={!step2Valid}
            onClick={() => setStep(3)}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 999,
              background: step2Valid
                ? "linear-gradient(135deg, var(--mint), var(--cyan))"
                : "rgba(255,255,255,0.07)",
              color: step2Valid ? "#0a1628" : "#9fb2ca",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: step2Valid ? "pointer" : "default",
              marginBottom: 10,
            }}
          >
            Continue →
          </button>
          <button
            onClick={() => setStep(1)}
            style={{
              width: "100%",
              padding: "10px",
              background: "none",
              border: "none",
              color: "#9fb2ca",
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STEP 3 — Safety protocol acknowledgment
      ══════════════════════════════════════════════════════ */}
      {step === 3 && (
        <div>
          <div style={{ marginBottom: 28 }}>
            <p
              style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: "0.75rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#8ef3cf",
                marginBottom: 10,
              }}
            >
              Safety protocol
            </p>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 600, lineHeight: 1.2, marginBottom: 10 }}>
              Read and acknowledge each tier.
            </h2>
            <p style={{ color: "#9fb2ca", fontSize: "0.9rem", lineHeight: 1.7 }}>
              EmpathiQ classifies student distress across four tiers. Each tier
              has a defined SLA and a specific action required from you. You are
              the human in the loop — the platform alerts, you decide.
            </p>
          </div>

          {/* Safety tiers */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {SAFETY_TIERS.map((tier) => {
              const isAcked = acknowledgedTiers.has(tier.tier);
              return (
                <div
                  key={tier.tier}
                  style={{
                    borderRadius: 16,
                    border: `1px solid ${isAcked ? tier.color + "55" : "rgba(173,201,255,0.12)"}`,
                    background: isAcked ? `${tier.color}0a` : "rgba(8,20,39,0.4)",
                    overflow: "hidden",
                    transition: "border-color 0.25s, background 0.25s",
                  }}
                >
                  {/* Tier header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "14px 18px 10px",
                      borderBottom: `1px solid ${isAcked ? tier.color + "33" : "rgba(173,201,255,0.08)"}`,
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{tier.icon}</span>
                    <div style={{ flex: 1 }}>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.88rem",
                          color: tier.color,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          fontFamily: "'Trebuchet MS', sans-serif",
                        }}
                      >
                        {tier.tier}
                      </span>
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: "0.82rem",
                          color: "#9fb2ca",
                        }}
                      >
                        — {tier.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: tier.color,
                        fontFamily: "'Trebuchet MS', sans-serif",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        opacity: 0.85,
                        flexShrink: 0,
                      }}
                    >
                      {tier.sla}
                    </span>
                  </div>

                  {/* Tier detail */}
                  <div style={{ padding: "12px 18px 16px" }}>
                    <p style={{ fontSize: "0.85rem", color: "#9fb2ca", lineHeight: 1.65, marginBottom: 10 }}>
                      {tier.description}
                    </p>
                    <div
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: `${tier.color}0d`,
                        border: `1px solid ${tier.color}22`,
                        marginBottom: 14,
                      }}
                    >
                      <p
                        style={{
                          fontSize: "0.8rem",
                          color: "#edf4ff",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        <strong style={{ color: tier.color }}>Your action:</strong>{" "}
                        {tier.mentorAction}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleAck(tier.tier)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        color: isAcked ? tier.color : "#9fb2ca",
                        fontSize: "0.82rem",
                        fontFamily: "'Trebuchet MS', sans-serif",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 4,
                          border: `2px solid ${isAcked ? tier.color : "rgba(173,201,255,0.3)"}`,
                          background: isAcked ? tier.color : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                      >
                        {isAcked && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l3 3 5-6" stroke="#0a1628" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      I understand my responsibility for {tier.tier} flags
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Safeguarding contact */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>
              Designated safeguarding lead at your institution
            </label>
            <input
              type="text"
              value={safeguardingContact}
              onChange={(e) => setSafeguardingContact(e.target.value)}
              placeholder="Name and/or contact (e.g. Mrs. Anil Mehta — principal@school.in)"
              style={inputStyle}
            />
            <p style={{ fontSize: "0.78rem", color: "#9fb2ca", marginTop: 7, lineHeight: 1.55 }}>
              This person is copied on CRISIS tier alerts alongside you.
              Use your institution&apos;s designated safeguarding lead — or yourself
              if you are the safeguarding lead.
            </p>
          </div>

          <button
            disabled={!step3Valid}
            onClick={handleFinish}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 999,
              background: step3Valid
                ? "linear-gradient(135deg, var(--mint), var(--cyan))"
                : "rgba(255,255,255,0.07)",
              color: step3Valid ? "#0a1628" : "#9fb2ca",
              fontWeight: 700,
              fontSize: "0.9rem",
              border: "none",
              cursor: step3Valid ? "pointer" : "default",
              marginBottom: 10,
            }}
          >
            Confirm and open portal →
          </button>
          {!step3Valid && (
            <p style={{ textAlign: "center", fontSize: "0.8rem", color: "#9fb2ca", marginBottom: 8 }}>
              Acknowledge all four tiers and add a safeguarding contact to continue.
            </p>
          )}
          <button
            onClick={() => setStep(2)}
            style={{
              width: "100%",
              padding: "10px",
              background: "none",
              border: "none",
              color: "#9fb2ca",
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          STEP 4 — Done
      ══════════════════════════════════════════════════════ */}
      {step === 4 && (
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(142,243,207,0.2), rgba(136,224,255,0.1))",
              border: "1px solid rgba(142,243,207,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              margin: "0 auto 20px",
            }}
          >
            ✓
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 600, marginBottom: 12 }}>
            Your mentor portal is ready.
          </h2>
          <p style={{ color: "#9fb2ca", lineHeight: 1.75, fontSize: "0.92rem", marginBottom: 32 }}>
            Cohort <strong style={{ color: "#edf4ff" }}>{cohortName || "your cohort"}</strong> is
            set up. Students will appear here as they join and engage. Risk flags
            surface as they occur — you&apos;re always in the loop before any action is
            taken.
          </p>

          {/* What to do first */}
          <div
            style={{
              padding: "20px",
              borderRadius: 16,
              border: "1px solid rgba(173,201,255,0.14)",
              background: "rgba(8,20,39,0.5)",
              marginBottom: 28,
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontFamily: "'Trebuchet MS', sans-serif",
                fontSize: "0.72rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#9fb2ca",
                marginBottom: 14,
              }}
            >
              Your first week
            </p>
            {[
              { step: "1", text: "Share the student onboarding link with your cohort — from Settings → Invite students" },
              { step: "2", text: "Review the cohort dashboard on Monday — it shows the week's pattern distribution" },
              { step: "3", text: "Check the risk flag queue — even if it's empty on day one" },
              { step: "4", text: "Explore the session prompts library — generated from pattern data, ready to use" },
            ].map(({ step: s, text }) => (
              <div key={s} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    border: "1px solid rgba(142,243,207,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                    color: "#8ef3cf",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {s}
                </div>
                <span style={{ fontSize: "0.87rem", color: "#9fb2ca", lineHeight: 1.6 }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Crisis reminder */}
          <div
            style={{
              padding: "14px 16px",
              borderRadius: 12,
              background: "rgba(244,63,94,0.06)",
              border: "1px solid rgba(244,63,94,0.2)",
              marginBottom: 28,
              textAlign: "left",
            }}
          >
            <p style={{ fontSize: "0.83rem", color: "#9fb2ca", lineHeight: 1.65, margin: 0 }}>
              <strong style={{ color: "#f43f5e" }}>CRISIS alerts are immediate.</strong>{" "}
              When one arrives, open it before you open anything else. The student
              has real-time crisis helplines in-app and knows what was shared. Your
              job is the human follow-through.
            </p>
          </div>

          <Link
            href="/mentor"
            style={{
              display: "block",
              padding: "14px",
              borderRadius: 999,
              background: "linear-gradient(135deg, var(--mint), var(--cyan))",
              color: "#0a1628",
              fontWeight: 700,
              fontSize: "0.9rem",
              textDecoration: "none",
              marginBottom: 10,
              letterSpacing: "0.04em",
            }}
          >
            Open my portal →
          </Link>
          <a
            href="mailto:mentors@empathiq.in"
            style={{
              display: "block",
              padding: "12px",
              borderRadius: 999,
              border: "1px solid rgba(173,201,255,0.18)",
              color: "#9fb2ca",
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            Questions? Email mentors@empathiq.in
          </a>
        </div>
      )}
    </div>
  );
}
