export type ThinkingTrapId =
  | "ACCURATE_THINKING"
  | "CATASTROPHIZING"
  | "ALL_OR_NOTHING"
  | "MIND_READING"
  | "OVERGENERALIZATION"
  | "LABELING"
  | "EMOTIONAL_REASONING"
  | "SHOULD_STATEMENTS";

export interface TrapDefinition {
  label: string;
  parentFriendlySummary: string;
  sidewaysInvitation: string;
}

export const trapDefinitions: Record<ThinkingTrapId, TrapDefinition> = {
  ACCURATE_THINKING: {
    label: "Accurate Thinking",
    parentFriendlySummary:
      "Your child is showing moments of balanced thinking and is starting to notice more realistic options.",
    sidewaysInvitation:
      "Invite them to help plan one small family decision so they can practice flexible problem-solving in real life.",
  },
  CATASTROPHIZING: {
    label: "Catastrophizing",
    parentFriendlySummary:
      "Your child may be jumping quickly to worst-case outcomes when stress rises.",
    sidewaysInvitation:
      "Take a short walk together and casually swap three possible outcomes to a current stressor: worst case, best case, and most likely.",
  },
  ALL_OR_NOTHING: {
    label: "All-or-Nothing Thinking",
    parentFriendlySummary:
      "Your child is struggling with seeing middle-ground solutions and may treat situations as total success or total failure.",
    sidewaysInvitation:
      "During dinner, ask everyone to rate their day on a scale from 1 to 10 and share one thing that made it not a 1 or a 10.",
  },
  MIND_READING: {
    label: "Mind Reading",
    parentFriendlySummary:
      "Your child may be assuming they know what other people think of them without enough evidence.",
    sidewaysInvitation:
      "Watch a scene from a show together and compare what each person guessed characters were thinking versus what was actually said.",
  },
  OVERGENERALIZATION: {
    label: "Overgeneralization",
    parentFriendlySummary:
      "Your child may be using one hard moment as proof that the same thing will always happen.",
    sidewaysInvitation:
      "Share a time when one bad day did not predict the next one, and invite them to name an exception from their own week.",
  },
  LABELING: {
    label: "Labeling",
    parentFriendlySummary:
      "Your child may be turning mistakes into harsh identity statements about themselves.",
    sidewaysInvitation:
      "Do a small task together and model describing mistakes as moments or behaviors, not permanent character traits.",
  },
  EMOTIONAL_REASONING: {
    label: "Emotional Reasoning",
    parentFriendlySummary:
      "Your child may be treating intense feelings as proof that a fear or belief is fully true.",
    sidewaysInvitation:
      "Try a low-pressure grounding activity together and talk about how feelings can be real without being the whole story.",
  },
  SHOULD_STATEMENTS: {
    label: "Should Statements",
    parentFriendlySummary:
      "Your child may be placing rigid expectations on themselves or others, which can increase frustration and shame.",
    sidewaysInvitation:
      "Pick one family routine and rephrase a 'should' into a more flexible 'could' or 'prefer to' statement together.",
  },
};
