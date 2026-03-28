import type {
  AdminPackConsolePayload,
  CreatePackPostInput,
  CreatePackPostResult,
  DeletePackPostResult,
  HidePackAliasInput,
  HidePackAliasResult,
  MentorFlaggedPost,
  MentorPackViewPayload,
  ModerationQueueItem,
  ModerationQueuePayload,
  PackFeedPayload,
  PackFeedPost,
  PackModerationStatus,
  PackReactionKind,
  PackReportReason,
  PackSafetyFlagType,
  ParentPackDigestPayload,
  ReportPackPostInput,
  ReportPackPostResult,
  UpdatePackConsentInput,
  UpdatePackConsentResult,
  UpdateModerationDecisionInput,
  UpdateModerationDecisionResult,
} from "@empathiq/shared/contracts/pack";

const PACK_ID = "pack-lantern-07";
const PACK_NAME = "Pack Lantern 07";
const CURRENT_ALIAS = "Quiet Orbit";

const availableReactions: PackReactionKind[] = [
  "I_RELATE",
  "I_TRIED_THIS",
  "THIS_HELPED",
];

const reportReasons: PackReportReason[] = [
  "IDENTITY_OR_PRIVACY",
  "BULLYING_OR_HARM",
  "SELF_HARM_CONCERN",
  "SUBSTANCE_RISK",
  "OTHER",
];

const postingRules = [
  "No real names, schools, phone numbers, or social handles.",
  "Share what the moment felt like, not who caused it.",
  "If a post suggests immediate danger, it goes to human review instead of the Pack.",
];

interface InternalPackPost extends PackFeedPost {
  safetyFlags: PackSafetyFlagType[];
  reportCount: number;
}

let consentAcknowledged = false;
let hiddenAliases = new Set<string>();

let packPosts: InternalPackPost[] = [
  {
    id: "post-1",
    alias: "North Star",
    mood: "Steadying",
    body: "I noticed my chest calm down when I named the most likely outcome instead of the worst one.",
    branchLabel: "Grounded path",
    thinkingTrapTag: "ACCURATE_THINKING",
    createdLabel: "Today evening",
    moderationStatus: "CLEARED",
    reactions: [
      { kind: "I_RELATE", count: 4 },
      { kind: "THIS_HELPED", count: 2 },
    ],
    reportCount: 0,
    safetyFlags: [],
  },
  {
    id: "post-2",
    alias: "Echo Lane",
    mood: "Honest",
    body: "My brain went straight to disaster mode, but writing it out made it feel less true.",
    branchLabel: "Trap path",
    thinkingTrapTag: "CATASTROPHIZING",
    createdLabel: "Today afternoon",
    moderationStatus: "CLEARED",
    reactions: [
      { kind: "I_RELATE", count: 3 },
      { kind: "I_TRIED_THIS", count: 1 },
    ],
    reportCount: 0,
    safetyFlags: [],
  },
  {
    id: "post-3",
    alias: "Drift Signal",
    mood: "Curious",
    body: "I am trying to catch the story earlier, right when it starts getting huge.",
    branchLabel: "Grounded path",
    thinkingTrapTag: "ACCURATE_THINKING",
    createdLabel: "Yesterday",
    moderationStatus: "CLEARED",
    reactions: [
      { kind: "I_RELATE", count: 2 },
      { kind: "THIS_HELPED", count: 3 },
    ],
    reportCount: 0,
    safetyFlags: [],
  },
  {
    id: "post-flagged-1",
    alias: "Hidden for review",
    mood: "Storm-heavy",
    body: "I keep thinking about hurting myself if tomorrow goes badly.",
    branchLabel: "Trap path",
    thinkingTrapTag: "CATASTROPHIZING",
    createdLabel: "Queued just now",
    moderationStatus: "ESCALATED",
    reactions: [],
    reportCount: 1,
    safetyFlags: ["SELF_HARM", "SUICIDE_RISK"],
  },
];

