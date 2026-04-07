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

export interface AggregateItem {
  label: string;
  count: number;
  pct: number; // percentage of respondents who picked this (0–100)
}

export interface SurveyDashboardData {
  storageMode: "MEMORY" | "DATABASE";
  totalResponses: number;
  teenResponses: number;
  tweenResponses: number;
  parentResponses: number;
  followUpConsentCount: number;
  topConcerns: AggregateItem[];
  topPressurePoints: AggregateItem[];
  topHomeConflicts: AggregateItem[];
  topSchoolConflicts: AggregateItem[];
  topSupportNeeds: AggregateItem[];
  topFeelingWords: AggregateItem[];
}

export interface SurveyResponsePage {
  responses: SurveyResponseRecord[];
  total: number;
  page: number;
  pageSize: number;
}

const MEMORY_RESPONSES: MemorySurveyResponse[] = [];

function hasDatabaseStorage() {
  return Boolean(process.env.DATABASE_URL);
}

function cleanList(values: string[], limit = 8) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))].slice(0, limit);
}

function cleanText(value: string | undefined, limit = 1200) {
  return value?.trim().slice(0, limit) || null;
}

function memoryResponse(
  audience: SurveyAudience,
  payload: TeenSurveyInput | TweenSurveyInput | ParentSurveyInput,
): SurveySubmissionResult {
  const responseId = `memory-${audience.toLowerCase()}-${Date.now()}`;
  MEMORY_RESPONSES.unshift({ id: responseId, audience, submittedAt: new Date().toISOString(), payload });
  return {
    success: true,
    responseId,
    storageMode: "MEMORY",
    message: "Saved in preview mode. Connect a PostgreSQL database to persist survey responses across restarts.",
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
  if (!value) return null;
  if (!value.includes("@")) {
    if (value.length <= 6) return `${value.slice(0, 2)}***`;
    return `${value.slice(0, 3)}***${value.slice(-2)}`;
  }
  const [local, domain] = value.split("@");
  const safeLocal = local.length <= 2 ? `${local.slice(0, 1)}***` : `${local.slice(0, 2)}***`;
  return `${safeLocal}@${domain}`;
}

function makeRespondentLabel(
  identityMode: SurveyResponseRecord["identityMode"],
  respondentAlias: string | null | undefined,
  googleId: string | null | undefined,
  linkedId: string | null | undefined,
) {
  if (respondentAlias) return respondentAlias;
  if (identityMode === "GOOGLE_ID") return maskIdentity(googleId) ?? "Google-linked respondent";
  if (identityMode === "EMPATHIQ_ACCOUNT") return linkedId ?? "Linked EmpathiQ account";
  return "Anonymous";
}

function fromMemoryResponse(response: MemorySurveyResponse): SurveyResponseRecord {
  const payload = response.payload;
  const feelingWords =
    (response.audience === "TEEN" || response.audience === "TWEEN") && "feelingWords" in payload
      ? cleanList(payload.feelingWords)
      : [];
  return {
    id: response.id,
    audience: response.audience,
    storageMode: "MEMORY",
    identityMode: payload.identityMode,
    respondentLabel: makeRespondentLabel(payload.identityMode, payload.respondentAlias ?? null, payload.googleId ?? null, null),
    ageBand: "ageBand" in payload ? payload.ageBand : null,
    teenAgeBand: "teenAgeBand" in payload ? payload.teenAgeBand : null,
    householdContext: "householdContext" in payload ? payload.householdContext : null,
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

type AggKey = keyof Pick<SurveyResponseRecord, "mainConcerns" | "pressurePoints" | "homeConflictThemes" | "schoolConflictThemes" | "supportNeeds" | "feelingWords">;

function countTop(rows: Array<Record<string, string[]>>, key: string, total: number, limit = 10): AggregateItem[] {
  const counts = new Map<string, number>();
  for (const r of rows) {
    for (const v of (r[key] ?? [])) {
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([label, count]) => ({ label, count, pct: total > 0 ? Math.round((count / total) * 100) : 0 }));
}

const DB_SELECT = {
  id: true, audience: true, identityMode: true, teenId: true, parentId: true,
  googleId: true, respondentAlias: true, ageBand: true, teenAgeBand: true,
  householdContext: true, mainConcerns: true, pressurePoints: true,
  homeConflictThemes: true, schoolConflictThemes: true, supportNeeds: true,
  feelingWords: true, openText: true, followUpConsent: true, createdAt: true,
} as const;

function toRecord(r: {
  id: string; audience: string; identityMode: string;
  teenId: string | null; parentId: string | null; googleId: string | null;
  respondentAlias: string | null; ageBand: string | null; teenAgeBand: string | null;
  householdContext: string | null; mainConcerns: string[]; pressurePoints: string[];
  homeConflictThemes: string[]; schoolConflictThemes: string[]; supportNeeds: string[];
  feelingWords: string[]; openText: string | null; followUpConsent: boolean; createdAt: Date;
}): SurveyResponseRecord {
  return {
    id: r.id,
    audience: r.audience as SurveyAudience,
    storageMode: "DATABASE",
    identityMode: r.identityMode as SurveyResponseRecord["identityMode"],
    respondentLabel: makeRespondentLabel(r.identityMode as SurveyResponseRecord["identityMode"], r.respondentAlias, r.googleId, r.teenId ?? r.parentId),
    ageBand: r.ageBand,
    teenAgeBand: r.teenAgeBand,
    householdContext: r.householdContext,
    mainConcerns: r.mainConcerns,
    pressurePoints: r.pressurePoints,
    homeConflictThemes: r.homeConflictThemes,
    schoolConflictThemes: r.schoolConflictThemes,
    supportNeeds: r.supportNeeds,
    feelingWords: r.feelingWords,
    openText: r.openText,
    followUpConsent: r.followUpConsent,
    createdAt: r.createdAt.toISOString(),
  };
}

// ─── Aggregate dashboard — no row cap, only the array fields needed ─────────
export async function getSurveyDashboardData(): Promise<SurveyDashboardData> {
  if (hasDatabaseStorage()) {
    const [grouped, aggRows] = await Promise.all([
      prisma.familySurveyResponse.groupBy({ by: ["audience"], _count: { _all: true } }),
      prisma.familySurveyResponse.findMany({
        select: { audience: true, mainConcerns: true, pressurePoints: true, homeConflictThemes: true, schoolConflictThemes: true, supportNeeds: true, feelingWords: true, followUpConsent: true },
      }),
    ]);

    const total = aggRows.length;
    const rows = aggRows as unknown as Array<Record<string, string[]> & { followUpConsent: boolean }>;

    return {
      storageMode: "DATABASE",
      totalResponses: total,
      teenResponses: grouped.find((g) => g.audience === "TEEN")?._count._all ?? 0,
      tweenResponses: grouped.find((g) => g.audience === "TWEEN")?._count._all ?? 0,
      parentResponses: grouped.find((g) => g.audience === "PARENT")?._count._all ?? 0,
      followUpConsentCount: rows.filter((r) => r.followUpConsent).length,
      topConcerns: countTop(rows, "mainConcerns", total),
      topPressurePoints: countTop(rows, "pressurePoints", total),
      topHomeConflicts: countTop(rows, "homeConflictThemes", total),
      topSchoolConflicts: countTop(rows, "schoolConflictThemes", total),
      topSupportNeeds: countTop(rows, "supportNeeds", total),
      topFeelingWords: countTop(rows, "feelingWords", total),
    };
  }

  const all = MEMORY_RESPONSES.map(fromMemoryResponse);
  const total = all.length;
  const rows = all as unknown as Array<Record<string, string[]> & { followUpConsent: boolean }>;
  return {
    storageMode: "MEMORY",
    totalResponses: total,
    teenResponses: all.filter((r) => r.audience === "TEEN").length,
    tweenResponses: all.filter((r) => r.audience === "TWEEN").length,
    parentResponses: all.filter((r) => r.audience === "PARENT").length,
    followUpConsentCount: all.filter((r) => r.followUpConsent).length,
    topConcerns: countTop(rows, "mainConcerns", total),
    topPressurePoints: countTop(rows, "pressurePoints", total),
    topHomeConflicts: countTop(rows, "homeConflictThemes", total),
    topSchoolConflicts: countTop(rows, "schoolConflictThemes", total),
    topSupportNeeds: countTop(rows, "supportNeeds", total),
    topFeelingWords: countTop(rows, "feelingWords", total),
  };
}

// ─── Paginated response table ─────────────────────────────────────────────
export async function getSurveyResponsePage(
  page: number,
  pageSize: number,
  audience?: string,
): Promise<SurveyResponsePage> {
  const validAudiences = ["TEEN", "TWEEN", "PARENT"] as const;
  type ValidAudience = typeof validAudiences[number];
  const filteredAudience = validAudiences.includes(audience as ValidAudience) ? (audience as ValidAudience) : undefined;
  const where = filteredAudience ? { audience: filteredAudience } : undefined;

  if (hasDatabaseStorage()) {
    const [rows, total] = await Promise.all([
      prisma.familySurveyResponse.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: page * pageSize,
        take: pageSize,
        select: DB_SELECT,
      }),
      prisma.familySurveyResponse.count({ where }),
    ]);
    return { responses: rows.map(toRecord), total, page, pageSize };
  }

  const all = MEMORY_RESPONSES.map(fromMemoryResponse).filter((r) => !where || r.audience === audience);
  return {
    responses: all.slice(page * pageSize, page * pageSize + pageSize),
    total: all.length,
    page,
    pageSize,
  };
}

// ─── Submit functions (unchanged) ────────────────────────────────────────
export async function submitTeenSurvey(input: TeenSurveyInput, teenId?: string): Promise<SurveySubmissionResult> {
  if (!hasDatabaseStorage()) return memoryResponse("TEEN", input);
  const response = await prisma.familySurveyResponse.create({
    data: {
      audience: "TEEN", identityMode: input.identityMode, teenId: teenId ?? null,
      googleId: cleanText(input.googleId, 320), respondentAlias: cleanText(input.respondentAlias, 120),
      ageBand: input.ageBand, mainConcerns: cleanList(input.mainConcerns),
      pressurePoints: cleanList(input.pressurePoints), homeConflictThemes: cleanList(input.homeConflictThemes),
      schoolConflictThemes: cleanList(input.schoolConflictThemes), supportNeeds: cleanList(input.supportNeeds),
      feelingWords: cleanList(input.feelingWords), openText: cleanText(input.openText),
      followUpConsent: input.followUpConsent, answers: toTeenAnswers(input),
    },
  });
  return { success: true, responseId: response.id, storageMode: "DATABASE", message: "Teen survey saved. This response can now inform intake, mission recommendations, and mentor context." };
}

export async function submitTweenSurvey(input: TweenSurveyInput): Promise<SurveySubmissionResult> {
  if (!hasDatabaseStorage()) return memoryResponse("TWEEN", input);
  const response = await prisma.familySurveyResponse.create({
    data: {
      audience: "TWEEN", identityMode: input.identityMode, teenId: null,
      googleId: cleanText(input.googleId, 320), respondentAlias: cleanText(input.respondentAlias, 120),
      ageBand: input.ageBand, mainConcerns: cleanList(input.mainConcerns),
      pressurePoints: cleanList(input.pressurePoints), homeConflictThemes: cleanList(input.homeConflictThemes),
      schoolConflictThemes: cleanList(input.schoolConflictThemes), supportNeeds: cleanList(input.supportNeeds),
      feelingWords: cleanList(input.feelingWords), openText: cleanText(input.openText),
      followUpConsent: input.followUpConsent, answers: toTweenAnswers(input),
    },
  });
  return { success: true, responseId: response.id, storageMode: "DATABASE", message: "Tween check-in saved. This can now shape gentler routines, family support, and age-fit follow-up." };
}

export async function submitParentSurvey(input: ParentSurveyInput, parentId?: string): Promise<SurveySubmissionResult> {
  if (!hasDatabaseStorage()) return memoryResponse("PARENT", input);
  const response = await prisma.familySurveyResponse.create({
    data: {
      audience: "PARENT", identityMode: input.identityMode, parentId: parentId ?? null,
      googleId: cleanText(input.googleId, 320), respondentAlias: cleanText(input.respondentAlias, 120),
      teenAgeBand: input.teenAgeBand, householdContext: input.householdContext,
      mainConcerns: cleanList(input.mainConcerns), pressurePoints: cleanList(input.pressurePoints),
      homeConflictThemes: cleanList(input.homeConflictThemes), schoolConflictThemes: cleanList(input.schoolConflictThemes),
      supportNeeds: cleanList(input.supportNeeds), feelingWords: [],
      openText: cleanText(input.openText), followUpConsent: input.followUpConsent,
      answers: toParentAnswers(input),
    },
  });
  return { success: true, responseId: response.id, storageMode: "DATABASE", message: "Parent survey saved. This response can now shape family patterns, mentor context, and workshop planning." };
}
