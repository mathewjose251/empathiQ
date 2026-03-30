export type EscalationSeverity = 'MONITOR' | 'CLINICAL_REFERRAL' | 'EMERGENCY';
export type EscalationState =
  | 'OPENED'
  | 'SUPERVISOR_NOTIFIED'
  | 'PARENT_INFORMED'
  | 'REFERRAL_SENT'
  | 'REFERRAL_ACCEPTED'
  | 'CLOSED';

export interface EscalationEventPayload {
  id: string;
  teenId: string;
  mentorId: string;
  severity: EscalationSeverity;
  state: EscalationState;
  disclosurySummary: string;
  checklistState?: Record<string, unknown>;
  clinicalPartnerId?: string;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TriageDecisionInput {
  escalationEventId: string;
  severity: EscalationSeverity;
  assessmentNotes?: string;
}

export interface TriageDecisionPayload {
  id: string;
  escalationEventId: string;
  severity: EscalationSeverity;
  assessmentNotes?: string;
  decidedAt: string;
}

export interface HandoverRecordPayload {
  id: string;
  escalationEventId: string;
  clinicalPartnerName: string;
  clinicalPartnerEmail: string;
  referralLetterUrl?: string;
  acceptedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface EscalationChecklistStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
  scriptedLanguage?: string;
}

export interface EscalationChecklistState {
  steps: EscalationChecklistStep[];
  currentStep: number;
  completedAt?: string;
}

export interface ScriptedLanguageTemplate {
  severity: EscalationSeverity;
  mentorToStudent: string;
  mentorToParent: string;
  referralLetter: string;
}

export interface ClinicalPartnerRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization: string[];
  geography: string[];
  isAvailable: boolean;
  maxCaseload?: number;
  currentCaseload: number;
}

export interface EscalationWorkflow {
  eventId: string;
  state: EscalationState;
  transitionTo(newState: EscalationState): void;
  getNextRequiredStep(): EscalationChecklistStep;
}
