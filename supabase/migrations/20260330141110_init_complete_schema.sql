/*
  # Complete EmpathyRise Database Schema

  This migration initializes all tables for the EmpathyRise platform including:
  - User management and role-based profiles
  - Pack and peer cohorts
  - Mission tracking and decision trees
  - Pack reflection and safety features
  - Teen module features (intake, daily signals, challenges)
  - Escalation and clinical workflow
  - Mentor sessions and session briefs
  - Notifications and clinical partnerships
  - Training and certification tracking
*/

CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "TeenProfile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "preferredName" TEXT NOT NULL,
  "birthDate" TIMESTAMP(3) NOT NULL,
  "onboardingStage" TEXT,
  "packId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "TeenProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ParentProfile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "relationshipLabel" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ParentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "MentorProfile" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL UNIQUE,
  "specialty" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MentorProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "ParentTeenLink" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "parentId" TEXT NOT NULL,
  "teenId" TEXT NOT NULL,
  "consentGrantedAt" TIMESTAMP(3),
  "isPrimaryGuardian" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ParentTeenLink_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ParentProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "ParentTeenLink_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "ParentTeenLink_parentId_teenId_key" UNIQUE("parentId", "teenId")
);

CREATE TABLE IF NOT EXISTS "Pack" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'FORMING',
  "mentorId" TEXT NOT NULL,
  "maxMembers" INTEGER NOT NULL DEFAULT 8,
  "ageBand" TEXT,
  "cycleStart" TIMESTAMP(3),
  "cycleEnd" TIMESTAMP(3),
  "aliasRotationDays" INTEGER NOT NULL DEFAULT 7,
  "isClosed" BOOLEAN NOT NULL DEFAULT true,
  "parentRawAccessBlocked" BOOLEAN NOT NULL DEFAULT true,
  "mentorRawAccessRestricted" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Pack_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile" ("id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "Pack_mentorId_status_idx" ON "Pack"("mentorId", "status");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'TeenProfile' AND column_name = 'packId'
  ) THEN
    ALTER TABLE "TeenProfile" ADD CONSTRAINT "TeenProfile_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack" ("id") ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "PackMembership" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "packId" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'MEMBER',
  "isPeerPostingEnabled" BOOLEAN NOT NULL DEFAULT true,
  "privacyAcknowledgedAt" TIMESTAMP(3),
  "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PackMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackMembership_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackMembership_userId_packId_key" UNIQUE("userId", "packId")
);

CREATE TABLE IF NOT EXISTS "PackAlias" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "packId" TEXT NOT NULL,
  "membershipId" TEXT NOT NULL,
  "alias" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "effectiveFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "effectiveTo" TIMESTAMP(3),
  CONSTRAINT "PackAlias_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackAlias_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "PackMembership" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackAlias_packId_alias_effectiveFrom_key" UNIQUE("packId", "alias", "effectiveFrom")
);

CREATE INDEX IF NOT EXISTS "PackAlias_membershipId_status_idx" ON "PackAlias"("membershipId", "status");

CREATE TABLE IF NOT EXISTS "Mission" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "narrativeIntro" TEXT NOT NULL,
  "sensoryPrompt" TEXT,
  "status" TEXT NOT NULL DEFAULT 'DRAFT',
  "estimatedMinutes" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE IF NOT EXISTS "MissionDecisionOption" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "missionId" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "narrativeOutcome" TEXT,
  "sortOrder" INTEGER NOT NULL,
  CONSTRAINT "MissionDecisionOption_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission" ("id") ON DELETE CASCADE,
  CONSTRAINT "MissionDecisionOption_missionId_sortOrder_key" UNIQUE("missionId", "sortOrder")
);

