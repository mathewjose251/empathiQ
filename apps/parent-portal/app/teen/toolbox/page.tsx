"use client";

import { useState } from "react";
import Link from "next/link";
import { useTeen } from "../_context/TeenContext";

interface Tool {
  id: string;
  name: string;
  icon: string;
  category: "breathing" | "grounding" | "journaling" | "movement" | "social";
  steps: string[];
}

const TOOLBOX: Tool[] = [
  // Breathing
  {
    id: "box-breathing",
    name: "Box Breathing",
    icon: "📦",
    category: "breathing",
    steps: [
      "Find a quiet spot and sit comfortably",
      "Breathe in slowly for 4 counts",
      "Hold for 4 counts",
      "Breathe out for 4 counts",
      "Hold for 4 counts",
      "Repeat 5-10 times",
    ],
  },
  {
    id: "5-finger-breathing",
    name: "5-Finger Breathing",
    icon: "🫴",
    category: "breathing",
    steps: [
      "Hold up your hand with fingers spread",
      "Use your other hand's finger to trace up your thumb while breathing in",
      "Trace down while breathing out",
      "Move to next finger and repeat",
      "Continue through all 5 fingers",
      "Notice how you feel",
    ],
  },
  {
    id: "belly-breath",
    name: "Belly Breathing",
    icon: "🫁",
    category: "breathing",
    steps: [
      "Lie down or sit with back supported",
      "Place one hand on chest, one on belly",
      "Breathe so your belly expands (not your chest)",
      "Slow, deep breaths: in for 4, out for 6",
      "Focus on the belly rising and falling",
      "Do this for 2-3 minutes",
    ],
  },

  // Grounding
  {
    id: "5-4-3-2-1",
    name: "5-4-3-2-1 Senses",
    icon: "👀",
    category: "grounding",
    steps: [
      "Name 5 things you can see around you",
      "Name 4 things you can touch or feel",
      "Name 3 things you can hear",
      "Name 2 things you can smell (or like to smell)",
      "Name 1 thing you can taste",
      "Pause and notice you're present",
    ],
  },
  {
    id: "body-scan",
    name: "Body Scan",
    icon: "🧘",
    category: "grounding",
    steps: [
      "Lie down or sit comfortably",
      "Starting at your head, notice any sensations",
      "Slowly move attention down through your body",
      "Neck, shoulders, arms, hands, chest, belly",
      "Legs, feet—don't try to change anything",
      "Just observe what's there",
    ],
  },
  {
    id: "cold-water-reset",
    name: "Cold Water Reset",
    icon: "❄️",
    category: "grounding",
    steps: [
      "Go to a sink or have a bowl of cold water",
      "Splash your face or dip your hands in cold water",
      "Feel the shock—it interrupts anxiety",
      "Take a few deep breaths",
      "Notice your nervous system shifting",
      "This activates your 'calm response'",
    ],
  },

  // Journaling
  {
    id: "gratitude-list",
    name: "Gratitude List",
    icon: "📝",
    category: "journaling",
    steps: [
      "Grab paper or open a notes app",
      "Write 5 things you're grateful for today",
      "Include big things and small (coffee counts!)",
      "Write a sentence about why each matters",
      "Read them back slowly",
      "Notice the shift in your nervous system",
    ],
  },
  {
    id: "worry-dump",
    name: "Worry Dump",
    icon: "🗑️",
    category: "journaling",
    steps: [
      "Get a notebook or paper",
      "Set a timer for 10 minutes",
      "Write all your worries, fast, no filter",
      "Don't organize or fix—just dump",
      "When timer ends, take 3 deep breaths",
      "Optional: fold it up or throw it away",
    ],
  },
  {
    id: "letter-future-self",
    name: "Letter to Future Self",
    icon: "💌",
    category: "journaling",
    steps: [
      "Write a letter to yourself 1 month from now",
      "Share what you're struggling with today",
      "Remind future-you of your strengths",
      "Include one small goal to work toward",
      "Seal it (literally or figuratively)",
      "Read it again when you need perspective",
    ],
  },

  // Movement
  {
    id: "shake-it-out",
    name: "Shake It Out",
    icon: "🎸",
    category: "movement",
    steps: [
      "Stand in a safe space where you can move",
      "Start shaking your hands loosely",
      "Move to your arms, shoulders, whole body",
      "Shake for 1-2 minutes with energy",
      "Let out sounds if it feels right",
      "Notice the release in your body",
    ],
  },
  {
    id: "walk-and-talk",
    name: "Walk and Talk",
    icon: "🚶",
    category: "movement",
    steps: [
      "Get up and go for a walk—inside or out",
      "As you walk, say your feelings out loud",
      "Or call a friend and walk while talking",
      "Let your body move—it helps process",
      "Notice trees, sky, sensations",
      "Keep going for at least 10 minutes",
    ],
  },
  {
    id: "stretch-breathe",
    name: "Stretch and Breathe",
    icon: "🤸",
    category: "movement",
    steps: [
      "Stand and reach your arms overhead",
      "Breathe in deeply as you stretch",
      "Gently touch your toes, breathe out",
      "Rotate your shoulders slowly",
      "Neck rolls, side stretches",
      "Finish with a full body shake",
    ],
  },

  // Social
  {
    id: "text-friend",
    name: "Text a Friend",
    icon: "💬",
    category: "social",
    steps: [
      "Think of someone who makes you feel safe",
      "Send them a message—doesn't have to be deep",
      "Share how you're feeling or ask how they are",
      "Connection doesn't require big words",
      "Just reach out, even if it's small",
      "Being seen by someone helps",
    ],
  },
  {
    id: "compliment-challenge",
    name: "Compliment Challenge",
    icon: "⭐",
    category: "social",
    steps: [
      "Compliment 3 people today—different people",
      "Make them specific and genuine",
      "Notice how giving praise feels",
      "Notice how people light up",
      "Connection helps both directions",
      "End the day reflecting on their responses",
    ],
  },
  {
    id: "help-someone",
    name: "Help Someone",
    icon: "🤝",
    category: "social",
    steps: [
      "Look around for someone who needs help",
      "Big gesture or small—both count",
      "Carry something, listen, share a snack",
      "Notice how it feels to be useful",
      "Purpose and connection happen together",
      "You're part of a bigger world",
    ],
  },
];

