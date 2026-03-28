"use client";

import { useState } from "react";

import type {
  AdminPackConsolePayload,
  ModerationQueueItem,
  UpdateModerationDecisionInput,
  UpdateModerationDecisionResult,
} from "@empathiq/shared/contracts/pack";

const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true";

export function AdminPackModerationConsole({
  payload,
}: {
  payload: AdminPackConsolePayload;
}) {
  const [items, setItems] = useState<ModerationQueueItem[]>(payload.queue);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function applyDecision(
    postId: string,
    decision: UpdateModerationDecisionInput["decision"],
  ) {
    if (isStaticPreview) {
      const nextStatus: ModerationQueueItem["moderationStatus"] =
        decision === "PUBLISH"
          ? "CLEARED"
          : decision === "KEEP_BLOCKED"
            ? "BLOCKED"
            : "ESCALATED";

      setItems((current) =>
        current
          .map((item) =>
            item.id === postId
              ? { ...item, moderationStatus: nextStatus }
              : item,
          )
          .filter((item) => item.moderationStatus !== "CLEARED"),
      );
      setStatusMessage(`Preview mode: updated ${postId} to ${nextStatus}.`);
      return;
    }

    const response = await fetch("/api/pack/moderation", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ postId, decision }),
    });

    if (!response.ok) {
      setStatusMessage("Unable to update moderation right now.");
      return;
    }

    const result = (await response.json()) as UpdateModerationDecisionResult;

    setItems((current) =>
      current
        .map((item) =>
          item.id === result.postId
            ? { ...item, moderationStatus: result.moderationStatus }
            : item,
        )
        .filter((item) => item.moderationStatus !== "CLEARED"),
    );

    setStatusMessage(`Updated ${result.postId} to ${result.moderationStatus}.`);
  }

  return (
    <>
      <section className="digest-banner">
        <span className="panel-label">Audit boundary</span>
        <p>{payload.auditNotice}</p>
        {isStaticPreview ? (
          <div className="status-banner status-banner-info">
            Static preview mode: moderation actions update only the local preview.
          </div>
        ) : null}
      </section>

      <section className="flagged-board">
        <div className="flagged-board-head">
          <span className="panel-label">Pack moderation queue</span>
          <h3>Admin safety review</h3>
        </div>

        {statusMessage ? (
          <div className="status-banner status-banner-info">{statusMessage}</div>
        ) : null}

        <div className="flagged-grid">
          {items.map((item) => (
            <article className="flagged-card" key={item.id}>
              <div className="feed-head">
                <strong>{item.thinkingTrapTag}</strong>
                <span>{item.moderationStatus}</span>
              </div>
              <p>{item.redactedExcerpt}</p>
              <div className="reaction-row">
                {item.safetyFlags.map((flag) => (
                  <span className="reaction-chip" key={`${item.id}-${flag}`}>
                    {flag.replaceAll("_", " ")}
                  </span>
                ))}
                <span className="reaction-chip">Reports · {item.reportCount}</span>
              </div>
              <div className="moderation-actions">
                <button
                  className="secondary-action"
                  onClick={() => applyDecision(item.id, "PUBLISH")}
                  type="button"
                >
                  Publish
                </button>
                <button
                  className="secondary-action"
                  onClick={() => applyDecision(item.id, "KEEP_BLOCKED")}
                  type="button"
                >
                  Keep blocked
                </button>
                <button
                  className="secondary-action secondary-action-danger"
                  onClick={() => applyDecision(item.id, "ESCALATE_TO_ADMIN")}
                  type="button"
                >
                  Escalate
                </button>
              </div>
              <span className="ghost-note">{item.createdLabel}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="system-strip">
        <div>
          <span className="panel-label">Identity access policy</span>
          <h3>Break-glass only</h3>
        </div>
        <ol>
          {payload.identityAccessPolicy.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>
    </>
  );
}
