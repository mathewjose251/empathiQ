export interface DailySignalInput {
  moodSignal: number;
  freeTextNote?: string;
  arcPosition?: number;
}

export interface DailySignalPayload {
  id: string;
  teenId: string;
  moodSignal: number;
  freeTextNote?: string;
  arcPosition?: number;
  submittedAt: string;
}

export interface MoodEntry {
  value: number;
  label: string;
  color: string;
}

export interface CheckinSummary {
  totalCheckinsThisWeek: number;
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  notesHighlights: string[];
}

export interface ArcProgressSnapshot {
  arcId: string;
  arcName: string;
  currentPosition: number;
  totalPosition: number;
  percentComplete: number;
  lastMissionDate: string;
  nextMissionAvailable: boolean;
}

export interface PuckNudge {
  id: string;
  message: string;
  type: 'encouragement' | 'reminder' | 'milestone' | 'invitation';
  actionUrl?: string;
}