CREATE TABLE IF NOT EXISTS "ThinkingTrap" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "label" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "severityWeight" INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS "MissionChoiceTrap" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "decisionOptionId" TEXT NOT NULL,
  "thinkingTrapId" TEXT NOT NULL,
  CONSTRAINT "MissionChoiceTrap_decisionOptionId_fkey" FOREIGN KEY ("decisionOptionId") REFERENCES "MissionDecisionOption" ("id") ON DELETE CASCADE,
  CONSTRAINT "MissionChoiceTrap_thinkingTrapId_fkey" FOREIGN KEY ("thinkingTrapId") REFERENCES "ThinkingTrap" ("id") ON DELETE CASCADE,
  CONSTRAINT "MissionChoiceTrap_decisionOptionId_thinkingTrapId_key" UNIQUE("decisionOptionId", "thinkingTrapId")
);

CREATE TABLE IF NOT EXISTS "MissionAttempt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "teenId" TEXT NOT NULL,
  "missionId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'STARTED',
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  CONSTRAINT "MissionAttempt_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "MissionAttempt_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission" ("id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "MissionAttempt_teenId_startedAt_idx" ON "MissionAttempt"("teenId", "startedAt");

CREATE TABLE IF NOT EXISTS "MissionChoice" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "missionAttemptId" TEXT NOT NULL,
  "decisionOptionId" TEXT NOT NULL,
  "thinkingTrapId" TEXT NOT NULL,
  "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MissionChoice_missionAttemptId_fkey" FOREIGN KEY ("missionAttemptId") REFERENCES "MissionAttempt" ("id") ON DELETE CASCADE,
  CONSTRAINT "MissionChoice_decisionOptionId_fkey" FOREIGN KEY ("decisionOptionId") REFERENCES "MissionDecisionOption" ("id") ON DELETE RESTRICT,
  CONSTRAINT "MissionChoice_thinkingTrapId_fkey" FOREIGN KEY ("thinkingTrapId") REFERENCES "ThinkingTrap" ("id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "MissionChoice_thinkingTrapId_capturedAt_idx" ON "MissionChoice"("thinkingTrapId", "capturedAt");
CREATE INDEX IF NOT EXISTS "MissionChoice_missionAttemptId_capturedAt_idx" ON "MissionChoice"("missionAttemptId", "capturedAt");

CREATE TABLE IF NOT EXISTS "PackReflection" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "packId" TEXT NOT NULL,
  "teenId" TEXT NOT NULL,
  "membershipId" TEXT NOT NULL,
  "missionAttemptId" TEXT NOT NULL UNIQUE,
  "aliasId" TEXT,
  "displayAlias" TEXT NOT NULL,
  "bodyCiphertext" TEXT NOT NULL,
  "bodyPreview" TEXT,
  "branchLabel" TEXT,
  "moodTag" TEXT,
  "thinkingTrapCode" TEXT,
  "status" TEXT NOT NULL DEFAULT 'PENDING_REVIEW',
  "publishedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PackReflection_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackReflection_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackReflection_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "PackMembership" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackReflection_aliasId_fkey" FOREIGN KEY ("aliasId") REFERENCES "PackAlias" ("id") ON DELETE SET NULL,
  CONSTRAINT "PackReflection_missionAttemptId_fkey" FOREIGN KEY ("missionAttemptId") REFERENCES "MissionAttempt" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "PackReflection_packId_createdAt_idx" ON "PackReflection"("packId", "createdAt");
CREATE INDEX IF NOT EXISTS "PackReflection_packId_status_publishedAt_idx" ON "PackReflection"("packId", "status", "publishedAt");

CREATE TABLE IF NOT EXISTS "PackReaction" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "postId" TEXT NOT NULL,
  "membershipId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PackReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PackReflection" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackReaction_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "PackMembership" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackReaction_postId_membershipId_kind_key" UNIQUE("postId", "membershipId", "kind")
);

CREATE TABLE IF NOT EXISTS "PackSafetyFlag" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "postId" TEXT NOT NULL,
  "flagType" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "confidence" FLOAT,
  "detectedBy" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMP(3),
  CONSTRAINT "PackSafetyFlag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PackReflection" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "PackSafetyFlag_flagType_status_createdAt_idx" ON "PackSafetyFlag"("flagType", "status", "createdAt");

