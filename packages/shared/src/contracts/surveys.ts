export type SurveyIdentityMode =
  | "ANONYMOUS"
  | "GOOGLE_ID"
  | "EMPATHIQ_ACCOUNT";

export type SurveyAudience = "TEEN" | "TWEEN" | "PARENT";

export interface TeenSurveyInput {
  identityMode: SurveyIdentityMode;
  googleId?: string;
  respondentAlias?: string;
  ageBand: string;
  mainConcerns: string[];
  pressurePoints: string[];
  homeConflictThemes: string[];
  schoolConflictThemes: string[];
  supportNeeds: string[];
  feelingWords: string[];
  openText?: string;
  followUpConsent: boolean;
}

export interface TweenSurveyInput {
  identityMode: SurveyIdentityMode;
  googleId?: string;
  respondentAlias?: string;
  ageBand: string;
  mainConcerns: string[];
  pressurePoints: string[];
  homeConflictThemes: string[];
  schoolConflictThemes: string[];
  supportNeeds: string[];
  feelingWords: string[];
  openText?: string;
  followUpConsent: boolean;
}

export interface ParentSurveyInput {
  identityMode: SurveyIdentityMode;
  googleId?: string;
  respondentAlias?: string;
  teenAgeBand: string;
  householdContext: string;
  mainConcerns: string[];
  pressurePoints: string[];
  homeConflictThemes: string[];
  schoolConflictThemes: string[];
  supportNeeds: string[];
  openText?: string;
  followUpConsent: boolean;
}

export interface SurveySubmissionResult {
  success: boolean;
  responseId: string;
  storageMode: "DATABASE" | "MEMORY";
  message: string;
}
