"use client";

import { useState } from "react";

import type {
  CreatePackPostInput,
  CreatePackPostResult,
  DeletePackPostResult,
  HidePackAliasResult,
  PackFeedPayload,
  PackFeedPost,
  PackModerationStatus,
  PackReportReason,
  ReportPackPostInput,
  ReportPackPostResult,
  UpdatePackConsentInput,
  UpdatePackConsentResult,
} from "../../../../packages/shared/src/contracts/pack";
import type { SpotlightContent, TeenMissionChoice } from "../../../../packages/shared/src/contracts/webPortal";

interface TeenMissionExperienceProps {
  story: SpotlightContent;
  choices: TeenMissionChoice[];
  reflectionPrompt: string;
  feed: PackFeedPayload;
}

type MissionStage = "choose" | "reflect" | "shared";

const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true";

function previewModeration(body: string): PackModerationStatus {
  const normalized = body.toLowerCase();

  if (
    /kill myself|end my life|don't want to live|die tonight|suicide|hurt myself|cut myself|self harm|self-harm/.test(
      normalized,
    )
  ) {
    return "ESCALATED";
  }

  if (
    /school|street|road|instagram|insta|snap|snapchat|whatsapp|phone|call me|@\w+/.test(
      normalized,
    ) || /\b\d{5,}\b/.test(normalized)
  ) {
    return "BLOCKED";
  }

  if (/weed|alcohol|drunk|high|smoking|vape|vodka|beer|unsafe at home|violent/.test(normalized)) {
    return "QUEUED";
  }

  return "CLEARED";
}