CREATE TABLE IF NOT EXISTS "PackModerationEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "postId" TEXT NOT NULL,
  "actorUserId" TEXT,
  "decision" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PackModerationEvent_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PackReflection" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "PackModerationEvent_postId_createdAt_idx" ON "PackModerationEvent"("postId", "createdAt");

CREATE TABLE IF NOT EXISTS "PackIdentityAccessAudit" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "packId" TEXT NOT NULL,
  "membershipId" TEXT,
  "actorUserId" TEXT NOT NULL,
  "approvedByUserId" TEXT,
  "reason" TEXT NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PackIdentityAccessAudit_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackIdentityAccessAudit_membershipId_fkey" FOREIGN KEY ("membershipId") REFERENCES "PackMembership" ("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "PackIdentityAccessAudit_packId_createdAt_idx" ON "PackIdentityAccessAudit"("packId", "createdAt");
CREATE INDEX IF NOT EXISTS "PackIdentityAccessAudit_actorUserId_createdAt_idx" ON "PackIdentityAccessAudit"("actorUserId", "createdAt");

CREATE TABLE IF NOT EXISTS "PackDigest" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "packId" TEXT NOT NULL,
  "audience" TEXT NOT NULL,
  "weekStart" TIMESTAMP(3) NOT NULL,
  "summary" TEXT NOT NULL,
  "topThemes" JSONB NOT NULL,
  "flaggedCount" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PackDigest_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack" ("id") ON DELETE CASCADE,
  CONSTRAINT "PackDigest_packId_audience_weekStart_key" UNIQUE("packId", "audience", "weekStart")
);

CREATE INDEX IF NOT EXISTS "PackDigest_audience_weekStart_idx" ON "PackDigest"("audience", "weekStart");

CREATE TABLE IF NOT EXISTS "InsightSnapshot" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "teenId" TEXT NOT NULL,
  "mentorId" TEXT,
  "weekStart" TIMESTAMP(3) NOT NULL,
  "topTrapCodes" TEXT[] NOT NULL,
  "trapCounts" JSONB NOT NULL,
  "parentSummary" TEXT NOT NULL,
  "sidewaysInvitation" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InsightSnapshot_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "InsightSnapshot_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile" ("id") ON DELETE SET NULL,
  CONSTRAINT "InsightSnapshot_teenId_weekStart_key" UNIQUE("teenId", "weekStart")
);

CREATE INDEX IF NOT EXISTS "InsightSnapshot_mentorId_weekStart_idx" ON "InsightSnapshot"("mentorId", "weekStart");

CREATE TABLE IF NOT EXISTS "IntakeRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "teenId" TEXT NOT NULL UNIQUE,
  "ageBand" TEXT NOT NULL,
  "primaryConcerns" TEXT[] NOT NULL,
  "householdType" TEXT NOT NULL,
  "caregiverStabilityFlag" BOOLEAN NOT NULL DEFAULT false,
  "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IntakeRecord_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IntakeRecord_ageBand_idx" ON "IntakeRecord"("ageBand");
CREATE INDEX IF NOT EXISTS "IntakeRecord_completedAt_idx" ON "IntakeRecord"("completedAt");

CREATE TABLE IF NOT EXISTS "SafetyGateResponse" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "intakeRecordId" TEXT NOT NULL UNIQUE,
  "question1Response" TEXT NOT NULL,
  "question2Response" TEXT NOT NULL,
  "question3Response" TEXT NOT NULL,
  "isFlagged" BOOLEAN NOT NULL DEFAULT false,
  "flaggedAt" TIMESTAMP(3),
  "triageDecisionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SafetyGateResponse_intakeRecordId_fkey" FOREIGN KEY ("intakeRecordId") REFERENCES "IntakeRecord" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "SafetyGateResponse_isFlagged_createdAt_idx" ON "SafetyGateResponse"("isFlagged", "createdAt");

CREATE TABLE IF NOT EXISTS "DailySignal" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "teenId" TEXT NOT NULL,
  "moodSignal" INTEGER NOT NULL,
  "freeTextNote" TEXT,
  "arcPosition" INTEGER,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "DailySignal_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "DailySignal_teenId_submittedAt_idx" ON "DailySignal"("teenId", "submittedAt");
