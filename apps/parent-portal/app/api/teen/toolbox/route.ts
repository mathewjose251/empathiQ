/**
 * GET /api/teen/toolbox
 *
 * Get the toolbox library for the teen with a curated list of
 * self-regulation tools organized by category.
 *
 * Returns: {
 *   tools: [
 *     {
 *       id: string,
 *       title: string,
 *       description: string,
 *       category: "breathing" | "grounding" | "journaling" | "movement" | "social",
 *       durationMinutes: number,
 *       difficulty: "easy" | "medium" | "hard",
 *       steps: string[]
 *     },
 *     ...
 *   ]
 * }
 *
 * Requires: Bearer token in Authorization header
 */

import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "../../../_lib/teenAuth";

type ToolCategory =
  | "breathing"
  | "grounding"
  | "journaling"
  | "movement"
  | "social";

type ToolDifficulty = "easy" | "medium" | "hard";

interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  durationMinutes: number;
  difficulty: ToolDifficulty;
  steps: string[];
}

// Hardcoded toolbox library for Phase 1
const TOOLBOX_LIBRARY: Tool[] = [
  // Breathing tools
  {
    id: "breathing-box",
    title: "Box Breathing",
    description:
      "A calming breathing technique using equal counts to slow your heart rate and reduce anxiety.",
    category: "breathing",
    durationMinutes: 3,
    difficulty: "easy",
    steps: [
      "Find a comfortable position sitting or lying down",
      "Inhale through your nose for a count of 4",
      "Hold your breath for a count of 4",
      "Exhale through your mouth for a count of 4",
      "Hold empty for a count of 4",
      "Repeat 5-10 times",
    ],
  },
  {
    id: "breathing-5finger",
    title: "5-Finger Breathing",
    description:
      "Trace your hand while breathing in and out, syncing breath with movement.",
    category: "breathing",
    durationMinutes: 2,
    difficulty: "easy",
    steps: [
      "Hold out your hand with fingers spread",
      "With your other hand, start at the base of your thumb",
      "Breathe in as you trace up the outside of your thumb",
      "Breathe out as you trace down between thumb and index finger",
      "Continue this pattern for all five fingers",
      "Repeat as many times as needed",
    ],
  },
  {
    id: "breathing-belly",
    title: "Belly Breath Reset",
    description:
      "Deep diaphragmatic breathing that activates your parasympathetic nervous system.",
    category: "breathing",
    durationMinutes: 5,
    difficulty: "easy",
    steps: [
      "Lie down or sit comfortably",
      "Place one hand on your chest and one on your belly",
      "Breathe in slowly through your nose, feeling your belly rise",
      "Your chest should move less than your belly",
      "Exhale slowly through your mouth",
      "Practice 10-15 cycles of deep belly breathing",
    ],
  },
  // Grounding tools
  {
    id: "grounding-5senses",
    title: "5-4-3-2-1 Senses",
    description:
      "Ground yourself by noticing what you can perceive with each sense.",
    category: "grounding",
    durationMinutes: 5,
    difficulty: "easy",
    steps: [
      "Notice 5 things you can see",
      "Notice 4 things you can feel or touch",
      "Notice 3 things you can hear",
      "Notice 2 things you can smell",
      "Notice 1 thing you can taste",
      "Take a moment to feel grounded in the present",
    ],
  },
  {
    id: "grounding-bodyscan",
    title: "Body Scan",
    description:
      "A mindfulness practice that helps you connect with your body and release tension.",
    category: "grounding",
    durationMinutes: 10,
    difficulty: "medium",
    steps: [
      "Lie down comfortably in a quiet space",
      "Starting at your toes, notice any sensations without judgment",
      "Slowly move your attention up through your feet, legs, and torso",
      "Notice your arms, hands, shoulders, neck, and head",
      "If you find tension, breathe into that area",
      "End by noticing your whole body as one connected system",
    ],
  },
  {
    id: "grounding-coldwater",
    title: "Cold Water Reset",
    description:
      "Use the shock of cold water to interrupt anxiety or overwhelm quickly.",
    category: "grounding",
    durationMinutes: 1,
    difficulty: "easy",
    steps: [
      "Get cold water (from a tap, shower, or ice)",
      "Splash cold water on your face or hands",
      "Or hold an ice cube in your hand",
      "Feel the sensation and take 3 deep breaths",
      "Notice how your nervous system resets",
    ],
  },
  // Journaling tools
  {
    id: "journaling-gratitude",
    title: "Gratitude List",
    description:
      "Write down things you're grateful for, no matter how small, to shift your mindset.",
    category: "journaling",
    durationMinutes: 5,
    difficulty: "easy",
    steps: [
      "Get a notebook or open a notes app",
      "Write 'What I'm grateful for today:'",
      "List 5-10 things, from big to small",
      "Be specific about why you're grateful",
      "Read your list when you need a mood boost",
    ],
  },
  {
    id: "journaling-worrydump",
    title: "Worry Dump",
    description:
      "Write out all your worries without filter to get them out of your head and onto paper.",
    category: "journaling",
    durationMinutes: 10,
    difficulty: "easy",
    steps: [
      "Grab paper and pen or open a notes app",
      "Set a timer for 10 minutes",
      "Write everything worrying you without stopping",
      "Don't worry about grammar or organization",
      "When time's up, you can review, burn (safely), or delete",
    ],
  },
  {
    id: "journaling-futureself",
    title: "Letter to Future Self",
    description:
      "Write advice, encouragement, or a reminder to your future self during tough times.",
    category: "journaling",
    durationMinutes: 10,
    difficulty: "medium",
    steps: [
      "Write 'Dear [Your name],'",
      "Write encouragement about getting through this difficult time",
      "Include reminders of your strengths",
      "Add specific advice for your future self",
      "Read it whenever you're struggling again",
    ],
  },
  // Movement tools
  {
    id: "movement-shakeitout",
    title: "Shake It Out",
    description:
      "Use your body to release pent-up energy and emotion through shaking.",
    category: "movement",
    durationMinutes: 3,
    difficulty: "easy",
    steps: [
      "Stand with feet shoulder-width apart",
      "Start shaking your hands and arms gently",
      "Gradually increase the intensity",
      "Let your whole body shake and move freely",
      "Shake for 1-3 minutes until you feel the energy shift",
      "End with three deep breaths",
    ],
  },
  {
    id: "movement-walkandtalk",
    title: "Walk and Talk",
    description:
      "Combine gentle movement with talking to process thoughts and regulate emotions.",
    category: "movement",
    durationMinutes: 15,
    difficulty: "easy",
    steps: [
      "Take yourself on a walk, indoors or outside",
      "Talk to yourself, a friend, or a voice memo about what's bothering you",
      "Focus on describing your feelings rather than judging them",
      "Notice how movement helps clarify your thinking",
      "Continue for 10-20 minutes",
    ],
  },
  {
    id: "movement-stretchbreathe",
    title: "Stretch and Breathe",
    description:
      "Combine gentle stretching with breathing to release tension and calm your mind.",
    category: "movement",
    durationMinutes: 8,
    difficulty: "easy",
    steps: [
      "Start standing or sitting comfortably",
      "Reach your arms overhead and take a deep breath in",
      "Exhale and fold forward gently",
      "Stretch to each side, holding for 3-5 breaths",
      "Rotate your shoulders and roll your neck gently",
      "End with arms at your sides, breathing deeply",
    ],
  },
  // Social tools
  {
    id: "social-textfriend",
    title: "Text a Friend",
    description:
      "Reach out to someone you trust for connection and support when struggling.",
    category: "social",
    durationMinutes: 5,
    difficulty: "easy",
    steps: [
      "Think of a friend or trusted person",
      "Send them a message—it can be simple",
      "Share what you're feeling or ask how they're doing",
      "Be open to their response",
      "Feel the connection even through a small message",
    ],
  },
  {
    id: "social-complimentchallenge",
    title: "Compliment Challenge",
    description:
      "Give genuine compliments to people around you to boost their mood and yours.",
    category: "social",
    durationMinutes: 10,
    difficulty: "easy",
    steps: [
      "Challenge yourself to give 3-5 genuine compliments today",
      "Make them specific and sincere",
      "Notice how good it feels to lift someone else up",
      "Pay attention to their reactions",
      "Reflect on how this affected your own mood",
    ],
  },
  {
    id: "social-helpsomeone",
    title: "Help Someone",
    description:
      "Do something kind for another person to shift perspective and feel connected.",
    category: "social",
    durationMinutes: 15,
    difficulty: "medium",
    steps: [
      "Identify someone who could use help",
      "Think of something small and doable you could do for them",
      "Reach out and offer your help",
      "Follow through with what you promised",
      "Notice how helping others shifts your own emotional state",
    ],
  },
];

export async function GET(request: NextRequest) {
  try {
    // Validate auth
    const authHeader = request.headers.get("Authorization");
    getAuthContext(authHeader);

    // Return the hardcoded toolbox library
    return NextResponse.json({
      status: "success",
      data: {
        tools: TOOLBOX_LIBRARY,
      },
    });
  } catch (error) {
    console.error("[GET /api/teen/toolbox]", error);
    return NextResponse.json(
      {
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch toolbox library",
      },
      {
        status:
          error instanceof Error && error.message.includes("Missing")
            ? 401
            : 500,
      }
    );
  }
}
