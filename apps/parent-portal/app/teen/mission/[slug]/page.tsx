"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import type { CreatePackPostResult, PackModerationStatus } from "@empathiq/shared/contracts/pack";
import {
  getTeenMissionDetail,
  THINKING_TRAP_EXPLANATIONS,
} from "../../../_lib/teenMissionCatalog";
import { useTeen, getAvatarStage, AVATAR_EMOJI } from "../../_context/TeenContext";

type Stage = "story" | "choice" | "consequence" | "reflect";
type PathChoice = "pathA" | "pathB";

const STAGE_ORDER: Stage[] = ["story", "choice", "consequence", "reflect"];

function splitNarrative(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunkSize = Math.max(1, Math.ceil(sentences.length / 3));
  return [
    sentences.slice(0, chunkSize).join(" ").trim(),
    sentences.slice(chunkSize, chunkSize * 2).join(" ").trim(),
    sentences.slice(chunkSize * 2).join(" ").trim(),
  ].filter(Boolean);
}

function statusTone(status: PackModerationStatus) {
  if (status === "CLEARED") return "var(--teen-green)";
  if (status === "QUEUED") return "var(--teen-amber)";
  return "var(--teen-rose)";
}

export default function MissionPage() {
  const params = useParams();
  const router = useRouter();
  const teen = useTeen();

  const slug = params.slug as string;
  const mission = useMemo(() => getTeenMissionDetail(slug), [slug]);
  const narrativeChunks = useMemo(
    () => (mission ? splitNarrative(mission.narrative) : []),
    [mission],
  );

  const [stage, setStage] = useState<Stage>("story");
  const [chosenPath, setChosenPath] = useState<PathChoice | null>(null);
  const [revealedChunks, setRevealedChunks] = useState(1);
  const [reflectionText, setReflectionText] = useState("");
  const [packConsent, setPackConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completionOpen, setCompletionOpen] = useState(false);
  const [completionMessage, setCompletionMessage] = useState(
    "Mission complete. Your reflection is ready for the Pack.",
  );
  const [completionTone, setCompletionTone] = useState<PackModerationStatus>("CLEARED");
  const [earnedXP, setEarnedXP] = useState(0);

  useEffect(() => {
    setStage("story");
    setChosenPath(null);
    setRevealedChunks(1);
    setReflectionText("");
    setPackConsent(false);
    setCompletionOpen(false);
  }, [slug]);

  if (!mission) {
    return (
      <div className="teen-page teen-text-center" style={{ paddingTop: 64 }}>
        <p style={{ fontSize: "2rem", marginBottom: 12 }}>🔍</p>
        <p style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>Story not found</p>
        <p className="teen-text-muted teen-text-small" style={{ marginBottom: 24 }}>
          This mission hasn&apos;t launched yet. Check back soon for more story drops.
        </p>
        <button className="teen-btn teen-btn-accent" onClick={() => router.push("/teen/stories")}>
          Browse All Stories
        </button>
      </div>
    );
  }

  const decision = chosenPath ? mission[chosenPath] : mission.pathA;
  const avatarEmoji = AVATAR_EMOJI[getAvatarStage(teen.totalXP)];
  const stageIndex = STAGE_ORDER.indexOf(stage);
  const shareReady = reflectionText.trim().length >= 8 && packConsent;

  function handleRevealMore() {
    if (revealedChunks < narrativeChunks.length) {
      setRevealedChunks((current) => current + 1);
      return;
    }

    setStage("choice");
  }

  function choosePath(path: PathChoice) {
    setChosenPath(path);
    setStage("consequence");
  }

  async function finalizeMission(shareToPack: boolean) {
    if (!chosenPath || !mission) {
      return;
    }

    const baseXP = decision.xpReward;
    const reflectionBonus = shareToPack && reflectionText.trim().length >= 8 ? 15 : 0;
    const totalXP = baseXP + reflectionBonus;

    setIsSubmitting(true);

    try {
      if (shareToPack) {
        await fetch("/api/pack/consent", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ acknowledged: true }),
        });

        const response = await fetch("/api/pack/post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            missionId: mission.slug,
            branchLabel: chosenPath === "pathA" ? "Grounded path" : "Trap path",
            thinkingTrapTag: decision.thinkingTrapCode,
            mood: chosenPath === "pathA" ? "Grounding" : "Raw honesty",
            body: reflectionText.trim(),
          }),
        });

        const result = (await response.json()) as CreatePackPostResult | { error?: string };

        if (!response.ok) {
          throw new Error("error" in result ? result.error : "Unable to post to the Pack right now.");
        }

        const packResult = result as CreatePackPostResult;
        setCompletionMessage(packResult.message);
        setCompletionTone(packResult.moderationStatus);
      } else {
        setCompletionMessage("Mission complete. You can always come back later and post a reflection to the Pack.");
        setCompletionTone("CLEARED");
      }

      teen.completeStory(chosenPath === "pathA");
      teen.addXP(totalXP, "story");

      if (reflectionText.trim().length >= 8) {
        teen.incrementStreak();
      }

      setEarnedXP(totalXP);
      setCompletionOpen(true);
    } catch (error) {
      setCompletionMessage(
        error instanceof Error ? error.message : "Unable to finish the mission right now.",
      );
      setCompletionTone("ESCALATED");
      setCompletionOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {completionOpen ? (
        <div className="mission-complete-overlay">
          <div className="mission-complete-avatar">{avatarEmoji}</div>
          <div className="mission-complete-xp">+{earnedXP} XP</div>
          <div
            className="mission-complete-label"
            style={{ color: statusTone(completionTone) }}
          >
            {completionTone === "CLEARED"
              ? "Shared with your Pack"
              : completionTone === "QUEUED"
                ? "Queued for review"
                : completionTone === "BLOCKED"
                  ? "Held for privacy"
                  : "Escalated for safety"}
          </div>
          <p style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 6 }}>Mission Complete</p>
          <p className="teen-text-muted teen-text-small" style={{ marginBottom: 32, lineHeight: 1.6 }}>
            {completionMessage}
          </p>
          <button
            className="teen-btn teen-btn-accent"
            onClick={() => router.push("/teen/pack")}
            style={{ marginBottom: 10 }}
          >
            See Your Pack 🏕️
          </button>
          <button className="teen-btn teen-btn-outline" onClick={() => router.push("/teen/stories")}>
            More Stories
          </button>
        </div>
      ) : null}

      <div className="teen-page page-enter">
        <div className="mission-stage-header">
          <button className="mission-back-btn" onClick={() => router.back()}>
            ← Back
          </button>
          <div className="story-dots">
            {STAGE_ORDER.map((item, index) => (
              <div
                key={item}
                className={`story-dot${index === stageIndex ? " active" : index < stageIndex ? " done" : ""}`}
              />
            ))}
          </div>
          <div style={{ width: 60, textAlign: "right", fontSize: "0.7rem", color: "var(--teen-muted)" }}>
            ⏱ {mission.estimatedMinutes}m
          </div>
        </div>

        {stage === "story" ? (
          <div className="teen-fade-in">
            <div style={{ marginBottom: 16 }}>
              <p className="teen-text-muted teen-text-small">{mission.theme}</p>
              <p className="story-theme">{mission.chapterLabel}</p>
              <h1 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.3px" }}>
                {mission.title}
              </h1>
            </div>

            <div className="teen-card teen-card-glow-cyan">
              {narrativeChunks.slice(0, revealedChunks).map((chunk, index) => (
                <p
                  key={index}
                  className="text-chunk"
                  style={{
                    lineHeight: 1.8,
                    fontSize: "0.95rem",
                    color: "var(--teen-text)",
                    marginBottom: index < revealedChunks - 1 ? 12 : 0,
                  }}
                >
                  {chunk}
                </p>
              ))}
            </div>

            {revealedChunks >= narrativeChunks.length ? (
              <div className="sensory-box teen-fade-in">
                <p style={{ fontWeight: 500, marginBottom: 6 }}>💫 Pause for a moment:</p>
                <p>{mission.sensoryPrompt}</p>
              </div>
            ) : null}

            <button className="teen-btn teen-btn-accent teen-mt-16" onClick={handleRevealMore}>
              {revealedChunks < narrativeChunks.length ? "Keep Reading ->" : "I'm Ready to Choose"}
            </button>
          </div>
        ) : null}

        {stage === "choice" ? (
          <div className="teen-fade-in">
            <div style={{ marginBottom: 16 }}>
              <p className="teen-text-muted teen-text-small">What path fits this moment?</p>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: 8 }}>Choose Your Path</h2>
            </div>

            {(["pathA", "pathB"] as PathChoice[]).map((path) => {
              const item = mission[path];
              const grounded = item.thinkingTrapCode === "ACCURATE_THINKING";

              return (
                <button
                  key={path}
                  className={`choice-card ${grounded ? "choice-card-green" : "choice-card-rose"}`}
                  onClick={() => choosePath(path)}
                >
                  <div style={{ fontSize: "1.2rem", marginBottom: 8 }}>
                    {grounded ? "🌿" : "⚠️"}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 10 }}>
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: grounded ? "var(--teen-green)" : "var(--teen-rose)",
                      fontWeight: 600,
                    }}
                  >
                    {item.thinkingTrapLabel} · +{item.xpReward} XP
                  </div>
                </button>
              );
            })}

            <div
              className="teen-text-center teen-text-small"
              style={{
                color: "var(--teen-muted)",
                marginTop: 16,
                padding: 12,
                background: "rgba(255,255,255,0.03)",
                borderRadius: 12,
              }}
            >
              Both paths teach you something. One helps you spot the trap faster.
            </div>
          </div>
        ) : null}

        {stage === "consequence" && chosenPath ? (
          <div className="teen-fade-in">
            <div style={{ marginBottom: 16 }}>
              <p className="teen-text-muted teen-text-small">{decision.thinkingTrapLabel}</p>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginTop: 8 }}>Here&apos;s What Happens</h2>
            </div>

            <div className="teen-card teen-card-glow-cyan">
              <p style={{ lineHeight: 1.8, fontSize: "0.95rem" }}>{decision.consequence}</p>
            </div>

            <div className="teen-card teen-card-glow-purple trap-reveal" style={{ marginTop: 16 }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "var(--teen-purple)",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 8,
                }}
              >
                Thinking Trap Lens
              </div>
              <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 8, color: "var(--teen-text)" }}>
                {decision.thinkingTrapLabel}
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--teen-muted)", lineHeight: 1.6 }}>
                {THINKING_TRAP_EXPLANATIONS[decision.thinkingTrapCode]}
              </p>
            </div>

            <button className="teen-btn teen-btn-purple teen-mt-16" onClick={() => setStage("reflect")}>
              Continue to Reflection
            </button>
          </div>
        ) : null}

        {stage === "reflect" && chosenPath ? (
          <div className="teen-fade-in">
            <div style={{ marginBottom: 16 }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700 }}>What did this moment teach you?</h2>
              <p className="teen-text-muted teen-text-small" style={{ marginTop: 6 }}>
                Share one honest reflection with the Pack, or complete privately.
              </p>
            </div>

            <div
              className="teen-card"
              style={{
                background: "rgba(139,92,246,0.05)",
                borderColor: "var(--teen-purple)",
                marginBottom: 16,
              }}
            >
              <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: 4 }}>
                {decision.thinkingTrapLabel}
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--teen-muted)" }}>
                {THINKING_TRAP_EXPLANATIONS[decision.thinkingTrapCode]}
              </p>
            </div>

            <textarea
              className="teen-textarea"
              placeholder="What was the hardest part of this moment, and what would help next time?"
              value={reflectionText}
              onChange={(event) => setReflectionText(event.target.value)}
            />

            <label
              style={{
                display: "flex",
                gap: 10,
                marginTop: 12,
                alignItems: "flex-start",
                color: "var(--teen-muted)",
                fontSize: "0.85rem",
              }}
            >
              <input
                checked={packConsent}
                onChange={(event) => setPackConsent(event.target.checked)}
                type="checkbox"
              />
              <span>
                I understand this Pack post is pseudonymous, moderated, and not for names,
                schools, phone numbers, or emergencies.
              </span>
            </label>

            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <span className="xp-badge">
                {avatarEmoji} +{decision.xpReward} XP
              </span>
              {reflectionText.trim().length >= 8 ? (
                <span
                  className="xp-badge"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    borderColor: "var(--teen-purple)",
                    color: "var(--teen-purple)",
                  }}
                >
                  ✍️ +15 XP bonus
                </span>
              ) : null}
            </div>

            <button
              className="teen-btn teen-btn-purple"
              onClick={() => void finalizeMission(true)}
              disabled={!shareReady || isSubmitting}
              style={{ marginTop: 12, opacity: !shareReady || isSubmitting ? 0.45 : 1 }}
            >
              {isSubmitting ? "Sharing..." : "Share with My Pack 🏕️"}
            </button>

            {!shareReady ? (
              <p className="teen-text-center teen-text-small teen-text-muted" style={{ marginTop: 8 }}>
                Write at least a sentence and confirm the Pack privacy rules to share.
              </p>
            ) : null}

            <div style={{ textAlign: "center", marginTop: 12 }}>
              <button
                onClick={() => void finalizeMission(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--teen-muted)",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  textDecoration: "underline",
                }}
              >
                Complete without sharing
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
