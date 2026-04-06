import { prisma, type TrapCategory } from "@empathiq/database";
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
  UpdateModerationDecisionInput,
  UpdateModerationDecisionResult,
  UpdatePackConsentInput,
  UpdatePackConsentResult,
} from "@empathiq/shared/contracts/pack";
import {
  classifyRiskZone,
  riskZoneToModerationStatus,
  getRiskZoneMessage,
  type RiskZone,
} from "./riskClassifier";
import {
  createPackPost as createPackPostFallback,
  deleteOwnPackPost as deleteOwnPackPostFallback,
  getAdminPackConsole as getAdminPackConsoleFallback,
  getMentorPackView as getMentorPackViewFallback,
  getModerationQueue as getModerationQueueFallback,
  getParentPackDigest as getParentPackDigestFallback,
  getTeenPackFeed as getTeenPackFeedFallback,
  hidePackAlias as hidePackAliasFallback,
  reportPackPost as reportPackPostFallback,
  updateModerationDecision as updateModerationDecisionFallback,
  updatePackConsent as updatePackConsentFallback,
} from "../_data/packData";

const PACK_NAME = "Pack Lantern 07";
const CURRENT_ALIAS = "Quiet Orbit";
const DEFAULT_MISSION_SLUG = "night-before-finals";
const hiddenAliases = new Set<string>();

const availableReactions: PackReactionKind[] = [
  "I_RELATE",
  "I_TRIED_THIS",
  "THIS_HELPED",
];

const reportReasons = [
  "IDENTITY_OR_PRIVACY",
  "BULLYING_OR_HARM",
  "SELF_HARM_CONCERN",
  "SUBSTANCE_RISK",
  "OTHER",
] as const;

const postingRules = [
  "No real names, schools, phone numbers, or social handles.",
  "Share what the moment felt like, not who caused it.",
  "If a post suggests immediate danger, it goes to human review instead of the Pack.",
];

const seedPosts = [
  {
    alias: "North Star",
    moodTag: "Steadying",
    body: "I noticed my chest calm down when I named the most likely outcome instead of the worst one.",
    branchLabel: "Grounded path",
    thinkingTrapCode: "ACCURATE_THINKING" as TrapCategory,
    status: "PUBLISHED" as const,
    safetyFlags: [] as PackSafetyFlagType[],
  },
  {
    alias: "Echo Lane",
    moodTag: "Honest",
    body: "My brain went straight to disaster mode, but writing it out made it feel less true.",
    branchLabel: "Trap path",
    thinkingTrapCode: "CATASTROPHIZING" as TrapCategory,
    status: "PUBLISHED" as const,
    safetyFlags: [] as PackSafetyFlagType[],
  },
  {
    alias: "Drift Signal",
    moodTag: "Curious",
    body: "I am trying to catch the story earlier, right when it starts getting huge.",
    branchLabel: "Grounded path",
    thinkingTrapCode: "ACCURATE_THINKING" as TrapCategory,
    status: "PUBLISHED" as const,
    safetyFlags: [] as PackSafetyFlagType[],
  },
  {
    alias: "Hidden for review",
    moodTag: "Storm-heavy",
    body: "I keep thinking about hurting myself if tomorrow goes badly.",
    branchLabel: "Trap path",
    thinkingTrapCode: "CATASTROPHIZING" as TrapCategory,
    status: "ESCALATED" as const,
    safetyFlags: ["SELF_HARM", "SUICIDE_RISK"] as PackSafetyFlagType[],
  },
];

function hasDatabaseStorage() {
  return Boolean(process.env.DATABASE_URL);
}

function encodeBody(body: string) {
  return Buffer.from(body, "utf8").toString("base64");
}

function decodeBody(ciphertext: string) {
  try {
    return Buffer.from(ciphertext, "base64").toString("utf8");
  } catch {
    return ciphertext;
  }
}

function previewText(body: string, limit = 180) {
  return body.trim().slice(0, limit);
}

