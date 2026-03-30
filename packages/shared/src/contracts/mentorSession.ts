export interface SessionBriefPayload {
  id: string;
  mentorId: string;
  teenId: string;
  weekStart: string;
  patternSummary: string;
  suggestedFocus: string;
  openingQuestion: string;
  challengeHighlights?: Record<string, unknown>;
  dailySignalInsights?: Record<string, unknown>;
  createdAt: string;
}

export interface SessionPrepData {
  teenId: string;
  mentorId: string;
  weekStart: string;
  topThinkingTraps: Array<{
    code: string;
    label: string;
    frequency: number;
  }>;
  recentChallengeAttempts: Array<{
    id: string;
    submissionType: string;
    submittedAt: string;
  }>;
  dailySignalsSummary: {
    totalSignals: number;
    averageMood: number;
    trend: string;
  };
  previousSessionNotes?: string;
}

export interface SessionNotesInput {
  sessionId: string;
  notes: string;
  safetyFlagsRaised?: string[];
  positiveShifts?: string;
  escalationTriggered?: boolean;
}

export interface SafetyFlagInput {
  sessionId: string;
  flagType: string;
  description: string;
}

export interface SessionNotesPayload {
  id: string;
  mentorId: string;
  teenId: string;
  scheduledFor: string;
  completedAt?: string;
  sessionNotes?: string;
  safetyFlagsRaised: string[];
  positiveShifts?: string;
  escalationTriggered: boolean;
}

export interface PackOverviewPayload {
  packId: string;
  packName: string;
  memberCount: number;
  members: Array<{
    teenId: string;
    name: string;
    progressPercent: number;
    recentActivity: string;
  }>;
  cohesionIndicator: number;
  recentReflections: Array<{
    id: string;
    preview: string;
    postedAt: string;
    reactionsCount: number;
  }>;
}

export interface CohesionIndicator {
  score: number;
  interpretation: 'low' | 'moderate' | 'high' | 'excellent';
  factors: string[];
}

export interface MentorSessionPayload {
  id: string;
  mentorId: string;
  teenId: string;
  scheduledFor: string;
  completedAt?: string;
  sessionNotes?: string;
  safetyFlagsRaised: string[];
  positiveShifts?: string;
  escalationTriggered: boolean;
  createdAt: string;
  updatedAt: string;
}
