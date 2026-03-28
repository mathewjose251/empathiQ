export type FamilyIssueDomain =
  | "CAREGIVER_MENTAL_HEALTH"
  | "CAREGIVER_SUBSTANCE_USE"
  | "FAMILY_CONFLICT"
  | "SEPARATION_OR_INSTABILITY"
  | "HIGH_PARENTAL_EXPECTATIONS"
  | "SELF_HARM_OR_SUICIDE_RISK"
  | "CHILD_SUBSTANCE_USE"
  | "SCREEN_OVERUSE"
  | "NUTRITION_OR_SLEEP"
  | "SCHOOL_DISENGAGEMENT"
  | "SOCIAL_COMMUNICATION"
  | "DEVELOPMENTAL_SUPPORT"
  | "YOUNG_ADULT_OUTSIDE_CORE_SCOPE";

export type CareRiskLevel = "ROUTINE" | "ELEVATED" | "URGENT" | "CRISIS";

export type WorkflowStage =
  | "INTAKE"
  | "TRIAGE"
  | "CONSENT_AND_PRIVACY"
  | "PATHWAY_ASSIGNMENT"
  | "ACTIVE_SUPPORT"
  | "REFERRAL_AND_ESCALATION"
  | "REVIEW"
  | "CLOSURE";

export type CareModule =
  | "FAMILY_INTAKE"
  | "SAFETY_AND_CRISIS"
  | "PARENT_WELLNESS"
  | "TEEN_MISSION_TRACK"
  | "ACADEMIC_PRESSURE"
  | "ROUTINE_RESET"
  | "DIGITAL_HYGIENE"
  | "SUBSTANCE_USE_SUPPORT"
  | "CONNECTEDNESS"
  | "SCHOOL_BRIDGE"
  | "MENTOR_STRATEGY"
  | "REFERRAL_FOLLOW_UP";

export type ReferralType =
  | "EMERGENCY_SERVICES"
  | "CRISIS_LINE"
  | "PRIMARY_CARE"
  | "MENTAL_HEALTH_SPECIALIST"
  | "ADDICTION_SERVICES"
  | "SCHOOL_COUNSELOR"
  | "SPEECH_LANGUAGE"
  | "NUTRITION_SUPPORT"
  | "SOCIAL_SERVICES";

export interface FamilyMemberCase {
  memberId: string;
  displayName: string;
  age: number;
  role: "TEEN" | "CHILD_UNDER_13" | "YOUNG_ADULT" | "CAREGIVER";
  domains: FamilyIssueDomain[];
  riskLevel: CareRiskLevel;
}

export interface InterventionTrack {
  memberId: string;
  modules: CareModule[];
  referrals: ReferralType[];
  goals: string[];
  reviewCadence: "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY";
}

export interface FamilyCarePlan {
  familyId: string;
  stage: WorkflowStage;
  householdRiskLevel: CareRiskLevel;
  members: FamilyMemberCase[];
  sharedProtectiveFactors: string[];
  tracks: InterventionTrack[];
}