function detectSafetyFlags(body: string): PackSafetyFlagType[] {
  const normalized = body.toLowerCase();
  const flags: PackSafetyFlagType[] = [];

  if (/kill myself|end my life|don't want to live|die tonight|suicide/.test(normalized)) {
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

function deriveModerationStatus(flags: PackSafetyFlagType[]): PackModerationStatus {
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

function summarizeMessage(status: PackModerationStatus) {
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

function makeRedactedExcerpt(body: string) {
  return body
    .replace(/\b\d{5,}\b/g, "[redacted]")
    .replace(/@\w+/g, "@[redacted]")
    .replace(
      /\b(instagram|snapchat|whatsapp|school|street|road)\b/gi,
      "[redacted]",
    );
}

/**
 * Notify admins of flagged posts (RED/YELLOW zones)
 * In production, this would be a background job with retry logic
 */
async function notifyAdminsOfFlaggedPost({
  postId,
  zone,
  safetyFlags,
  redactedExcerpt,
}: {
  postId: string;
  zone: "RED" | "YELLOW";
  safetyFlags: string[];
  redactedExcerpt: string;
}): Promise<void> {
  // Map risk flag types to safety flag type labels for notification
  const flagLabels = safetyFlags.map((flag) => {
    const labelMap: Record<string, string> = {
      SUICIDE_INTENT: "Suicide Risk",
      SELF_HARM_INTENT: "Self-Harm",
      ACTIVE_ABUSE: "Abuse/Neglect",
      VIOLENCE_RISK: "Violence Risk",
      SUBSTANCE_ABUSE: "Substance Abuse",
      EATING_DISORDER: "Eating Disorder",
      SEVERE_DEPRESSION: "Severe Depression",
      IDENTITY_LEAK: "Identity Leak",
      BULLYING_CONTENT: "Bullying",
    };
    return labelMap[flag] || flag;
  });

  try {
    // In production, use proper async queue (Bull, RabbitMQ, AWS SQS)
    // For MVP, we log and optionally make an HTTP call
    console.log(`[PACK_MODERATION] ${zone} zone post detected: ${postId}`);
    console.log(`  Flags: ${flagLabels.join(", ")}`);
    console.log(`  Excerpt: ${redactedExcerpt.substring(0, 100)}...`);

    // Optional: Call notification endpoint (would be async queue in production)
    if (process.env.NOTIFY_ADMINS_ENABLED === "true") {
      // This would use fetch to call the notification endpoint
      // But we avoid making HTTP requests from server functions
      // Instead, this would be a background job
    }
  } catch (error) {
    console.error("Error notifying admins:", error);
    // Don't throw - notification failure shouldn't block post creation
  }
}

function toContractStatus(status: string): PackModerationStatus {
  if (status === "PUBLISHED") return "CLEARED";
  if (status === "BLOCKED") return "BLOCKED";
  if (status === "ESCALATED") return "ESCALATED";
  return "QUEUED";
}

function toDbStatus(status: PackModerationStatus) {
  if (status === "CLEARED") return "PUBLISHED" as const;
  if (status === "BLOCKED") return "BLOCKED" as const;
  if (status === "ESCALATED") return "ESCALATED" as const;
  return "PENDING_REVIEW" as const;
}

function safeTrapCode(value: string): TrapCategory | null {
  const allowed = new Set<TrapCategory>([
    "ACCURATE_THINKING",
    "CATASTROPHIZING",
    "ALL_OR_NOTHING",
    "MIND_READING",
    "OVERGENERALIZATION",
    "LABELING",
    "EMOTIONAL_REASONING",
    "SHOULD_STATEMENTS",
  ]);

  return allowed.has(value as TrapCategory) ? (value as TrapCategory) : null;
}

function createdLabelFromDate(date: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) {
    const hour = date.getHours();
    if (hour < 12) return "Today morning";
    if (hour < 18) return "Today afternoon";
    return "Today evening";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

async function ensureMission(slugInput: string) {
  const slug = slugInput
    .trim()
    .toLowerCase()
    .replace(/^mission-/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || DEFAULT_MISSION_SLUG;

  return prisma.mission.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      title: slug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      narrativeIntro: "Pack-linked mission placeholder.",
      sensoryPrompt: "Pause and notice your breath before you choose.",
      estimatedMinutes: 3,
      status: "PUBLISHED",
    },
  });
}

async function ensurePackContext(alias = CURRENT_ALIAS) {
  const mentorEmail = "mentor.pack.preview@empathiq.local";
  const teenEmail = `${alias.toLowerCase().replace(/[^a-z0-9]+/g, ".")}@pack.preview.empathiq.local`;

  const mentorUser = await prisma.user.upsert({
    where: { email: mentorEmail },
    update: { displayName: "Pack Preview Mentor" },
    create: {
      email: mentorEmail,
      passwordHash: "dev-only",
      role: "MENTOR",
      displayName: "Pack Preview Mentor",
    },
  });

  const mentorProfile = await prisma.mentorProfile.upsert({
    where: { userId: mentorUser.id },
    update: { specialty: "Pack facilitation" },
    create: {
      userId: mentorUser.id,
      specialty: "Pack facilitation",
    },
  });

  let pack = await prisma.pack.findFirst({
    where: {
      name: PACK_NAME,
      mentorId: mentorProfile.id,
    },
  });

  if (!pack) {
    pack = await prisma.pack.create({
      data: {
        name: PACK_NAME,
        mentorId: mentorProfile.id,
        status: "ACTIVE",
        maxMembers: 8,
        ageBand: "13-18",
        isClosed: true,
        parentRawAccessBlocked: true,
        mentorRawAccessRestricted: true,
      },
    });
  }

  const teenUser = await prisma.user.upsert({
    where: { email: teenEmail },
    update: { displayName: alias },
    create: {
      email: teenEmail,
      passwordHash: "dev-only",
      role: "TEEN",
      displayName: alias,
    },
  });

  const teenProfile = await prisma.teenProfile.upsert({
    where: { userId: teenUser.id },
    update: {
      preferredName: alias,
      packId: pack.id,
    },
    create: {
      userId: teenUser.id,
      preferredName: alias,
      birthDate: new Date("2010-01-15T00:00:00.000Z"),
      packId: pack.id,
    },
  });

  const membership = await prisma.packMembership.upsert({
    where: {
      userId_packId: {
        userId: teenUser.id,
        packId: pack.id,
      },
    },
    update: {},
    create: {
      userId: teenUser.id,
      packId: pack.id,
      role: "MEMBER",
    },
  });

  let activeAlias = await prisma.packAlias.findFirst({
    where: {
      packId: pack.id,
      membershipId: membership.id,
      status: "ACTIVE",
    },
    orderBy: { effectiveFrom: "desc" },
  });

  if (!activeAlias) {
    activeAlias = await prisma.packAlias.create({
      data: {
        packId: pack.id,
        membershipId: membership.id,
        alias,
        status: "ACTIVE",
      },
    });
  }

  return { pack, teenProfile, membership, alias: activeAlias };
}

async function ensureSeedPosts() {
  const { pack } = await ensurePackContext();
  const existingCount = await prisma.packReflection.count({
    where: { packId: pack.id },
  });

  if (existingCount > 0) {
    return;
  }

  const mission = await ensureMission(DEFAULT_MISSION_SLUG);

  for (const seed of seedPosts) {
    const context = await ensurePackContext(seed.alias);
    const attempt = await prisma.missionAttempt.create({
      data: {
        teenId: context.teenProfile.id,
        missionId: mission.id,
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    const reflection = await prisma.packReflection.create({
      data: {
        packId: context.pack.id,
        teenId: context.teenProfile.id,
        membershipId: context.membership.id,
        missionAttemptId: attempt.id,
        aliasId: context.alias.id,
        displayAlias: seed.alias,
        bodyCiphertext: encodeBody(seed.body),
        bodyPreview: previewText(seed.body),
        branchLabel: seed.branchLabel,
        moodTag: seed.moodTag,
        thinkingTrapCode: seed.thinkingTrapCode,
        status: seed.status,
        publishedAt: seed.status === "PUBLISHED" ? new Date() : null,
      },
    });

    if (seed.safetyFlags.length > 0) {
      await prisma.packSafetyFlag.createMany({
        data: seed.safetyFlags.map((flag) => ({
          postId: reflection.id,
          flagType: flag,
          detectedBy: "seed",
          notes: "Seeded moderation signal for preview data.",
        })),
      });
    }
  }
}

async function fetchPostsWithRelations() {
  const { pack, membership } = await ensurePackContext();
  await ensureSeedPosts();

  const posts = await prisma.packReflection.findMany({
    where: { packId: pack.id },
    include: {
      reactions: true,
      safetyFlags: true,
      moderationEvents: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return { pack, currentMembershipId: membership.id, posts };
}

function mapPost(
  post: Awaited<ReturnType<typeof fetchPostsWithRelations>>["posts"][number],
  currentMembershipId: string,
): PackFeedPost {
  const reactionMap = new Map<PackReactionKind, number>();

  for (const reaction of post.reactions) {
    const key = reaction.kind as PackReactionKind;
    reactionMap.set(key, (reactionMap.get(key) ?? 0) + 1);
  }

  const decodedBody = decodeBody(post.bodyCiphertext);
  const reportCount = post.moderationEvents.filter((event) =>
    event.notes?.startsWith("REPORT:"),
  ).length;

  return {
    id: post.id,
    alias: post.displayAlias,
    mood: post.moodTag || "Reflective",
    body: decodedBody,
    branchLabel: post.branchLabel || "Reflection",
    thinkingTrapTag: post.thinkingTrapCode || "UNKNOWN",
    createdLabel: createdLabelFromDate(post.createdAt),
    moderationStatus: toContractStatus(post.status),
    reactions: availableReactions
      .map((kind) => ({
        kind,
        count: reactionMap.get(kind) ?? 0,
      }))
      .filter((reaction) => reaction.count > 0),
    isOwnPost: post.membershipId === currentMembershipId,
    reportCount,
  };
}

export async function getTeenPackFeed(): Promise<PackFeedPayload> {
  if (!hasDatabaseStorage()) {
    return getTeenPackFeedFallback();
  }

  const { pack, currentMembershipId, posts } = await fetchPostsWithRelations();
  const currentMembership = await prisma.packMembership.findUnique({
    where: { id: currentMembershipId },
  });

  return {
    packId: pack.id,
    packName: pack.name,
    privacyNotice:
      "This Pack is pseudonymous, closed, and safety-moderated. Parents do not see raw posts, and mentor raw access is restricted.",
    consentNotice:
      "Before posting, acknowledge that the Pack is pseudonymous, moderated for safety, and not the right place for emergencies or identifying details.",
    postingRules,
    availableReactions,
    reportReasons: [...reportReasons],
    consentAcknowledged: Boolean(currentMembership?.privacyAcknowledgedAt),
    postingEnabled: Boolean(currentMembership?.privacyAcknowledgedAt),
    posts: posts
      .filter((post) => post.status === "PUBLISHED")
      .map((post) => mapPost(post, currentMembershipId))
      .filter((post) => !hiddenAliases.has(post.alias)),
  };
}

export async function updatePackConsent(
  input: UpdatePackConsentInput,
): Promise<UpdatePackConsentResult> {
  if (!hasDatabaseStorage()) {
    return updatePackConsentFallback(input);
  }

  const { membership } = await ensurePackContext();

  await prisma.packMembership.update({
    where: { id: membership.id },
    data: {
      privacyAcknowledgedAt: input.acknowledged ? new Date() : null,
    },
  });

  return {
    success: true,
    consentAcknowledged: input.acknowledged,
    postingEnabled: input.acknowledged,
    message: input.acknowledged
      ? "Pack posting unlocked. Remember: pseudonymous, moderated, and no identifying details."
      : "Pack posting locked until privacy acknowledgement is turned back on.",
  };
}

export async function createPackPost(
  input: CreatePackPostInput,
): Promise<CreatePackPostResult> {
  if (!hasDatabaseStorage()) {
    return createPackPostFallback(input);
  }

  const { pack, teenProfile, membership, alias } = await ensurePackContext();
  const latestMembership = await prisma.packMembership.findUnique({
    where: { id: membership.id },
  });

  if (!latestMembership?.privacyAcknowledgedAt) {
    return {
      moderationStatus: "BLOCKED",
      safetyFlags: [],
      message: "Acknowledge the Pack privacy rules before posting.",
    };
  }

  // Classify risk using AI-powered system (RED/YELLOW/GREEN zones)
  const riskClassification = classifyRiskZone(input.body);
  const moderationStatus = riskZoneToModerationStatus(riskClassification.zone);
  const mission = await ensureMission(input.missionId);
  const attempt = await prisma.missionAttempt.create({
    data: {
      teenId: teenProfile.id,
      missionId: mission.id,
      status: "COMPLETED",
      completedAt: new Date(),
    },
  });

  const reflection = await prisma.packReflection.create({
    data: {
      packId: pack.id,
      teenId: teenProfile.id,
      membershipId: membership.id,
      missionAttemptId: attempt.id,
      aliasId: alias.id,
      displayAlias: alias.alias,
      bodyCiphertext: encodeBody(input.body.trim()),
      bodyPreview: previewText(input.body),
      branchLabel: input.branchLabel,
      moodTag: input.mood,
      thinkingTrapCode: safeTrapCode(input.thinkingTrapTag),
      status: toDbStatus(moderationStatus),
      publishedAt: moderationStatus === "CLEARED" ? new Date() : null,
    },
  });

  // Record risk classification and flags
  if (riskClassification.flagTypes.length > 0) {
    // Map risk flag types to safety flag types for compatibility
    const safetyFlagsToRecord: PackSafetyFlagType[] = [];
    const riskTypeToSafetyType: Record<string, PackSafetyFlagType> = {
      SUICIDE_INTENT: "SUICIDE_RISK",
      SELF_HARM_INTENT: "SELF_HARM",
      ACTIVE_ABUSE: "ABUSE_OR_NEGLECT",
      VIOLENCE_RISK: "VIOLENCE_RISK",
      SUBSTANCE_ABUSE: "SUBSTANCE_USE",
      IDENTITY_LEAK: "IDENTITY_LEAK",
    };

    for (const flagType of riskClassification.flagTypes) {
      const safetyType = riskTypeToSafetyType[flagType];
      if (safetyType) {
        safetyFlagsToRecord.push(safetyType);
      }
    }

    if (safetyFlagsToRecord.length > 0) {
      await prisma.packSafetyFlag.createMany({
        data: safetyFlagsToRecord.map((flag) => ({
          postId: reflection.id,
          flagType: flag,
          detectedBy: "ai-classifier",
          notes: `Risk zone: ${riskClassification.zone}. ${riskClassification.reasoning}`,
        })),
      });
    }
  }

  // Create moderation event for non-cleared posts
  if (moderationStatus !== "CLEARED") {
    await prisma.packModerationEvent.create({
      data: {
        postId: reflection.id,
        decision:
          moderationStatus === "ESCALATED"
            ? "ESCALATE_TO_ADMIN"
            : "REQUEST_MANUAL_REVIEW", // QUEUED posts go to REQUEST_MANUAL_REVIEW
        notes: `RISK_ZONE:${riskClassification.zone}|CONFIDENCE:${(riskClassification.confidence * 100).toFixed(0)}%|${riskClassification.reasoning}`,
      },
    });

    // Notify admins of RED/YELLOW posts (background task in production)
    // In production, this would be a queue job (Bull, RabbitMQ, etc.)
    if (riskClassification.zone === "RED" || riskClassification.zone === "YELLOW") {
      void notifyAdminsOfFlaggedPost({
        postId: reflection.id,
        zone: riskClassification.zone,
        safetyFlags: riskClassification.flagTypes,
        redactedExcerpt: makeRedactedExcerpt(input.body),
      }).catch((err) => {
        console.error("Failed to notify admins:", err);
      });
    }
  }

  const resultPost: PackFeedPost | undefined =
    moderationStatus === "CLEARED"
      ? {
          id: reflection.id,
          alias: alias.alias,
          mood: input.mood,
          body: input.body.trim(),
          branchLabel: input.branchLabel,
          thinkingTrapTag: input.thinkingTrapTag,
          createdLabel: "Just now",
          moderationStatus,
          reactions: [],
          isOwnPost: true,
          reportCount: 0,
        }
      : undefined;

  return {
    moderationStatus,
    safetyFlags: riskClassification.flagTypes.map((t) =>
      t === "SUICIDE_INTENT"
        ? "SUICIDE_RISK"
        : t === "SELF_HARM_INTENT"
          ? "SELF_HARM"
          : t === "ACTIVE_ABUSE"
            ? "ABUSE_OR_NEGLECT"
            : (t.replace(/_/g, "_") as PackSafetyFlagType),
    ),
    message: getRiskZoneMessage(riskClassification.zone),
    post: resultPost,
  };
}

export async function reportPackPost(
  input: ReportPackPostInput,
): Promise<ReportPackPostResult> {
  if (!hasDatabaseStorage()) {
    return reportPackPostFallback(input);
  }

  const post = await prisma.packReflection.findUnique({
    where: { id: input.postId },
  });

  if (!post) {
    return {
      success: false,
      postId: input.postId,
      moderationStatus: "BLOCKED",
      message: "That Pack post could not be found.",
    };
  }

  let nextStatus: PackModerationStatus = toContractStatus(post.status);
  const extraFlags: PackSafetyFlagType[] = [];

  if (input.reason === "SELF_HARM_CONCERN") {
    nextStatus = "ESCALATED";
    extraFlags.push("SELF_HARM");
  } else if (input.reason === "IDENTITY_OR_PRIVACY") {
    nextStatus = "BLOCKED";
    extraFlags.push("IDENTITY_LEAK");
  } else if (input.reason === "SUBSTANCE_RISK") {
    nextStatus = "QUEUED";
    extraFlags.push("SUBSTANCE_USE");
  } else if (nextStatus !== "ESCALATED") {
    nextStatus = "QUEUED";
  }

  await prisma.packReflection.update({
    where: { id: post.id },
    data: {
      status: toDbStatus(nextStatus),
      publishedAt: null,
    },
  });

  if (extraFlags.length > 0) {
    await prisma.packSafetyFlag.createMany({
      data: extraFlags.map((flag) => ({
        postId: post.id,
        flagType: flag,
        detectedBy: "user-report",
        notes: `Reported as ${input.reason}`,
      })),
    });
  }

  await prisma.packModerationEvent.create({
    data: {
      postId: post.id,
      decision:
        nextStatus === "ESCALATED"
          ? "ESCALATE_TO_ADMIN"
          : nextStatus === "BLOCKED"
            ? "KEEP_BLOCKED"
            : "REQUEST_MANUAL_REVIEW",
      notes: `REPORT:${input.reason}${input.notes ? `:${input.notes}` : ""}`,
    },
  });

  return {
    success: true,
    postId: post.id,
    moderationStatus: nextStatus,
    message: "Thanks. That post has been routed for safety review.",
  };
}

export async function hidePackAlias(
  input: HidePackAliasInput,
): Promise<HidePackAliasResult> {
  if (!hasDatabaseStorage()) {
    return hidePackAliasFallback(input);
  }

  hiddenAliases.add(input.alias);
  return {
    success: true,
    alias: input.alias,
    message: `${input.alias} has been hidden from your Pack feed.`,
  };
}

export async function deleteOwnPackPost(
  postId: string,
): Promise<DeletePackPostResult> {
  if (!hasDatabaseStorage()) {
    return deleteOwnPackPostFallback(postId);
  }

  const { membership } = await ensurePackContext();
  const target = await prisma.packReflection.findUnique({
    where: { id: postId },
  });

  if (!target || target.membershipId !== membership.id) {
    return {
      success: false,
      postId,
      message: "You can only remove your own Pack posts.",
    };
  }

  await prisma.packReflection.delete({
    where: { id: postId },
  });

  return {
    success: true,
    postId,
    message: "Your Pack post has been removed.",
  };
}

export async function getParentPackDigest(): Promise<ParentPackDigestPayload> {
  if (!hasDatabaseStorage()) {
    return getParentPackDigestFallback();
  }

  const { pack, posts } = await fetchPostsWithRelations();
  const published = posts.filter((post) => post.status === "PUBLISHED");
  const trapCounts = new Map<string, number>();

  for (const post of published) {
    const key = post.thinkingTrapCode || "GROUNDING";
    trapCounts.set(key, (trapCounts.get(key) ?? 0) + 1);
  }

  const topThemes = [...trapCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const themeCards: ParentPackDigestPayload["themeCards"] =
    topThemes.length > 0
      ? topThemes.map(([label, count]) => ({
          label: label.replaceAll("_", " "),
          insight: `${count} recent Pack reflections touched this pattern without exposing raw teen text.`,
          direction: count >= 3 ? "Rising" : "Steady",
        }))
      : [
          {
            label: "Pack trends warming up",
            insight: "Survey and mission-linked reflections will start shaping this digest once teens post.",
            direction: "Steady" as const,
          },
        ];

  return {
    packId: pack.id,
    packName: pack.name,
    privacyBoundaryNotice:
      "Parents receive trend summaries only. Raw teen Pack posts remain hidden unless a safety override is triggered.",
    themeCards,
    recentSignals: [
      `${published.length} Pack reflections are currently visible in the protected feed.`,
      `${posts.filter((post) => post.status === "ESCALATED").length} reflections required safety escalation.`,
      "No raw Pack text is shown in the parent view.",
    ],
    staffNote:
      "Suggested parent posture: regulate the room first, ask one calm question, and avoid turning the whole evening into a debrief.",
  };
}

export async function getMentorPackView(): Promise<MentorPackViewPayload> {
  if (!hasDatabaseStorage()) {
    return getMentorPackViewFallback();
  }

  const { pack, posts } = await fetchPostsWithRelations();
  const published = posts.filter((post) => post.status === "PUBLISHED");
  const flagged = posts.filter((post) => post.safetyFlags.length > 0);
  const trapCounts = new Map<string, number>();

  for (const post of published) {
    const label = post.thinkingTrapCode || "GROUNDING";
    trapCounts.set(label, (trapCounts.get(label) ?? 0) + 1);
  }

  const flaggedPosts: MentorFlaggedPost[] = flagged.map((post) => ({
    id: post.id,
    createdLabel: createdLabelFromDate(post.createdAt),
    thinkingTrapTag: post.thinkingTrapCode || "UNKNOWN",
    safetyFlags: post.safetyFlags.map((flag) => flag.flagType as PackSafetyFlagType),
    moderationStatus: toContractStatus(post.status),
    redactedExcerpt: makeRedactedExcerpt(decodeBody(post.bodyCiphertext)),
    reportCount: post.moderationEvents.filter((event) =>
      event.notes?.startsWith("REPORT:"),
    ).length,
  }));

  return {
    packId: pack.id,
    packName: pack.name,
    redactionNotice:
      "Mentors see aggregate themes and redacted flagged excerpts. Identity mapping requires audited break-glass access.",
    themeCounts: [...trapCounts.entries()].map(([label, count]) => ({
      label: label.replaceAll("_", " "),
      count,
    })),
    moderationCounts: [
      {
        label: "CLEARED",
        count: posts.filter((post) => post.status === "PUBLISHED").length,
      },
      {
        label: "QUEUED",
        count: posts.filter((post) => post.status === "PENDING_REVIEW").length,
      },
      {
        label: "BLOCKED",
        count: posts.filter((post) => post.status === "BLOCKED").length,
      },
      {
        label: "ESCALATED",
        count: posts.filter((post) => post.status === "ESCALATED").length,
      },
    ],
    flaggedPosts,
    coachActions: [
      "Review escalated posts before the next mentor session.",
      "Use survey context plus Pack trends to tailor the next mission lane.",
      "Keep raw content redacted unless a break-glass identity request is approved.",
    ],
  };
}

export async function getModerationQueue(): Promise<ModerationQueuePayload> {
  if (!hasDatabaseStorage()) {
    return getModerationQueueFallback();
  }

  const { pack, posts } = await fetchPostsWithRelations();

  return {
    packId: pack.id,
    items: posts
      .filter((post) => post.status !== "PUBLISHED")
      .map(
        (post): ModerationQueueItem => ({
          id: post.id,
          createdLabel: createdLabelFromDate(post.createdAt),
          thinkingTrapTag: post.thinkingTrapCode || "UNKNOWN",
          safetyFlags: post.safetyFlags.map((flag) => flag.flagType as PackSafetyFlagType),
          moderationStatus: toContractStatus(post.status),
          redactedExcerpt: makeRedactedExcerpt(decodeBody(post.bodyCiphertext)),
          reportCount: post.moderationEvents.filter((event) =>
            event.notes?.startsWith("REPORT:"),
          ).length,
        }),
      ),
  };
}

export async function getAdminPackConsole(): Promise<AdminPackConsolePayload> {
  if (!hasDatabaseStorage()) {
    return getAdminPackConsoleFallback();
  }

  const queue = await getModerationQueue();

  return {
    packId: queue.packId,
    queue: queue.items,
    auditNotice:
      "Identity mapping is never shown here. Any identity reveal requires a separate audited break-glass workflow.",
    identityAccessPolicy: [
      "Escalate suicide or self-harm signals to human review immediately.",
      "Do not reveal alias-to-identity mappings from the moderation console.",
      "Block or redact identity leaks before any post reaches the Pack.",
    ],
  };
}

export async function updateModerationDecision(
  input: UpdateModerationDecisionInput,
): Promise<UpdateModerationDecisionResult> {
  if (!hasDatabaseStorage()) {
    return updateModerationDecisionFallback(input);
  }

  const target = await prisma.packReflection.findUnique({
    where: { id: input.postId },
  });

  if (!target) {
    return {
      success: false,
      postId: input.postId,
      moderationStatus: "BLOCKED",
    };
  }

  const moderationStatus: PackModerationStatus =
    input.decision === "PUBLISH"
      ? "CLEARED"
      : input.decision === "KEEP_BLOCKED"
        ? "BLOCKED"
        : "ESCALATED";

  await prisma.packReflection.update({
    where: { id: target.id },
    data: {
      status: toDbStatus(moderationStatus),
      publishedAt: moderationStatus === "CLEARED" ? new Date() : null,
    },
  });

  await prisma.packModerationEvent.create({
    data: {
      postId: target.id,
      decision:
        input.decision === "PUBLISH"
          ? "PUBLISH"
          : input.decision === "KEEP_BLOCKED"
            ? "KEEP_BLOCKED"
            : "ESCALATE_TO_ADMIN",
      notes: input.notes || null,
    },
  });

  return {
    success: true,
    postId: target.id,
    moderationStatus,
  };
}
