import type {
  MissionChoiceSubmission,
  ReflectionSubmission,
} from "../types";

interface MissionChoiceResponse {
  missionAttemptId: string;
}

export async function submitMissionChoice(
  payload: MissionChoiceSubmission,
): Promise<MissionChoiceResponse> {
  const response = await fetch("https://api.empathiq.app/missions/choices", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to save mission choice.");
  }

  return response.json() as Promise<MissionChoiceResponse>;
}

export async function submitAnonymousReflection(
  payload: ReflectionSubmission,
): Promise<void> {
  const response = await fetch("https://api.empathiq.app/pack/reflections", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to post reflection.");
  }
}