CREATE INDEX IF NOT EXISTS "DailySignal_submittedAt_idx" ON "DailySignal"("submittedAt");

CREATE TABLE IF NOT EXISTS "ChallengeAttempt" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "teenId" TEXT NOT NULL,
  "missionArcId" TEXT,
  "submissionType" TEXT NOT NULL,
  "textContent" TEXT,
  "voiceNoteUrl" TEXT,
  "isOffline" BOOLEAN NOT NULL DEFAULT false,
  "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChallengeAttempt_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "ChallengeAttempt_teenId_submittedAt_idx" ON "ChallengeAttempt"("teenId", "submittedAt");
CREATE INDEX IF NOT EXISTS "ChallengeAttempt_submittedAt_idx" ON "ChallengeAttempt"("submittedAt");

CREATE TABLE IF NOT EXISTS "EscalationEvent" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "teenId" TEXT NOT NULL,
  "mentorId" TEXT NOT NULL,
  "severity" TEXT NOT NULL,
  "state" TEXT NOT NULL DEFAULT 'OPENED',
  "disclosurySummary" TEXT NOT NULL,
  "checklistState" JSONB,
  "clinicalPartnerId" TEXT,
  "isResolved" BOOLEAN NOT NULL DEFAULT false,
  "resolvedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EscalationEvent_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "EscalationEvent_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile" ("id") ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS "EscalationEvent_teenId_createdAt_idx" ON "EscalationEvent"("teenId", "createdAt");
CREATE INDEX IF NOT EXISTS "EscalationEvent_mentorId_state_idx" ON "EscalationEvent"("mentorId", "state");
CREATE INDEX IF NOT EXISTS "EscalationEvent_state_createdAt_idx" ON "EscalationEvent"("state", "createdAt");

