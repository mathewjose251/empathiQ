"use client";

import { useState } from "react";
import type { ModerationQueueItem } from "@empathiq/shared/contracts/pack";

const isStaticPreview = process.env.NEXT_PUBLIC_STATIC_PREVIEW === "true";

export function ModerationQueueClient({
  zone,
  posts,
}: {
  zone: "RED" | "YELLOW";
  posts: ModerationQueueItem[];
}) {
  const [items, setItems] = useState<ModerationQueueItem[]>(posts);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  async function applyDecision(
    postId: string,
    decision: "PUBLISH" | "KEEP_BLOCKED" | "ESCALATE_TO_ADMIN",
  ) {
    setActionInProgress(postId);

    try {
      if (isStaticPreview) {
        const nextStatus =
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
        setStatusMessage(`✓ Preview mode: ${decision === "PUBLISH" ? "Published" : decision === "KEEP_BLOCKED" ? "Blocked" : "Escalated"}`);
        setTimeout(() => setActionInProgress(null), 1500);
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
        setStatusMessage("❌ Unable to update right now. Try again?");
        setActionInProgress(null);
        return;
      }

      const result = await response.json();

      setItems((current) =>
        current
          .map((item) =>
            item.id === result.postId
              ? { ...item, moderationStatus: result.moderationStatus }
              : item,
          )
          .filter((item) => item.moderationStatus !== "CLEARED"),
      );

      const actionLabel =
        decision === "PUBLISH"
          ? "Published to Pack"
          : decision === "KEEP_BLOCKED"
            ? "Blocked"
            : "Escalated to clinical staff";

      setStatusMessage(`✓ ${actionLabel}`);
      setTimeout(() => setActionInProgress(null), 1500);
    } catch (error) {
      setStatusMessage("❌ Error processing decision");
      setActionInProgress(null);
    }
  }

  const zoneColor = zone === "RED" ? "rgb(239, 68, 68)" : "rgb(251, 146, 60)";
  const zoneBgLight = zone === "RED" ? "rgba(239, 68, 68, 0.02)" : "rgba(251, 146, 60, 0.02)";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))",
        gap: "1.5rem",
        marginBottom: "1rem",
      }}
    >
      {items.length === 0 ? (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            background: zoneBgLight,
            borderRadius: "8px",
            border: `1px dashed ${zoneColor}20`,
            color: "rgb(107, 114, 128)",
            gridColumn: "1 / -1",
          }}
        >
          No posts in this zone.
        </div>
      ) : (
        items.map((post) => (
          <article
            key={post.id}
            style={{
              padding: "1.5rem",
              background: "white",
              borderRadius: "8px",
              border: `1px solid ${zoneColor}30`,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: zoneColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.25rem",
                  }}
                >
                  {zone === "RED" ? "🔴 RED — Immediate Risk" : "🟡 YELLOW — Concerning Pattern"}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgb(107, 114, 128)" }}>
                  {post.createdLabel}
                </div>
              </div>

              {/* THINKING TRAP TAG */}
              {post.thinkingTrapTag && (
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.75rem",
                    background: "rgb(226, 232, 240)",
                    borderRadius: "9999px",
                    fontSize: "0.75rem",
                    fontWeight: "600",
                    color: "rgb(30, 41, 59)",
                  }}
                >
                  {post.thinkingTrapTag}
                </span>
              )}
            </div>

            {/* SAFETY FLAGS */}
            {post.safetyFlags.length > 0 && (
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.75rem",
                  background: `${zoneColor}08`,
                  borderRadius: "6px",
                  borderLeft: `3px solid ${zoneColor}`,
                }}
              >
                <div
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: "700",
                    color: zoneColor,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginBottom: "0.5rem",
                  }}
                >
                  Flagged for:
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                  }}
                >
                  {post.safetyFlags.map((flag) => (
                    <span
                      key={flag}
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.6rem",
                        background: zoneColor + "20",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        color: zoneColor,
                      }}
                    >
                      {flag.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* REDACTED EXCERPT */}
            <div
              style={{
                padding: "1rem",
                background: "rgb(249, 250, 251)",
                borderRadius: "6px",
                marginBottom: "1rem",
                borderLeft: `3px solid rgb(226, 232, 240)`,
              }}
            >
              <p
                style={{
                  fontSize: "0.9rem",
                  lineHeight: "1.5",
                  color: "rgb(51, 65, 85)",
                  margin: 0,
                  fontStyle: "italic",
                }}
              >
                "{post.redactedExcerpt}"
              </p>
            </div>

            {/* REPORT COUNT */}
            {post.reportCount > 0 && (
              <div
                style={{
                  marginBottom: "1rem",
                  padding: "0.5rem 0.75rem",
                  background: "rgba(251, 146, 60, 0.1)",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  color: "rgb(251, 146, 60)",
                  fontWeight: "500",
                }}
              >
                ⚠️ Reported {post.reportCount} {post.reportCount === 1 ? "time" : "times"} by peers
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: zone === "RED" ? "1fr 1fr" : "repeat(3, 1fr)",
                gap: "0.75rem",
              }}
            >
              {zone === "RED" ? (
                <>
                  <button
                    onClick={() => applyDecision(post.id, "ESCALATE_TO_ADMIN")}
                    disabled={actionInProgress === post.id}
                    style={{
                      padding: "0.75rem",
                      background: zoneColor,
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: actionInProgress === post.id ? "not-allowed" : "pointer",
                      opacity: actionInProgress === post.id ? 0.7 : 1,
                    }}
                  >
                    {actionInProgress === post.id ? "⏳" : "🚨"} Escalate to Clinical
                  </button>
                  <button
                    onClick={() => applyDecision(post.id, "KEEP_BLOCKED")}
                    disabled={actionInProgress === post.id}
                    style={{
                      padding: "0.75rem",
                      background: "rgb(107, 114, 128)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: actionInProgress === post.id ? "not-allowed" : "pointer",
                      opacity: actionInProgress === post.id ? 0.7 : 1,
                    }}
                  >
                    {actionInProgress === post.id ? "⏳" : "🚫"} Block Post
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => applyDecision(post.id, "PUBLISH")}
                    disabled={actionInProgress === post.id}
                    style={{
                      padding: "0.75rem",
                      background: "rgb(34, 197, 94)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: actionInProgress === post.id ? "not-allowed" : "pointer",
                      opacity: actionInProgress === post.id ? 0.7 : 1,
                    }}
                  >
                    {actionInProgress === post.id ? "⏳" : "✅"} Publish
                  </button>
                  <button
                    onClick={() => applyDecision(post.id, "ESCALATE_TO_ADMIN")}
                    disabled={actionInProgress === post.id}
                    style={{
                      padding: "0.75rem",
                      background: zoneColor,
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: actionInProgress === post.id ? "not-allowed" : "pointer",
                      opacity: actionInProgress === post.id ? 0.7 : 1,
                    }}
                  >
                    {actionInProgress === post.id ? "⏳" : "⚡"} Escalate
                  </button>
                  <button
                    onClick={() => applyDecision(post.id, "KEEP_BLOCKED")}
                    disabled={actionInProgress === post.id}
                    style={{
                      padding: "0.75rem",
                      background: "rgb(107, 114, 128)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.9rem",
                      fontWeight: "600",
                      cursor: actionInProgress === post.id ? "not-allowed" : "pointer",
                      opacity: actionInProgress === post.id ? 0.7 : 1,
                    }}
                  >
                    {actionInProgress === post.id ? "⏳" : "🚫"} Block
                  </button>
                </>
              )}
            </div>
          </article>
        ))
      )}

      {/* STATUS MESSAGE */}
      {statusMessage && (
        <div
          style={{
            gridColumn: "1 / -1",
            padding: "1rem",
            background: statusMessage.startsWith("❌")
              ? "rgba(239, 68, 68, 0.1)"
              : "rgba(34, 197, 94, 0.1)",
            borderRadius: "6px",
            color: statusMessage.startsWith("❌")
              ? "rgb(239, 68, 68)"
              : "rgb(34, 197, 94)",
            fontSize: "0.9rem",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
