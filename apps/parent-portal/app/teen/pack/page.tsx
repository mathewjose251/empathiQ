"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { PackFeedPayload, PackFeedPost } from "@empathiq/shared/contracts/pack";
import { useTeen } from "../_context/TeenContext";

const MOOD_EMOJIS = [
  { emoji: "😌", size: "text-lg", label: "calm" },
  { emoji: "🌙", size: "text-xl", label: "peaceful" },
  { emoji: "✨", size: "text-sm", label: "hopeful" },
  { emoji: "💭", size: "text-xl", label: "thoughtful" },
  { emoji: "🌊", size: "text-lg", label: "flowing" },
  { emoji: "🔮", size: "text-base", label: "curious" },
  { emoji: "🌿", size: "text-lg", label: "grounded" },
  { emoji: "⚡", size: "text-sm", label: "energized" },
  { emoji: "🫶", size: "text-xl", label: "connected" },
  { emoji: "🌸", size: "text-base", label: "growing" },
];

export default function PackPage() {
  const teen = useTeen();
  const [feed, setFeed] = useState<PackFeedPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFeed() {
      try {
        const response = await fetch("/api/pack/feed");
        const payload = (await response.json()) as PackFeedPayload | { error?: string };

        if (!response.ok) {
          throw new Error("error" in payload ? payload.error : "Unable to load Pack feed.");
        }

        if (isMounted) {
          setFeed(payload as PackFeedPayload);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load Pack feed.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadFeed();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="teen-page teen-fade-in">
      <div className="teen-text-center teen-mb-16">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }} className="teen-mb-4">
          Your Pack 🏕️
        </h1>
        <p className="teen-text-muted teen-text-small">
          Anonymous reflections from peers, routed through privacy rules and safety moderation.
        </p>
      </div>

      {feed ? (
        <div className="teen-card teen-mb-16" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div className="pack-alias" style={{ marginBottom: 8 }}>{feed.packName}</div>
          <div className="teen-text-small teen-text-muted">{feed.privacyNotice}</div>
        </div>
      ) : null}

      <div className="teen-mb-16">
        {loading ? (
          <div className="teen-card teen-text-center teen-text-muted">Loading your Pack...</div>
        ) : error ? (
          <div className="teen-card teen-text-center" style={{ color: "var(--teen-rose)" }}>
            {error}
          </div>
        ) : feed && feed.posts.length > 0 ? (
          feed.posts.map((post, idx) => <PackPostCard key={post.id} post={post} index={idx} />)
        ) : (
          <div className="teen-card teen-text-center teen-text-muted">
            No Pack reflections yet. Finish a story to be the first to share.
          </div>
        )}
      </div>

      <div className="teen-card teen-mb-16">
        <h2 style={{ fontWeight: 600 }} className="teen-mb-8">Pack Mood Cloud ☁️</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {MOOD_EMOJIS.map((item, idx) => (
            <span
              key={idx}
              style={{
                fontSize:
                  item.size === "text-xl"
                    ? "1.5rem"
                    : item.size === "text-lg"
                      ? "1.25rem"
                      : item.size === "text-sm"
                      ? "0.9rem"
                        : "1rem",
                opacity: 0.62 + (idx % 4) * 0.08,
              }}
              title={item.label}
            >
              {item.emoji}
            </span>
          ))}
        </div>
      </div>

      <div className="teen-card" style={{ borderStyle: "dashed", borderWidth: "2px" }}>
        <h3 style={{ fontWeight: 600 }} className="teen-text-center teen-mb-8">
          Complete today&apos;s story to share with your pack
        </h3>
        <Link href="/teen">
          <button className="teen-btn teen-btn-accent">Start Your Story</button>
        </Link>
      </div>

      <div className="social-proof teen-mt-16">
        {teen.storiesCompleted > 0
          ? `You've completed ${teen.storiesCompleted} story reflection${teen.storiesCompleted !== 1 ? "s" : ""} so far`
          : "Join your peers in sharing reflections"}
      </div>
    </div>
  );
}

function PackPostCard({ index, post }: { index: number; post: PackFeedPost }) {
  return (
    <div className="pack-post teen-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="pack-alias">
        {post.alias}
        {post.isOwnPost ? " · You" : ""}
      </div>
      <div className="pack-text">{post.body}</div>
      <div className="teen-text-small teen-text-muted" style={{ marginTop: 8 }}>
        {post.branchLabel} · {post.thinkingTrapTag.replaceAll("_", " ")} · {post.createdLabel}
      </div>
      <div className="pack-reactions">
        {post.reactions.length > 0 ? (
          post.reactions.map((reaction) => (
            <button className="reaction-btn" key={reaction.kind}>
              {reaction.kind === "I_RELATE"
                ? "🤝"
                : reaction.kind === "I_TRIED_THIS"
                  ? "🛠️"
                  : "💡"}{" "}
              {reaction.count}
            </button>
          ))
        ) : (
          <span className="teen-text-small teen-text-muted">No reactions yet</span>
        )}
      </div>
    </div>
  );
}
