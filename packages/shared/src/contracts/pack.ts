export type PackReactionKind = "I_RELATE" | "I_TRIED_THIS" | "THIS_HELPED";

export type PackModerationStatus =
  | "CLEARED"
  | "QUEUED"
  | "BLOCKED"
  | "ESCALATED";

export type PackSafetyFlagType =
  | "SELF_HARM"
  | "SUICIDE_RISK"
  | "ABUSE_OR_NEGLECT"
  | "IDENTITY_LEAK"
  | "DOXXING"
  | "SUBSTANCE_USE"
  | "VIOLENCE_RISK";

export type PackReportReason =
  | "IDENTITY_OR_PRIVACY"
  | "BULLYING_OR_HARM"
  | "SELF_HARM_CONCERN"
  | "SUBSTANCE_RISK"
  | "OTHER";

export interface PackReactionCount {
  kind: PackReactionKind;
  count: number;
}

export interface PackFeedPost {
  id: string;
  alias: string;
  mood: string;
  body: string;
  branchLabel: string;
  thinkingTrapTag: string;
  createdLabel: string;
  moderationStatus: PackModerationStatus;
  reactions: PackReactionCount[];
  isOwnPost?: boolean;
  reportCount?: number;
}

export interface PackFeedPayload {
  packId: string;
  packName: string;
  privacyNotice: string;
  consentNotice: string;
  postingRules: string[];
  availableReactions: PackReactionKind[];
  reportReasons: PackReportReason[];
  consentAcknowledged: boolean;
  postingEnabled: boolean;
  posts: PackFeedPost[];
}

export interface CreatePackPostInput {
  missionId: string;
  branchLabel: string;
  thinkingTrapTag: string;
  mood: string;
  body: string;
}

export interface CreatePackPostResult {
  moderationStatus: PackModerationStatus;
  safetyFlags: PackSafetyFlagType[];
  message: string;
  post?: PackFeedPost;
}

export interface UpdatePackConsentInput {
  acknowledged: boolean;
}

export interface UpdatePackConsentResult {
  success: boolean;
  consentAcknowledged: boolean;
  postingEnabled: boolean;
  message: string;
}

export interface ReportPackPostInput {
  postId: string;
  reason: PackReportReason;
  notes?: string;
}

export interface ReportPackPostResult {
  success: boolean;
  postId: string;
  moderationStatus: PackModerationStatus;
  message: string;
}

export interface HidePackAliasInput {
  alias: string;
}

export interface HidePackAliasResult {
  success: boolean;
  alias: string;
  message: string;
}

export interface DeletePackPostResult {
  success: boolean;
  postId: string;
  message: string;
}

export interface ParentPackThemeCard {
  label: string;
  insight: string;
  direction: "Rising" | "Steady" | "Softening";
}

export interface ParentPackDigestPayload {
  packId: string;
  packName: string;
  privacyBoundaryNotice: string;
  themeCards: ParentPackThemeCard[];
  recentSignals: string[];
  staffNote: string;
}

export interface MentorThemeCount {
  label: string;
  count: number;
}

export interface MentorModerationCount {
  label: PackModerationStatus;
  count: number;
}

export interface MentorFlaggedPost {
  id: string;
  createdLabel: string;
  thinkingTrapTag: string;
  safetyFlags: PackSafetyFlagType[];
  moderationStatus: PackModerationStatus;
  redactedExcerpt: string;
  reportCount: number;
}

export interface MentorPackViewPayload {
  packId: string;
  packName: string;
  redactionNotice: string;
  themeCounts: MentorThemeCount[];
  moderationCounts: MentorModerationCount[];
  flaggedPosts: MentorFlaggedPost[];
  coachActions: string[];
}

export interface ModerationQueueItem {
  id: string;
  createdLabel: string;
  thinkingTrapTag: string;
  safetyFlags: PackSafetyFlagType[];
  moderationStatus: PackModerationStatus;
  redactedExcerpt: string;
  reportCount: number;
}

export interface ModerationQueuePayload {
  packId: string;
  items: ModerationQueueItem[];
}

export interface AdminPackConsolePayload {
  packId: string;
  queue: ModerationQueueItem[];
  auditNotice: string;
  identityAccessPolicy: string[];
}

export interface UpdateModerationDecisionInput {
  postId: string;
  decision: "PUBLISH" | "KEEP_BLOCKED" | "ESCALATE_TO_ADMIN";
  notes?: string;
}

export interface UpdateModerationDecisionResult {
  success: boolean;
  postId: string;
  moderationStatus: PackModerationStatus;
}
