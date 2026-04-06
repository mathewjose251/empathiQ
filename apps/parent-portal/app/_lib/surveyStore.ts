import { prisma, type Prisma } from "@empathiq/database";
import type {
  ParentSurveyInput,
  SurveyAudience,
  SurveySubmissionResult,
  TeenSurveyInput,
  TweenSurveyInput,
} from "@empathiq/shared/contracts/surveys";

interface MemorySurveyResponse {
  id: string;
  audience: SurveyAudience;
  submittedAt: string;
  payload: TeenSurveyInput | TweenSurveyInput | ParentSurveyInput;
}

export interface SurveyResponseRecord {
  id: string;
  audience: SurveyAudience;
  storageMode: "MEMORY" | "DATABASE";
  identityMode: "ANONYMOUS" | "GOOGLE_ID" | "EMPATHIQ_ACCOUNT";
  respondentLabel: string;
  ageBand: string | null;
  teenAgeBand: string | null;
  householdContext: string | null;
  mainConcerns: string[];
  pressurePoints: string[];
  homeConflictThemes: string[];
  schoolConflictThemes: string[];
  supportNeeds: string[];
  feelingWords: string[];
  openText: string | null;
  followUpConsent: boolean;
  createdAt: string;
}

export interface SurveyDashboardData {
  storageMode: "MEMORY" | "DATABASE";
  totalResponses: number;
  teenResponses: number;
  tweenResponses: number;
  parentResponses: number;
  topConcerns: Array<{ label: string; count: number }>;
  topHomeConflicts: Array<{ label: string; count: number }>;
  topSchoolConflicts: Array<{ label: string; count: number }>;
  responses: SurveyResponseRecord[];
}

const MEMORY_RESPONSES: MemorySurveyResponse[] = [];

function hasDatabaseStorage() {
  return Boolean(process.env.DATABASE_URL);
}

function cleanList(values: string[], limit = 8) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].slice(
    0,
    limit,
  );
}

function cleanText(value: string | undefined, limit = 1200) {
  return value?.trim().slice(0, limit) || null;
}

function memoryResponse(
  audience: SurveyAudience,
  payload: TeenSurveyInput | TweenSurveyInput | ParentSurveyInput,
): SurveySubmissionResult {
  const responseId = `memory-${audience.toLowerCase()}-${Date.now()}`;
  MEMORY_RESPONSES.unshift({
    id: responseId,
    audience,
    submittedAt: new Date().toISOString(),
    payload,
  });

  return {
    success: true,
    responseId,
    storageMode: "MEMORY",
    message:
      "Saved in preview mode. Connect a PostgreSQL database to persist survey responses across restarts.",
  };
}

function toTeenAnswers(input: TeenSurveyInput): Prisma.InputJsonValue {
  return {
    ageBand: input.ageBand,
    mainConcerns: cleanList(input.mainConcerns),
    pressurePoints: cleanList(input.pressurePoints),
    homeConflictThemes: cleanList(input.homeConflictThemes),
    schoolConflictThemes: cleanList(input.schoolConflictThemes),
    supportNeeds: cleanList(input.supportNeeds),
    feelingWords: cleanList(input.feelingWords),
    openText: cleanText(input.openText),
    followUpConsent: input.followUpConsent,
    identityMode: input.identityMode,
    googleId: cleanText(input.googleId, 320),
    respondentAlias: cleanText(input.respondentAlias, 120),
  };
}

function toTweenAnswers(input: TweenSurveyInput): Prisma.InputJsonValue {
  return {
    ageBand: input.ageBand,
    mainConcerns: cleanList(input.mainConcerns),
    pressurePoints: cleanList(input.pressurePoints),
    homeConflictThemes: cleanList(input.homeConflictThemes),
    schoolConflictThemes: cleanList(input.schoolConflictThemes),
    supportNeeds: cleanList(input.supportNeeds),
    feelingWords: cleanList(input.feelingWords),
    openText: cleanText(input.openText),
    followUpConsent: input.followUpConsent,
    identityMode: input.identityMode,
    googleId: cleanText(input.googleId, 320),
    respondentAlias: cleanText(input.respondentAlias, 120),
  };
}

function toParentAnswers(input: ParentSurveyInput): Prisma.InputJsonValue {
  return {
    teenAgeBand: input.teenAgeBand,
    householdContext: input.householdContext,
    mainConcerns: cleanList(input.mainConcerns),
    pressurePoints: cleanList(input.pressurePoints),
    homeConflictThemes: cleanList(input.homeConflictThemes),
    schoolConflictThemes: cleanList(input.schoolConflictThemes),
    supportNeeds: cleanList(input.supportNeeds),
    openText: cleanText(input.openText),
    followUpConsent: input.followUpConsent,
    identityMode: input.identityMode,
    googleId: cleanText(input.googleId, 320),
    respondentAlias: cleanText(input.respondentAlias, 120),
  };
}

