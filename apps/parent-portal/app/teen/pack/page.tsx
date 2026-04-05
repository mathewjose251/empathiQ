"use client";

import Link from "next/link";
import { useTeen } from "../_context/TeenContext";

const PACK_POSTS = [
  {
    id: 1,
    alias: "Quiet Orbit",
    text: "I realized I was stuck in a comparing loop today. Everyone's highlights feel so perfect, but that's not real life. I switched my phone to grayscale for an hour—helped me see what was actually mine.",
    hearts: 24,
    relates: 18,
  },
  {
    id: 2,
    alias: "Soft Thunder",
    text: "My thinking trap was 'I have to be perfect or I'm a failure.' Taking the mission about it helped me see there's a whole spectrum. Good enough is actually... enough.",
    hearts: 31,
    relates: 27,
  },
  {
    id: 3,
    alias: "Calm Static",
    text: "Tried the breathing tool when my anxiety spiked before class. Just 5 minutes. It actually worked—my nervous system was like 'oh okay, we're safe.' Game changer.",
    hearts: 42,
    relates: 35,
  },
  {
    id: 4,
    alias: "Neon Fern",
    text: "Started noticing how often I catastrophize. Like, my friend didn't text back and suddenly I was already in a whole story about them hating me. Now I catch it faster.",
    hearts: 19,
    relates: 22,
  },
  {
    id: 5,
    alias: "Midnight Sage",
    text: "The 'worry dump' was exactly what I needed. Just let it all out on paper without fixing it. Felt lighter after. Sometimes your brain just needs to be heard, you know?",
    hearts: 28,
    relates: 31,
  },
];

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

  return (
    <div className="teen-page teen-fade-in">
      {/* Header */}
      <div className="teen-text-center teen-mb-16">
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }} className="teen-mb-4">Your Pack 🏕️</h1>
        <p className="teen-text-muted teen-text-small">
          Anonymous reflections from peers just like you
        </p>
      </div>

      {/* Pack Posts */}
      <div className="teen-mb-16">
        {PACK_POSTS.map((post, idx) => (
          <div key={post.id} className="pack-post teen-fade-in" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="pack-alias">{post.alias}</div>
            <div className="pack-text">{post.text}</div>
            <div className="pack-reactions">
              <button className="reaction-btn">❤️ {post.hearts}</button>
              <button className="reaction-btn">🤝 {post.relates}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pack Mood Cloud */}
      <div className="teen-card teen-mb-16">
        <h2 style={{ fontWeight: 600 }} className="teen-mb-8">Pack Mood Cloud ☁️</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center", alignItems: "center" }}>
          {MOOD_EMOJIS.map((item, idx) => (
            <span
              key={idx}
              style={{ fontSize: item.size === "text-xl" ? "1.5rem" : item.size === "text-lg" ? "1.25rem" : item.size === "text-sm" ? "0.9rem" : "1rem", opacity: 0.6 + Math.random() * 0.4 }}
              title={item.label}
            >
              {item.emoji}
            </span>
          ))}
        </div>
      </div>

      {/* CTA Card */}
      <div className="teen-card" style={{ borderStyle: "dashed", borderWidth: "2px" }}>
        <h3 style={{ fontWeight: 600 }} className="teen-text-center teen-mb-8">
          Complete today's story to share with your pack
        </h3>
        <Link href="/teen">
          <button className="teen-btn teen-btn-accent">Start Your Story</button>
        </Link>
      </div>

      {/* Social Proof */}
      <div className="social-proof teen-mt-16">
        {teen.storiesCompleted > 0
          ? `You've contributed ${teen.storiesCompleted} story reflection${teen.storiesCompleted !== 1 ? "s" : ""} to the pack`
          : "Join your peers in sharing reflections"}
      </div>
    </div>
  );
}