export function TeenMissionExperience({
  story,
  choices,
  reflectionPrompt,
  feed,
}: TeenMissionExperienceProps) {
  const [stage, setStage] = useState<MissionStage>("choose");
  const [selectedChoice, setSelectedChoice] = useState<TeenMissionChoice | null>(null);
  const [reflection, setReflection] = useState(
    "I could feel my mind trying to make one test mean everything. Slowing down made the situation feel smaller and more workable.",
  );
  const [feedItems, setFeedItems] = useState<PackFeedPost[]>(feed.posts);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"info" | "warn" | "danger">("info");
  const [consentAcknowledged, setConsentAcknowledged] = useState(
    feed.consentAcknowledged,
  );
  const [postingEnabled, setPostingEnabled] = useState(feed.postingEnabled);

  function handleChoose(choice: TeenMissionChoice) {
    setSelectedChoice(choice);
    setStage("reflect");
  }

  async function refreshFeed() {
    if (isStaticPreview) {
      return;
    }

    const response = await fetch("/api/pack/feed");

    if (!response.ok) {
      return;
    }

    const latest = (await response.json()) as PackFeedPayload;
    setFeedItems(latest.posts);
    setConsentAcknowledged(latest.consentAcknowledged);
    setPostingEnabled(latest.postingEnabled);
  }

  async function handleConsentChange(acknowledged: boolean) {
    if (isStaticPreview) {
      setConsentAcknowledged(acknowledged);
      setPostingEnabled(acknowledged);
      setStatusMessage(
        acknowledged
          ? "Preview mode: Pack posting unlocked locally in this browser."
          : "Preview mode: Pack posting locked until acknowledgement is turned back on.",
      );
      setStatusTone(acknowledged ? "info" : "warn");
      return;
    }

    const payload: UpdatePackConsentInput = { acknowledged };

    const response = await fetch("/api/pack/consent", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatusMessage("Unable to update Pack acknowledgement right now.");
      setStatusTone("danger");
      return;
    }

    const result = (await response.json()) as UpdatePackConsentResult;
    setConsentAcknowledged(result.consentAcknowledged);
    setPostingEnabled(result.postingEnabled);
    setStatusMessage(result.message);
    setStatusTone(result.postingEnabled ? "info" : "warn");
  }

  async function handleReport(postId: string, reason: PackReportReason) {
    if (isStaticPreview) {
      setStatusMessage(
        `Preview mode: reported ${postId} for ${reason.replaceAll("_", " ").toLowerCase()}.`,
      );
      setStatusTone(reason === "SELF_HARM_CONCERN" ? "danger" : "warn");
      return;
    }

    const payload: ReportPackPostInput = { postId, reason };

    const response = await fetch("/api/pack/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatusMessage("Unable to report that Pack post right now.");
      setStatusTone("danger");
      return;
    }

    const result = (await response.json()) as ReportPackPostResult;
    setStatusMessage(result.message);
    setStatusTone(result.moderationStatus === "ESCALATED" ? "danger" : "warn");
    await refreshFeed();
  }

  async function handleHideAlias(alias: string) {
    if (isStaticPreview) {
      setFeedItems((current) => current.filter((item) => item.alias !== alias));
      setStatusMessage(`Preview mode: ${alias} hidden in this browser only.`);
      setStatusTone("info");
      return;
    }

    const response = await fetch("/api/pack/hide-alias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ alias }),
    });

    if (!response.ok) {
      setStatusMessage("Unable to hide that alias right now.");
      setStatusTone("danger");
      return;
    }

    const result = (await response.json()) as HidePackAliasResult;
    setStatusMessage(result.message);
    setStatusTone("info");
    await refreshFeed();
  }

  async function handleDeleteOwnPost(postId: string) {
    if (isStaticPreview) {
      setFeedItems((current) => current.filter((item) => item.id !== postId));
      setStatusMessage("Preview mode: your Pack post was removed locally.");
      setStatusTone("info");
      return;
    }

    const response = await fetch(`/api/pack/post/${postId}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as DeletePackPostResult;
    setStatusMessage(result.message);
    setStatusTone(result.success ? "info" : "danger");

    if (result.success) {
      setFeedItems((current) => current.filter((item) => item.id !== postId));
    }
  }

  async function handlePostReflection() {
    if (!selectedChoice || !reflection.trim() || !postingEnabled) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (isStaticPreview) {
        const moderationStatus = previewModeration(reflection.trim());
        const previewPost: PackFeedPost = {
          id: `preview-post-${Date.now()}`,
          alias: "Quiet Orbit",
          mood: selectedChoice.mood,
          body: reflection.trim(),
          branchLabel: selectedChoice.branchLabel,
          thinkingTrapTag: selectedChoice.tag,
          createdLabel: "Just now",
          moderationStatus,
          reactions: [
            { kind: "I_RELATE", count: 1 },
            { kind: "THIS_HELPED", count: 1 },
          ],
          isOwnPost: moderationStatus === "CLEARED",
        };

        if (moderationStatus === "CLEARED") {
          setFeedItems((current) => [previewPost, ...current]);
          setStatusMessage("Preview mode: reflection added locally to the Pack feed.");
          setStatusTone("info");
        } else if (moderationStatus === "QUEUED") {
          setStatusMessage(
            "Preview mode: this reflection would be queued for a quick human review before appearing.",
          );
          setStatusTone("warn");
        } else if (moderationStatus === "BLOCKED") {
          setStatusMessage(
            "Preview mode: this reflection would be blocked for possible identifying details.",
          );
          setStatusTone("warn");
        } else {
          setStatusMessage(
            "Preview mode: this reflection would be escalated for human safety review instead of posting.",
          );
          setStatusTone("danger");
        }

        setStage("shared");
        return;
      }

      const payload: CreatePackPostInput = {
        missionId: "mission-night-before-finals",
        branchLabel: selectedChoice.branchLabel,
        thinkingTrapTag: selectedChoice.tag,
        mood: selectedChoice.mood,
        body: reflection.trim(),
      };

      const response = await fetch("/api/pack/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Unable to post reflection right now.");
      }

      const result = (await response.json()) as CreatePackPostResult;

      if (result.post) {
        setFeedItems((current) => [result.post as PackFeedPost, ...current]);
      }

      setStatusMessage(result.message);
      setStatusTone(
        result.moderationStatus === "CLEARED"
          ? "info"
          : result.moderationStatus === "QUEUED"
            ? "warn"
            : "danger",
      );
      setStage("shared");
    } catch (error) {
      setStatusMessage(
        error instanceof Error ? error.message : "Unable to post reflection right now.",
      );
      setStatusTone("danger");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <section className="mission-progress">
        <div
          className={`mission-step ${
            stage === "choose" ? "mission-step-active" : "mission-step-done"
          }`}
        >
          <span>01</span>
          <strong>Choose a path</strong>
        </div>
        <div
          className={`mission-step ${
            stage === "reflect"
              ? "mission-step-active"
              : stage === "shared"
                ? "mission-step-done"
                : ""
          }`}
        >
          <span>02</span>
          <strong>Reflect privately</strong>
        </div>
        <div className={`mission-step ${stage === "shared" ? "mission-step-active" : ""}`}>
          <span>03</span>
          <strong>Share to Pack</strong>
        </div>
      </section>

      <section className="privacy-rail">
        <article className="privacy-card">
          <span className="panel-label">Pack privacy</span>
          <p>{feed.privacyNotice}</p>
          {isStaticPreview ? (
            <div className="status-banner status-banner-info">
              Static preview mode: interactions stay in this browser and no real API is used.
            </div>
          ) : null}
        </article>
        <article className="privacy-card">
          <span className="panel-label">Posting consent</span>
          <p>{feed.consentNotice}</p>
          <label className="consent-toggle">
            <input
              checked={consentAcknowledged}
              onChange={(event) => handleConsentChange(event.target.checked)}
              type="checkbox"
            />
            <span>
              I understand this Pack is pseudonymous, moderated, and not for emergencies
              or identifying details.
            </span>
          </label>
        </article>
        <article className="privacy-card">
          <span className="panel-label">Posting rules</span>
          <ul className="privacy-list">
            {feed.postingRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="teen-stage teen-stage-main">
        <article className="mission-scene">
          <div className="mission-scene-glow" />
          <div className="mission-meta">
            <span className="chip">{story.chip}</span>
            <span className="story-beat">03 minutes · Night signal</span>
          </div>
          <h2>{story.title}</h2>
          <p>{story.detail}</p>
          <div className="sense-row">
            <span className="sense-pill">Pause</span>
            <span className="sense-pill">Feet on floor</span>
            <span className="sense-pill">Name 3 sounds</span>
          </div>

          {selectedChoice ? (
            <div className="mission-result">
              <div className="mission-result-top">
                <span className="panel-label">Selected path</span>
                <span className="choice-badge">{selectedChoice.tag}</span>
              </div>
              <h3>{selectedChoice.branchLabel}</h3>
              <p>{selectedChoice.consequence}</p>
            </div>
          ) : null}
        </article>

        <div className="choice-stack">
          {choices.map((choice, index) => {
            const isSelected = selectedChoice?.id === choice.id;

            return (
              <button
                className={`choice-card choice-card-${index + 1} ${
                  isSelected ? "choice-card-selected" : ""
                }`}
                key={choice.id}
                onClick={() => handleChoose(choice)}
                type="button"
              >
                <div className="choice-head">
                  <span className="panel-label">{choice.label}</span>
                  <span className="choice-badge">{choice.branchLabel}</span>
                </div>
                <h3>{choice.title}</h3>
                <p>{choice.detail}</p>
                <div className="choice-footer">
                  <span>{choice.mood}</span>
                  <span>{choice.tag}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="teen-stage teen-stage-secondary">
        <article className="reflection-card">
          <div className="reflection-top">
            <span className="panel-label">Anonymous reflection</span>
            <span className="reflection-state">
              {stage === "shared" ? "Posted safely" : "Pack-safe"}
            </span>
          </div>
          <h3>Share the thought under the thought.</h3>
          <p>{reflectionPrompt}</p>

          <label className="reflection-label" htmlFor="teen-reflection">
            What was happening inside right before the choice?
          </label>
          <textarea
            className="reflection-input"
            id="teen-reflection"
            value={reflection}
            onChange={(event) => setReflection(event.target.value)}
            placeholder="Write what the moment felt like, not what it looked like."
          />

          <div className="reflection-actions">
            <button
              className="primary-action"
              disabled={!selectedChoice || !reflection.trim() || !postingEnabled}
              onClick={handlePostReflection}
              type="button"
            >
              {isSubmitting
                ? "Posting..."
                : stage === "shared"
                  ? "Posted to Pack"
                  : "Post to Pack"}
            </button>
            <span className="ghost-note">
              {selectedChoice
                ? `Silent tag sent: ${selectedChoice.tag}`
                : "Choose a path to unlock posting"}
            </span>
          </div>

          {statusMessage ? (
            <div className={`status-banner status-banner-${statusTone}`}>
              {statusMessage}
            </div>
          ) : null}
        </article>

        <article className="feed-card">
          <div className="reflection-top">
            <span className="panel-label">Pack feed</span>
            <span className="reflection-state">{feedItems.length} recent echoes</span>
          </div>
          <div className="feed-stack">
            {feedItems.map((item) => (
              <div className="feed-item" key={item.id}>
                <div className="feed-head">
                  <strong>{item.alias}</strong>
                  <span>{item.mood}</span>
                </div>
                <p>{item.body}</p>
                <div className="reaction-row">
                  {item.reactions.map((reaction) => (
                    <span className="reaction-chip" key={`${item.id}-${reaction.kind}`}>
                      {reaction.kind.replaceAll("_", " ")} · {reaction.count}
                    </span>
                  ))}
                </div>
                <div className="post-actions">
                  {item.isOwnPost ? (
                    <button
                      className="secondary-action"
                      onClick={() => handleDeleteOwnPost(item.id)}
                      type="button"
                    >
                      Remove post
                    </button>
                  ) : (
                    <>
                      <button
                        className="secondary-action"
                        onClick={() => handleReport(item.id, "IDENTITY_OR_PRIVACY")}
                        type="button"
                      >
                        Report privacy
                      </button>
                      <button
                        className="secondary-action"
                        onClick={() => handleReport(item.id, "BULLYING_OR_HARM")}
                        type="button"
                      >
                        Report harm
                      </button>
                      <button
                        className="secondary-action"
                        onClick={() => handleHideAlias(item.alias)}
                        type="button"
                      >
                        Hide alias
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
