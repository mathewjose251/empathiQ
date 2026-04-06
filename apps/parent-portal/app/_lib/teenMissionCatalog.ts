import {
  getAllPhase1Missions,
  getMissionBySlug,
  type MissionTemplate,
  type ThinkingTrapCode,
} from "@empathiq/shared/missions/missionFactory";

export const TEEN_THEME_LABELS: Record<MissionTemplate["theme"], string> = {
  school: "School",
  family: "Family",
  peer: "Peer",
  digital: "Digital",
  self: "Self",
};

export const THINKING_TRAP_LABELS: Record<ThinkingTrapCode, string> = {
  ACCURATE_THINKING: "Accurate Thinking",
  CATASTROPHIZING: "Catastrophizing",
  ALL_OR_NOTHING: "All-or-Nothing Thinking",
  MIND_READING: "Mind Reading",
  OVERGENERALIZATION: "Overgeneralization",
  LABELING: "Labeling",
  EMOTIONAL_REASONING: "Emotional Reasoning",
  SHOULD_STATEMENTS: "Should Statements",
};

export const THINKING_TRAP_EXPLANATIONS: Record<ThinkingTrapCode, string> = {
  ACCURATE_THINKING:
    "A steadier read of the moment. It makes room for facts, uncertainty, and middle-ground choices.",
  CATASTROPHIZING:
    "Jumping straight to the worst possible outcome and treating that fear like it is already happening.",
  ALL_OR_NOTHING:
    "Seeing only extremes. If something is not perfect, your mind labels it as total failure.",
  MIND_READING:
    "Assuming you know what other people think, usually in the harshest possible direction, without checking.",
  OVERGENERALIZATION:
    "Taking one bad moment and stretching it into a rule about your whole future, identity, or life.",
  LABELING:
    "Turning a mistake or painful moment into a verdict about who you are as a person.",
  EMOTIONAL_REASONING:
    "Believing that because something feels true, it must be true, even when the evidence is incomplete.",
  SHOULD_STATEMENTS:
    "Rigid rules about how life, family, school, or you should work, which creates pressure and shame when reality differs.",
};

export interface TeenStoryCard {
  slug: string;
  title: string;
  theme: MissionTemplate["theme"];
  themeLabel: string;
  shortDesc: string;
  minutes: number;
  xpReward: number;
}

export interface TeenMissionDetail {
  slug: string;
  title: string;
  chapterLabel: string;
  theme: string;
  narrative: string;
  sensoryPrompt: string;
  estimatedMinutes: number;
  pathA: {
    label: string;
    consequence: string;
    thinkingTrapCode: ThinkingTrapCode;
    thinkingTrapLabel: string;
    xpReward: number;
  };
  pathB: {
    label: string;
    consequence: string;
    thinkingTrapCode: ThinkingTrapCode;
    thinkingTrapLabel: string;
    xpReward: number;
  };
}

function cardDescription(text: string) {
  const cleaned = text.replace(/\s+/g, " ").trim();
  return cleaned.length > 110 ? `${cleaned.slice(0, 107)}...` : cleaned;
}

export function getTeenStoryCards(): TeenStoryCard[] {
  return getAllPhase1Missions().map((mission) => ({
    slug: mission.slug,
    title: mission.title,
    theme: mission.theme,
    themeLabel: TEEN_THEME_LABELS[mission.theme],
    shortDesc: cardDescription(mission.narrativeIntro),
    minutes: mission.estimatedMinutes,
    xpReward: 30,
  }));
}

export function getTeenMissionDetail(slug: string): TeenMissionDetail | null {
  const mission = getMissionBySlug(slug);

  if (!mission) {
    return null;
  }

  const [pathA, pathB] = mission.decisions;

  return {
    slug: mission.slug,
    title: mission.title,
    chapterLabel: mission.chapterLabel,
    theme: TEEN_THEME_LABELS[mission.theme],
    narrative: mission.narrativeIntro,
    sensoryPrompt: mission.sensoryPrompt,
    estimatedMinutes: mission.estimatedMinutes,
    pathA: {
      label: pathA.label,
      consequence: pathA.narrativeOutcome,
      thinkingTrapCode: pathA.thinkingTrapId,
      thinkingTrapLabel: THINKING_TRAP_LABELS[pathA.thinkingTrapId],
      xpReward: pathA.thinkingTrapId === "ACCURATE_THINKING" ? 30 : 15,
    },
    pathB: {
      label: pathB.label,
      consequence: pathB.narrativeOutcome,
      thinkingTrapCode: pathB.thinkingTrapId,
      thinkingTrapLabel: THINKING_TRAP_LABELS[pathB.thinkingTrapId],
      xpReward: pathB.thinkingTrapId === "ACCURATE_THINKING" ? 30 : 15,
    },
  };
}