function detectSafetyFlags(body: string): PackSafetyFlagType[] {
  const normalized = body.toLowerCase();
  const flags: PackSafetyFlagType[] = [];

  if (
    /kill myself|end my life|don't want to live|die tonight|suicide/.test(
      normalized,
    )
  ) {
    flags.push("SUICIDE_RISK");
  }

  if (/hurt myself|cut myself|self harm|self-harm/.test(normalized)) {
    flags.push("SELF_HARM");
  }

  if (
    /school|street|road|instagram|insta|snap|snapchat|whatsapp|phone|call me|@\w+/.test(
      normalized,
    ) || /\b\d{5,}\b/.test(normalized)
  ) {
    flags.push("IDENTITY_LEAK");
  }

  if (/name is|his name|her name|their name|my school is/.test(normalized)) {
    flags.push("DOXXING");
  }

  if (/weed|alcohol|drunk|high|smoking|vape|vodka|beer/.test(normalized)) {
    flags.push("SUBSTANCE_USE");
  }

  if (/hit me|beats me|unsafe at home|violent|shouts and hits/.test(normalized)) {
    flags.push("ABUSE_OR_NEGLECT", "VIOLENCE_RISK");
  }

  return [...new Set(flags)];
}

function deriveModerationStatus(
  flags: PackSafetyFlagType[],
): PackModerationStatus {
  if (flags.includes("SUICIDE_RISK") || flags.includes("SELF_HARM")) {
    return "ESCALATED";
  }

  if (flags.includes("IDENTITY_LEAK") || flags.includes("DOXXING")) {
    return "BLOCKED";
  }

  if (flags.includes("SUBSTANCE_USE") || flags.includes("ABUSE_OR_NEGLECT")) {
    return "QUEUED";
  }

  return "CLEARED";
}

function summarizeMessage(status: PackModerationStatus): string {
  switch (status) {
    case "CLEARED":
      return "Posted anonymously to your Pack.";
    case "QUEUED":
      return "Queued for a quick human safety review before it reaches the Pack.";
    case "BLOCKED":
      return "Blocked because it may reveal identity details. Try removing names, schools, numbers, or handles.";
    case "ESCALATED":
      return "Held back from the Pack and escalated for a human safety check.";
  }
}

function makeRedactedExcerpt(body: string): string {
  return body
    .replace(/\b\d{5,}\b/g, "[redacted]")
    .replace(/@\w+/g, "@[redacted]")
    .replace(/\b(instagram|snapchat|whatsapp|school|street|road)\b/gi, "[redacted]");
}

function themeCount(tag: string): number {
  return packPosts.filter(
    (post) => post.moderationStatus === "CLEARED" && post.thinkingTrapTag === tag,
  ).length;
}

function mergeFlags(
  current: PackSafetyFlagType[],
  next: PackSafetyFlagType[],
): PackSafetyFlagType[] {
  return [...new Set<PackSafetyFlagType>([...current, ...next])];
}

function getTeenVisiblePosts(): PackFeedPost[] {
  return packPosts
    .filter((post) => post.moderationStatus === "CLEARED")
    .filter((post) => !hiddenAliases.has(post.alias))
    .map((post) => ({
      ...post,
      isOwnPost: post.alias === CURRENT_ALIAS,
    }));
}

export function getTeenPackFeed(): PackFeedPayload {
  return {
    packId: PACK_ID,
    packName: PACK_NAME,
    privacyNotice:
      "This Pack is pseudonymous, closed, and safety-moderated. Parents do not see raw posts, and mentor raw access is restricted.",
    consentNotice:
      "Before posting, acknowledge that the Pack is pseudonymous, moderated for safety, and not the right place for emergencies or identifying details.",
    postingRules,
    availableReactions,
    reportReasons,
    consentAcknowledged,
    postingEnabled: consentAcknowledged,
    posts: getTeenVisiblePosts(),
  };
}

