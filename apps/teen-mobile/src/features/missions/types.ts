export type ThinkingTrapCode =
  | "ACCURATE_THINKING"
  | "CATASTROPHIZING"
  | "ALL_OR_NOTHING"
  | "MIND_READING";

export interface MissionDecision {
  id: string;
  label: string;
  thinkingTrapId: ThinkingTrapCode;
  consequence: string;
}

export interface MissionStory {
  id: string;
  title: string;
  chapterLabel: string;
  prompt: string;
  atmosphere: string;
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