function maskIdentity(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  if (!value.includes("@")) {
    if (value.length <= 6) {
      return `${value.slice(0, 2)}***`;
    }

    return `${value.slice(0, 3)}***${value.slice(-2)}`;
  }

  const [local, domain] = value.split("@");
  const safeLocal =
    local.length <= 2 ? `${local.slice(0, 1)}***` : `${local.slice(0, 2)}***`;

  return `${safeLocal}@${domain}`;
}

function makeRespondentLabel(
  identityMode: SurveyResponseRecord["identityMode"],
  respondentAlias: string | null | undefined,
  googleId: string | null | undefined,
  linkedId: string | null | undefined,
) {
  if (respondentAlias) {
    return respondentAlias;
  }

  if (identityMode === "GOOGLE_ID") {
    return maskIdentity(googleId) ?? "Google-linked respondent";
  }

  if (identityMode === "EMPATHIQ_ACCOUNT") {
    return linkedId ?? "Linked EmpathiQ account";
  }

  return "Anonymous";
}

function fromMemoryResponse(response: MemorySurveyResponse): SurveyResponseRecord {
  const payload = response.payload;
  const feelingWords =
    (response.audience === "TEEN" || response.audience === "TWEEN") &&
    "feelingWords" in payload
      ? cleanList(payload.feelingWords)
      : [];

  return {
    id: response.id,
    audience: response.audience,
    storageMode: "MEMORY",
    identityMode: payload.identityMode,
    respondentLabel: makeRespondentLabel(
      payload.identityMode,
      payload.respondentAlias ?? null,
      payload.googleId ?? null,
      null,
    ),
    ageBand: "ageBand" in payload ? payload.ageBand : null,
    teenAgeBand: "teenAgeBand" in payload ? payload.teenAgeBand : null,
    householdContext:
      "householdContext" in payload ? payload.householdContext : null,
    mainConcerns: cleanList(payload.mainConcerns),
    pressurePoints: cleanList(payload.pressurePoints),
    homeConflictThemes: cleanList(payload.homeConflictThemes),
    schoolConflictThemes: cleanList(payload.schoolConflictThemes),
    supportNeeds: cleanList(payload.supportNeeds),
    feelingWords,
    openText: cleanText(payload.openText),
    followUpConsent: payload.followUpConsent,
    createdAt: response.submittedAt,
  };
}