export function updatePackConsent(
  input: UpdatePackConsentInput,
): UpdatePackConsentResult {
  consentAcknowledged = input.acknowledged;

  return {
    success: true,
    consentAcknowledged,
    postingEnabled: consentAcknowledged,
    message: consentAcknowledged
      ? "Pack posting unlocked. Remember: pseudonymous, moderated, and no identifying details."
      : "Pack posting locked until privacy acknowledgement is turned back on.",
  };
}

export function createPackPost(
  input: CreatePackPostInput,
): CreatePackPostResult {
  if (!consentAcknowledged) {
    return {
      moderationStatus: "BLOCKED",
      safetyFlags: [],
      message: "Acknowledge the Pack privacy rules before posting.",
    };
  }

  const safetyFlags = detectSafetyFlags(input.body);
  const moderationStatus = deriveModerationStatus(safetyFlags);

  const newPost: InternalPackPost = {
    id: `post-${Date.now()}`,
    alias: CURRENT_ALIAS,
    mood: input.mood,
    body: input.body.trim(),
    branchLabel: input.branchLabel,
    thinkingTrapTag: input.thinkingTrapTag,
    createdLabel: "Just now",
    moderationStatus,
    reactions: [],
    reportCount: 0,
    safetyFlags,
  };

  packPosts = [newPost, ...packPosts];

  return {
    moderationStatus,
    safetyFlags,
    message: summarizeMessage(moderationStatus),
    post:
      moderationStatus === "CLEARED"
        ? { ...newPost, isOwnPost: true }
        : undefined,
  };
}

export function reportPackPost(
  input: ReportPackPostInput,
): ReportPackPostResult {
  const target = packPosts.find((post) => post.id === input.postId);

  if (!target) {
    return {
      success: false,
      postId: input.postId,
      moderationStatus: "BLOCKED",
      message: "That Pack post could not be found.",
    };
  }

  target.reportCount += 1;

  if (input.reason === "SELF_HARM_CONCERN") {
    target.moderationStatus = "ESCALATED";
    target.safetyFlags = mergeFlags(target.safetyFlags, ["SELF_HARM"]);
  } else if (input.reason === "IDENTITY_OR_PRIVACY") {
    target.moderationStatus = "BLOCKED";
    target.safetyFlags = mergeFlags(target.safetyFlags, ["IDENTITY_LEAK"]);
  } else {
    target.moderationStatus =
      target.moderationStatus === "ESCALATED" ? "ESCALATED" : "QUEUED";
  }

  return {
    success: true,
    postId: target.id,
    moderationStatus: target.moderationStatus,
    message: "Thanks. That post has been routed for safety review.",
  };
}

export function hidePackAlias(
  input: HidePackAliasInput,
): HidePackAliasResult {
  hiddenAliases.add(input.alias);

  return {
    success: true,
    alias: input.alias,
    message: `${input.alias} has been hidden from your Pack feed.`,
  };
}

export function deleteOwnPackPost(postId: string): DeletePackPostResult {
  const target = packPosts.find((post) => post.id === postId);

  if (!target || target.alias !== CURRENT_ALIAS) {
    return {
      success: false,
      postId,
      message: "You can only remove your own Pack posts.",
    };
  }

  packPosts = packPosts.filter((post) => post.id !== postId);

  return {
    success: true,
    postId,
    message: "Your Pack post has been removed.",
  };
}

export function getParentPackDigest(): ParentPackDigestPayload {
  return {
    packId: PACK_ID,
    packName: PACK_NAME,
    privacyBoundaryNotice:
      "Parents receive trend summaries only. Raw teen Pack posts remain hidden unless a safety override is triggered.",
    themeCards: [
      {
        label: "Pressure spikes",
        insight:
          "Pack reflections suggest stress is turning quickly into worst-case thinking before exams.",
        direction: "Rising",
      },
      {
        label: "Grounding attempts",
        insight:
          "More teens are naming body cues and slowing down before reacting, which is a positive protective sign.",
        direction: "Steady",
      },
      {
        label: "Connection tone",
        insight:
          "The Pack language feels more honest than isolated, which supports belonging without exposing identity.",
        direction: "Softening",
      },
    ],
    recentSignals: [
      "Catastrophizing themes remain the most common Pack pattern this week.",
      "Grounded reflections are increasing after mission completion.",
      "No raw Pack text is shown in the parent view.",
    ],
    staffNote:
      "Suggested parent posture: keep questions short, regulate the room first, and use one sideways invitation rather than a full debrief.",
  };
}