const CATEGORIES = [
  { key: "breathing", label: "Breathing", emoji: "🫁" },
  { key: "grounding", label: "Grounding", emoji: "🌍" },
  { key: "journaling", label: "Journaling", emoji: "📔" },
  { key: "movement", label: "Movement", emoji: "💃" },
  { key: "social", label: "Social", emoji: "🫂" },
] as const;

export default function ToolboxPage() {
  const teen = useTeen();
  const [expandedToolId, setExpandedToolId] = useState<string | null>(null);

  const handleToolClick = (toolId: string) => {
    setExpandedToolId(expandedToolId === toolId ? null : toolId);
    if (expandedToolId !== toolId) {
      teen.addXP(5, "tool");
    }
  };

  return (
    <div className="teen-page teen-fade-in">
      {/* Emergency Button */}
      <div className="teen-card teen-mb-16" style={{ borderColor: "var(--teen-rose)", borderWidth: "2px" }}>
        <Link href="/teen/safety">
          <button className="teen-btn teen-btn-rose">🆘 I Need Help Now</button>
        </Link>
      </div>

      {/* Categories and Tools */}
      {CATEGORIES.map((category) => {
        const categoryTools = TOOLBOX.filter((t) => t.category === category.key);
        return (
          <div key={category.key} className="teen-mb-16">
            <h2 style={{ fontSize: "1.125rem", fontWeight: 700 }} className="teen-text-accent teen-mb-8">
              {category.emoji} {category.label}
            </h2>

            <div className="tool-grid">
              {categoryTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  className="tool-item"
                  style={{
                    borderColor: expandedToolId === tool.id ? "var(--teen-accent)" : undefined,
                    background: expandedToolId === tool.id ? "rgba(6, 182, 212, 0.1)" : undefined,
                  }}
                >
                  <div className="tool-icon">{tool.icon}</div>
                  <div className="teen-text-small">{tool.name}</div>
                </button>
              ))}
            </div>

            {/* Expanded Tool Steps */}
            {expandedToolId &&
              TOOLBOX.find((t) => t.id === expandedToolId)?.category === category.key && (
                <div className="teen-card teen-mt-8 teen-fade-in">
                  <h3 style={{ fontWeight: 600 }} className="teen-mb-8">
                    {TOOLBOX.find((t) => t.id === expandedToolId)?.icon}{" "}
                    {TOOLBOX.find((t) => t.id === expandedToolId)?.name}
                  </h3>
                  <ol style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                    {TOOLBOX.find((t) => t.id === expandedToolId)?.steps.map((step, idx) => (
                      <li key={idx} className="teen-text-small">
                        <span className="teen-text-accent" style={{ fontWeight: 600 }}>{idx + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                  <div className="teen-mt-8 social-proof">
                    <span className="teen-text-accent">+5 XP earned!</span>
                  </div>
                </div>
              )}
          </div>
        );
      })}

      {/* Footer */}
      <div className="social-proof teen-mt-16">
        <p className="teen-text-small">
          💡 Tools work best when you actually use them. Pick one and try it now.
        </p>
      </div>
    </div>
  );
}
