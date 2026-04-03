export type ThinkingTrapCode =
  | "ACCURATE_THINKING"
  | "CATASTROPHIZING"
  | "ALL_OR_NOTHING"
  | "MIND_READING"
  | "OVERGENERALIZATION"
  | "LABELING"
  | "EMOTIONAL_REASONING"
  | "SHOULD_STATEMENTS";

export interface MissionDecision {
  id: string;
  label: string;
  thinkingTrapId: ThinkingTrapCode;
  consequence: string;
}

export interface MissionStory {
  id: string;
  slug: string;
  title: string;
  chapterLabel: string;
  prompt: string;
  atmosphere: string;
  estimatedMinutes?: number;
  decisions: [MissionDecision, MissionDecision];
}

export interface MissionChoiceSubmission {
  missionId: string;
  decisionId: string;
  thinkingTrapId: ThinkingTrapCode;
}

export interface ReflectionSubmission {
  missionAttemptId: string;
  body: string;
}
