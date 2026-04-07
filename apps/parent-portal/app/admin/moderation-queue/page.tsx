export const dynamic = "force-dynamic";

import { Suspense } from "react";
import Link from "next/link";
import type { ModerationQueuePayload } from "@empathiq/shared/contracts/pack";
import { AppShell } from "../../_components/AppShell";
import { HeroSection } from "../../_components/HeroSection";
import { ModerationQueueClient } from "./_components/ModerationQueueClient";
import { getModerationQueue } from "../../_lib/packStore";

async function ModerationQueueContent() {
  const queue = await getModerationQueue();

  // Separate RED and YELLOW posts
  const redPosts = queue.items.filter((item) => item.moderationStatus === "ESCALATED");
  const yellowPosts = queue.items.filter((item) => item.moderationStatus === "QUEUED");

  const totalFlagged = redPosts.length + yellowPosts.length;

  return (
    <AppShell
      eyebrow="Admin Hub"
      navItems={[
        { label: "Dashboard", href: "/admin" },
        { label: "Moderation Queue", href: "/admin/moderation-queue" },
      ]}
    >
      <HeroSection
        eyebrow="Safety Operations"
        title="Pack Moderation Queue"
        lede={`${totalFlagged} posts awaiting review ${totalFlagged === 0 ? "— all clear" : ""}`}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="admin-metric-card"
          style={{
            padding: "1.5rem",
            borderRadius: "8px",
            background: "rgba(239, 68, 68, 0.05)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "rgb(239, 68, 68)",
              marginBottom: "0.5rem",
            }}
          >
            🔴 {redPosts.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "rgb(107, 114, 128)" }}>
            RED ZONE — Escalated for immediate review
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgb(156, 163, 175)", marginTop: "0.5rem" }}>
            Suspected self-harm, suicide, abuse
          </div>
        </div>

        <div
          className="admin-metric-card"
          style={{
            padding: "1.5rem",
            borderRadius: "8px",
            background: "rgba(251, 146, 60, 0.05)",
            border: "1px solid rgba(251, 146, 60, 0.2)",
          }}
        >
          <div
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              color: "rgb(251, 146, 60)",
              marginBottom: "0.5rem",
            }}
          >
            🟡 {yellowPosts.length}
          </div>
          <div style={{ fontSize: "0.9rem", color: "rgb(107, 114, 128)" }}>
            YELLOW ZONE — Requires human judgment
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgb(156, 163, 175)", marginTop: "0.5rem" }}>
            Substance use, depression, bullying
          </div>
        </div>
      </div>

      {/* RED ZONE POSTS */}
      <section style={{ marginBottom: "3rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "1rem",
            marginBottom: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgb(229, 231, 235)",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "rgb(239, 68, 68)" }}>
            🔴 RED ZONE — {redPosts.length} {redPosts.length === 1 ? "post" : "posts"}
          </h2>
          {redPosts.length > 0 && (
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                background: "rgba(239, 68, 68, 0.1)",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "rgb(239, 68, 68)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Urgent
            </span>
          )}
        </div>

        {redPosts.length > 0 ? (
          <ModerationQueueClient zone="RED" posts={redPosts} />
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              background: "rgba(239, 68, 68, 0.02)",
              borderRadius: "8px",
              border: "1px dashed rgba(239, 68, 68, 0.2)",
              color: "rgb(107, 114, 128)",
            }}
          >
            No RED zone posts. All escalated posts are handled.
          </div>
        )}
      </section>

      {/* YELLOW ZONE POSTS */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "1rem",
            marginBottom: "1rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid rgb(229, 231, 235)",
          }}
        >
          <h2 style={{ fontSize: "1.3rem", fontWeight: "700", color: "rgb(251, 146, 60)" }}>
            🟡 YELLOW ZONE — {yellowPosts.length} {yellowPosts.length === 1 ? "post" : "posts"}
          </h2>
          {yellowPosts.length > 0 && (
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.75rem",
                background: "rgba(251, 146, 60, 0.1)",
                borderRadius: "9999px",
                fontSize: "0.75rem",
                fontWeight: "600",
                color: "rgb(251, 146, 60)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              In Review
            </span>
          )}
        </div>

        {yellowPosts.length > 0 ? (
          <ModerationQueueClient zone="YELLOW" posts={yellowPosts} />
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              background: "rgba(251, 146, 60, 0.02)",
              borderRadius: "8px",
              border: "1px dashed rgba(251, 146, 60, 0.2)",
              color: "rgb(107, 114, 128)",
            }}
          >
            No YELLOW zone posts awaiting review.
          </div>
        )}
      </section>

      {/* SAFETY GUIDELINES */}
      <section style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgb(229, 231, 235)" }}>
        <div
          style={{
            background: "rgba(59, 130, 246, 0.05)",
            borderLeft: "4px solid rgb(59, 130, 246)",
            padding: "1.5rem",
            borderRadius: "4px",
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", color: "rgb(30, 41, 59)" }}>
            📋 Moderation Guidelines
          </h3>
          <ul
            style={{
              fontSize: "0.9rem",
              color: "rgb(75, 85, 99)",
              lineHeight: "1.6",
              paddingLeft: "1.5rem",
            }}
          >
            <li>
              <strong>RED ZONE</strong>: Posts indicating immediate danger (self-harm, suicide ideation, abuse). These should
              be escalated to clinical staff or emergency contacts within 5 minutes.
            </li>
            <li>
              <strong>YELLOW ZONE</strong>: Posts showing concerning patterns (substance use, eating disorders, severe
              depression, bullying). Require human judgment about clinical relevance before publishing.
            </li>
            <li>
              <strong>Escalate</strong>: Use if clinical staff consultation is needed. This creates an incident record.
            </li>
            <li>
              <strong>Publish</strong>: The teen&apos;s reflection will post to the Pack and peers will see it.
            </li>
            <li>
              <strong>Block</strong>: The post will not be published and the teen will be shown why.
            </li>
            <li>All decisions are logged in the audit trail for compliance and learning.</li>
          </ul>
        </div>
      </section>

      {/* BACK BUTTON */}
      <div style={{ marginTop: "2rem" }}>
        <Link
          href="/admin"
          style={{
            display: "inline-block",
            padding: "0.75rem 1.5rem",
            borderRadius: "6px",
            background: "rgb(243, 244, 246)",
            border: "1px solid rgb(209, 213, 219)",
            color: "rgb(75, 85, 99)",
            fontSize: "0.9rem",
            fontWeight: "500",
            textDecoration: "none",
            cursor: "pointer",
          }}
        >
          ← Back to Admin Dashboard
        </Link>
      </div>
    </AppShell>
  );
}

export default function ModerationQueuePage() {
  return (
    <Suspense
      fallback={
        <AppShell
          eyebrow="Admin Hub"
          navItems={[
            { label: "Dashboard", href: "/admin" },
            { label: "Moderation Queue", href: "/admin/moderation-queue" },
          ]}
        >
          <div style={{ padding: "2rem", textAlign: "center" }}>
            <p style={{ color: "rgb(107, 114, 128)" }}>Loading moderation queue...</p>
          </div>
        </AppShell>
      }
    >
      <ModerationQueueContent />
    </Suspense>
  );
}