function countTopValues(
  responses: SurveyResponseRecord[],
  key:
    | "mainConcerns"
    | "homeConflictThemes"
    | "schoolConflictThemes",
  limit = 6,
) {
  const counts = new Map<string, number>();

  responses.forEach((response) => {
    response[key].forEach((value) => {
      counts.set(value, (counts.get(value) ?? 0) + 1);
    });
  });

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export async function getSurveyDashboardData(): Promise<SurveyDashboardData> {
  const responses = hasDatabaseStorage()
    ? (
        await prisma.familySurveyResponse.findMany({
          orderBy: {
            createdAt: "desc",
          },
          take: 40,
          select: {
            id: true,
            audience: true,
            identityMode: true,
            teenId: true,
            parentId: true,
            googleId: true,
            respondentAlias: true,
            ageBand: true,
            teenAgeBand: true,
            householdContext: true,
            mainConcerns: true,
            pressurePoints: true,
            homeConflictThemes: true,
            schoolConflictThemes: true,
            supportNeeds: true,
            feelingWords: true,
            openText: true,
            followUpConsent: true,
            createdAt: true,
          },
        })
      ).map((response) => ({
        id: response.id,
        audience: response.audience,
        storageMode: "DATABASE" as const,
        identityMode: response.identityMode,
        respondentLabel: makeRespondentLabel(
          response.identityMode,
          response.respondentAlias,
          response.googleId,
          response.teenId ?? response.parentId,
        ),
        ageBand: response.ageBand,
        teenAgeBand: response.teenAgeBand,
        householdContext: response.householdContext,
        mainConcerns: response.mainConcerns,
        pressurePoints: response.pressurePoints,
        homeConflictThemes: response.homeConflictThemes,
        schoolConflictThemes: response.schoolConflictThemes,
        supportNeeds: response.supportNeeds,
        feelingWords: response.feelingWords,
        openText: response.openText,
        followUpConsent: response.followUpConsent,
        createdAt: response.createdAt.toISOString(),
      }))
    : MEMORY_RESPONSES.map(fromMemoryResponse);

  const teenResponses = responses.filter((response) => response.audience === "TEEN").length;
  const tweenResponses = responses.filter((response) => response.audience === "TWEEN").length;
  const parentResponses = responses.filter((response) => response.audience === "PARENT").length;

  return {
    storageMode: hasDatabaseStorage() ? "DATABASE" : "MEMORY",
    totalResponses: responses.length,
    teenResponses,
    tweenResponses,
    parentResponses,
    topConcerns: countTopValues(responses, "mainConcerns"),
    topHomeConflicts: countTopValues(responses, "homeConflictThemes"),
    topSchoolConflicts: countTopValues(responses, "schoolConflictThemes"),
    responses,
  };
}

export async function submitTeenSurvey(
  input: TeenSurveyInput,
  teenId?: string,
): Promise<SurveySubmissionResult> {
  if (!hasDatabaseStorage()) {
    return memoryResponse("TEEN", input);
  }

  const response = await prisma.familySurveyResponse.create({
    data: {
      audience: "TEEN",
      identityMode: input.identityMode,
      teenId: teenId ?? null,
      googleId: cleanText(input.googleId, 320),
      respondentAlias: cleanText(input.respondentAlias, 120),
      ageBand: input.ageBand,
      mainConcerns: cleanList(input.mainConcerns),
      pressurePoints: cleanList(input.pressurePoints),
      homeConflictThemes: cleanList(input.homeConflictThemes),
      schoolConflictThemes: cleanList(input.schoolConflictThemes),
      supportNeeds: cleanList(input.supportNeeds),
      feelingWords: cleanList(input.feelingWords),
      openText: cleanText(input.openText),
      followUpConsent: input.followUpConsent,
      answers: toTeenAnswers(input),
    },
  });

  return {
    success: true,
    responseId: response.id,
    storageMode: "DATABASE",
    message:
      "Teen survey saved. This response can now inform intake, mission recommendations, and mentor context.",
  };
}

export async function submitTweenSurvey(
  input: TweenSurveyInput,
): Promise<SurveySubmissionResult> {
  if (!hasDatabaseStorage()) {
    return memoryResponse("TWEEN", input);
  }

  const response = await prisma.familySurveyResponse.create({
    data: {
      audience: "TWEEN",
      identityMode: input.identityMode,
      teenId: null,
      googleId: cleanText(input.googleId, 320),
      respondentAlias: cleanText(input.respondentAlias, 120),
      ageBand: input.ageBand,
      mainConcerns: cleanList(input.mainConcerns),
      pressurePoints: cleanList(input.pressurePoints),
      homeConflictThemes: cleanList(input.homeConflictThemes),
      schoolConflictThemes: cleanList(input.schoolConflictThemes),
      supportNeeds: cleanList(input.supportNeeds),
      feelingWords: cleanList(input.feelingWords),
      openText: cleanText(input.openText),
      followUpConsent: input.followUpConsent,
      answers: toTweenAnswers(input),
    },
  });

  return {
    success: true,
    responseId: response.id,
    storageMode: "DATABASE",
    message:
      "Tween check-in saved. This can now shape gentler routines, family support, and age-fit follow-up.",
  };
}

export async function submitParentSurvey(
  input: ParentSurveyInput,
  parentId?: string,
): Promise<SurveySubmissionResult> {
  if (!hasDatabaseStorage()) {
    return memoryResponse("PARENT", input);
  }

  const response = await prisma.familySurveyResponse.create({
    data: {
      audience: "PARENT",
      identityMode: input.identityMode,
      parentId: parentId ?? null,
      googleId: cleanText(input.googleId, 320),
      respondentAlias: cleanText(input.respondentAlias, 120),
      teenAgeBand: input.teenAgeBand,
      householdContext: input.householdContext,
      mainConcerns: cleanList(input.mainConcerns),
      pressurePoints: cleanList(input.pressurePoints),
      homeConflictThemes: cleanList(input.homeConflictThemes),
      schoolConflictThemes: cleanList(input.schoolConflictThemes),
      supportNeeds: cleanList(input.supportNeeds),
      feelingWords: [],
      openText: cleanText(input.openText),
      followUpConsent: input.followUpConsent,
      answers: toParentAnswers(input),
    },
  });

  return {
    success: true,
    responseId: response.id,
    storageMode: "DATABASE",
    message:
      "Parent survey saved. This response can now shape family patterns, mentor context, and workshop planning.",
  };
}
