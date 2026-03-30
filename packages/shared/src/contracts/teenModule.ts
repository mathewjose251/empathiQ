export interface IntakeFormPayload {
  ageBand: string;
  primaryConcerns: string[];
  householdType: string;
  caregiverStabilityFlag: boolean;
}

export interface SafetyGateQuestion {
  id: number;
  text: string;
}

export interface SafetyGateResponse {
  question1Response: string;
  question2Response: string;
  question3Response: string;
  isFlagged: boolean;
}

export interface HouseholdMappingInput {
  caregiverType: string;
  homeStabilityFlag: boolean;
}

export interface ChallengeAttemptInput {
  submissionType: 'TEXT' | 'VOICE' | 'MIXED';
  textContent?: string;
  voiceNoteUrl?: string;
  isOffline: boolean;
}

export interface ChallengeAttemptPayload {
  id: string;
  teenId: string;
  missionArcId?: string;
  submissionType: string;
  textContent?: string;
  voiceNoteUrl?: string;
  isOffline: boolean;
  submittedAt: string;
}

export interface AlumniConversationRequest {
  currentTeenId: string;
  alumniMentorId: string;
}

export interface AlumniConversationPayload {
  id: string;
  currentTeenId: string;
  alumniMentorId: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED';
  requestedAt: string;
  scheduledFor?: string;
  completedAt?: string;
  feedbackNotes?: string;
}

export interface ArcProgressSnapshot {
  arcId: string;
  currentPosition: number;
  totalPosition: number;
  percentComplete: number;
  lastMissionDate: string;
}

export interface DailyCheckInInput {
  moodSignal: number;
  freeTextNote?: string;
  arcPosition?: number;
}

export interface DailyCheckInPayload {
  id: string;
  teenId: string;
  moodSignal: number;
  freeTextNote?: string;
  arcPosition?: number;
  submittedAt: string;
}