export function getMentorPackView(): MentorPackViewPayload {
  const flaggedPosts = packPosts.filter((post) => post.safetyFlags.length > 0);

  return {
    packId: PACK_ID,
    packName: PACK_NAME,
    redactionNotice:
      "Mentors see aggregate themes and redacted flagged excerpts. Identity mapping requires audited break-glass access.",
    themeCounts: [
      { label: "Catastrophizing", count: themeCount("CATASTROPHIZING") },
      { label: "Accurate Thinking", count: themeCount("ACCURATE_THINKING") },
      { label: "Body cue awareness", count: 2 },
    ],
    moderationCounts: [
      {
        label: "CLEARED",
        count: packPosts.filter((post) => post.moderationStatus === "CLEARED").length,
      },
      {
        label: "QUEUED",
        count: packPosts.filter((post) => post.moderationStatus === "QUEUED").length,
      },
      {
        label: "BLOCKED",
        count: packPosts.filter((post) => post.moderationStatus === "BLOCKED").length,
      },
      {
        label: "ESCALATED",
        count: packPosts.filter((post) => post.moderationStatus === "ESCALATED").length,
      },
    ],
    flaggedPosts: flaggedPosts.map(
      (post): MentorFlaggedPost => ({
        id: post.id,
        createdLabel: post.createdLabel,
        thinkingTrapTag: post.thinkingTrapTag,
        safetyFlags: post.safetyFlags,
        moderationStatus: post.moderationStatus,
        redactedExcerpt: makeRedactedExcerpt(post.body),
        reportCount: post.reportCount,
      }),
    ),
    coachActions: [
      "Review escalated posts before the next mentor session.",
      "Keep raw content redacted unless a break-glass identity request is approved.",
      "Use Pack-level trends to adjust missions before escalating to family outreach.",
    ],
  };
}

export function getModerationQueue(): ModerationQueuePayload {
  return {
    packId: PACK_ID,
    items: packPosts
      .filter((post) => post.moderationStatus !== "CLEARED")
      .map(
        (post): ModerationQueueItem => ({
          id: post.id,
          createdLabel: post.createdLabel,
          thinkingTrapTag: post.thinkingTrapTag,
          safetyFlags: post.safetyFlags,
          moderationStatus: post.moderationStatus,
          redactedExcerpt: makeRedactedExcerpt(post.body),
          reportCount: post.reportCount,
        }),
      ),
  };
}

export function getAdminPackConsole(): AdminPackConsolePayload {
  return {
    packId: PACK_ID,
    queue: getModerationQueue().items,
    auditNotice:
      "Identity mapping is never shown here. Any identity reveal requires a separate audited break-glass workflow.",
    identityAccessPolicy: [
      "Escalate suicide or self-harm signals to human review immediately.",
      "Do not reveal alias-to-identity mappings from the moderation console.",
      "Block or redact identity leaks before any post reaches the Pack.",
    ],
  };
}

export function updateModerationDecision(
  input: UpdateModerationDecisionInput,
): UpdateModerationDecisionResult {
  const target = packPosts.find((post) => post.id === input.postId);

  if (!target) {
    return {
      success: false,
      postId: input.postId,
      moderationStatus: "BLOCKED",
    };
  }

  if (input.decision === "PUBLISH") {
    target.moderationStatus = "CLEARED";
  }

  if (input.decision === "KEEP_BLOCKED") {
    target.moderationStatus = "BLOCKED";
  }

  if (input.decision === "ESCALATE_TO_ADMIN") {
    target.moderationStatus = "ESCALATED";
  }

  return {
    success: true,
    postId: target.id,
    moderationStatus: target.moderationStatus,
  };
}