CREATE TABLE IF NOT EXISTS "TriageDecision" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "escalationEventId" TEXT NOT NULL,
  "safetyGateResponseId" TEXT,
  "severity" TEXT NOT NULL,
  "assessmentNotes" TEXT,
  "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TriageDecision_escalationEventId_fkey" FOREIGN KEY ("escalationEventId") REFERENCES "EscalationEvent" ("id") ON DELETE CASCADE,
  CONSTRAINT "TriageDecision_safetyGateResponseId_fkey" FOREIGN KEY ("safetyGateResponseId") REFERENCES "SafetyGateResponse" ("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "TriageDecision_escalationEventId_idx" ON "TriageDecision"("escalationEventId");

CREATE TABLE IF NOT EXISTS "HandoverRecord" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "escalationEventId" TEXT NOT NULL,
  "clinicalPartnerName" TEXT NOT NULL,
  "clinicalPartnerEmail" TEXT NOT NULL,
  "referralLetterUrl" TEXT,
  "acceptedAt" TIMESTAMP(3),
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HandoverRecord_escalationEventId_fkey" FOREIGN KEY ("escalationEventId") REFERENCES "EscalationEvent" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "HandoverRecord_escalationEventId_idx" ON "HandoverRecord"("escalationEventId");
CREATE INDEX IF NOT EXISTS "HandoverRecord_acceptedAt_idx" ON "HandoverRecord"("acceptedAt");

CREATE TABLE IF NOT EXISTS "NotificationLog" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "escalationEventId" TEXT,
  "recipientUserId" TEXT NOT NULL,
  "channel" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "metadata" JSONB,
  "sentAt" TIMESTAMP(3),
  "readAt" TIMESTAMP(3),
  "failureReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "NotificationLog_escalationEventId_fkey" FOREIGN KEY ("escalationEventId") REFERENCES "EscalationEvent" ("id") ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS "NotificationLog_recipientUserId_createdAt_idx" ON "NotificationLog"("recipientUserId", "createdAt");
CREATE INDEX IF NOT EXISTS "NotificationLog_channel_status_idx" ON "NotificationLog"("channel", "status");
CREATE INDEX IF NOT EXISTS "NotificationLog_createdAt_idx" ON "NotificationLog"("createdAt");

CREATE TABLE IF NOT EXISTS "AlumniConversation" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "currentTeenId" TEXT NOT NULL,
  "alumniMentorId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "scheduledFor" TIMESTAMP(3),
  "completedAt" TIMESTAMP(3),
  "feedbackNotes" TEXT,
  CONSTRAINT "AlumniConversation_currentTeenId_fkey" FOREIGN KEY ("currentTeenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "AlumniConversation_alumniMentorId_fkey" FOREIGN KEY ("alumniMentorId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "AlumniConversation_currentTeenId_status_idx" ON "AlumniConversation"("currentTeenId", "status");
CREATE INDEX IF NOT EXISTS "AlumniConversation_alumniMentorId_status_idx" ON "AlumniConversation"("alumniMentorId", "status");
CREATE INDEX IF NOT EXISTS "AlumniConversation_requestedAt_idx" ON "AlumniConversation"("requestedAt");

CREATE TABLE IF NOT EXISTS "SessionBrief" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "mentorId" TEXT NOT NULL,
  "teenId" TEXT NOT NULL,
  "weekStart" TIMESTAMP(3) NOT NULL,
  "patternSummary" TEXT NOT NULL,
  "suggestedFocus" TEXT NOT NULL,
  "openingQuestion" TEXT NOT NULL,
  "challengeHighlights" JSONB,
  "dailySignalInsights" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SessionBrief_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "SessionBrief_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "SessionBrief_mentorId_teenId_weekStart_key" UNIQUE("mentorId", "teenId", "weekStart")
);

CREATE INDEX IF NOT EXISTS "SessionBrief_weekStart_idx" ON "SessionBrief"("weekStart");

CREATE TABLE IF NOT EXISTS "MentorSession" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "mentorId" TEXT NOT NULL,
  "teenId" TEXT NOT NULL,
  "scheduledFor" TIMESTAMP(3) NOT NULL,
  "completedAt" TIMESTAMP(3),
  "sessionNotes" TEXT,
  "safetyFlagsRaised" TEXT[] NOT NULL,
  "positiveShifts" TEXT,
  "escalationTriggered" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "MentorSession_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile" ("id") ON DELETE CASCADE,
  CONSTRAINT "MentorSession_teenId_fkey" FOREIGN KEY ("teenId") REFERENCES "TeenProfile" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "MentorSession_mentorId_scheduledFor_idx" ON "MentorSession"("mentorId", "scheduledFor");
CREATE INDEX IF NOT EXISTS "MentorSession_teenId_scheduledFor_idx" ON "MentorSession"("teenId", "scheduledFor");
CREATE INDEX IF NOT EXISTS "MentorSession_completedAt_idx" ON "MentorSession"("completedAt");

CREATE TABLE IF NOT EXISTS "ClinicalPartner" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "specialization" TEXT[] NOT NULL,
  "geography" TEXT[] NOT NULL,
  "isAvailable" BOOLEAN NOT NULL DEFAULT true,
  "maxCaseload" INTEGER,
  "currentCaseload" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS "ClinicalPartner_isAvailable_idx" ON "ClinicalPartner"("isAvailable");
CREATE INDEX IF NOT EXISTS "ClinicalPartner_geography_idx" ON "ClinicalPartner" USING GIN ("geography");

CREATE TABLE IF NOT EXISTS "TrainingCohort" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE INDEX IF NOT EXISTS "TrainingCohort_status_idx" ON "TrainingCohort"("status");

CREATE TABLE IF NOT EXISTS "MentorProfileExtended" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "mentorId" TEXT NOT NULL UNIQUE,
  "certificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
  "trainingCohortId" TEXT,
  "specialization" TEXT[] NOT NULL,
  "maxTeensPerSession" INTEGER NOT NULL DEFAULT 1,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "MentorProfileExtended_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "MentorProfile" ("id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "MentorProfileExtended_certificationStatus_idx" ON "MentorProfileExtended"("certificationStatus");
