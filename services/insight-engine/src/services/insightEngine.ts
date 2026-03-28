import { z } from "zod";

import { config } from "../config.js";
import {
  trapDefinitions,
  type ThinkingTrapId,
} from "../domain/thinkingTraps.js";
import { openaiClient } from "../lib/openai.js";

const thinkingTrapIds = Object.keys(trapDefinitions) as [ThinkingTrapId, ...ThinkingTrapId[]];

const missionChoiceSchema = z.object({
  missionId: z.string(),
  thinkingTrapId: z.enum(thinkingTrapIds),
  completedAt: z.string().datetime(),
});

export const weeklyInsightRequestSchema = z.object({
  teenId: z.string(),
  mentorId: z.string().optional(),
  missionChoices: z.array(missionChoiceSchema).min(1),
});

export type WeeklyInsightRequest = z.infer<typeof weeklyInsightRequestSchema>;

export interface TrapCount {
  trapId: ThinkingTrapId;
  count: number;
}

export interface WeeklyInsightResponse {
  teenId: string;
  mentorId?: string;
  topTraps: TrapCount[];
  parentSummary: string;
  sidewaysInvitation: string;
}

export function detectTopThinkingTraps(
  missionChoices: WeeklyInsightRequest["missionChoices"],
): TrapCount[] {
  const counts = new Map<ThinkingTrapId, number>();

  for (const choice of missionChoices) {
    const trapId = choice.thinkingTrapId;
    counts.set(trapId, (counts.get(trapId) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([trapId, count]) => ({ trapId, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 3);
}

export async function buildParentFriendlySummary(
  topTraps: TrapCount[],
): Promise<string> {
  if (!topTraps.length) {
    return "There is not enough recent data to describe a pattern yet.";
  }

  const fallbackSummary = topTraps
    .map(({ trapId }) => trapDefinitions[trapId]?.parentFriendlySummary ?? trapId)
    .join(" ");

  if (!openaiClient) {
    return fallbackSummary;
  }

  const systemPrompt = [
    "You translate teen cognitive-pattern analytics for parents.",
    "Never address the teen directly.",
    "Use warm, plain language with no diagnosis, no surveillance framing, and no clinical jargon.",
    "Keep it to 2-3 sentences.",
  ].join(" ");

  const userPrompt = JSON.stringify({
    topTraps: topTraps.map(({ trapId, count }) => ({
      trapId,
      label: trapDefinitions[trapId]?.label ?? trapId,
      count,
      summaryHint: trapDefinitions[trapId]?.parentFriendlySummary ?? "",
    })),
  });

  const completion = await openaiClient.responses.create({
    model: config.openAiModel,
    input: `${systemPrompt}\n\nInsight payload:\n${userPrompt}`,
  });

  return completion.output_text.trim() || fallbackSummary;
}

export function suggestSidewaysInvitation(topTraps: TrapCount[]): string {
  const primaryTrap = topTraps[0]?.trapId;

  if (!primaryTrap) {
    return "Choose a gentle offline activity that creates connection without forcing a hard conversation.";
  }

  return trapDefinitions[primaryTrap]?.sidewaysInvitation
    ?? "Create a low-pressure shared activity that lets conversation happen indirectly.";
}

export async function generateWeeklyInsight(
  payload: WeeklyInsightRequest,
): Promise<WeeklyInsightResponse> {
  const topTraps = detectTopThinkingTraps(payload.missionChoices);
  const parentSummary = await buildParentFriendlySummary(topTraps);
  const sidewaysInvitation = suggestSidewaysInvitation(topTraps);

  return {
    teenId: payload.teenId,
    mentorId: payload.mentorId,
    topTraps,
    parentSummary,
    sidewaysInvitation,
  };
}
