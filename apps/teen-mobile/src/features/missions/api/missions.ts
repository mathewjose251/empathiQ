import type {
  MissionChoiceSubmission,
  ReflectionSubmission,
  MissionStory,
} from "../types";

// Configuration for Phase 1 (dev mode with mock auth)
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";
const MOCK_AUTH_TOKEN = process.env.EXPO_PUBLIC_MOCK_AUTH_TOKEN || "mock-token-teen-1";

interface MissionChoiceResponse {
  missionAttemptId: string;
}

interface MissionListResponse {
  status: string;
  data: MissionStory[];
  count: number;
}

interface MissionDetailResponse {
  status: string;
  data: MissionStory;
}

interface AttemptResponse {
  status: string;
  data: {
    missionAttemptId: string;
    startedAt: string;
  };
}

interface CompleteResponse {
  status: string;
  data: {
    missionChoiceId: string;
    missionAttemptId: string;
    completedAt: string;
  };
}

/**
 * Get all available missions
 */
export async function fetchMissions(): Promise<MissionStory[]> {
  const response = await fetch(`${API_BASE}/api/teen/missions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MOCK_AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Unable to fetch missions.");
  }

  const data = (await response.json()) as MissionListResponse;
  return data.data;
}

/**
 * Get a single mission by slug
 */
export async function fetchMissionBySlug(slug: string): Promise<MissionStory> {
  const response = await fetch(`${API_BASE}/api/teen/missions/${slug}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MOCK_AUTH_TOKEN}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Unable to fetch mission.");
  }

  const data = (await response.json()) as MissionDetailResponse;
  return data.data;
}

/**
 * Start a new mission attempt
 */
export async function startMissionAttempt(
  missionSlug: string
): Promise<{ missionAttemptId: string }> {
  const response = await fetch(
    `${API_BASE}/api/teen/missions/${missionSlug}/attempt`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MOCK_AUTH_TOKEN}`,
      },
      body: JSON.stringify({}),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Unable to start mission.");
  }

  const data = (await response.json()) as AttemptResponse;
  return {
    missionAttemptId: data.data.missionAttemptId,
  };
}

/**
 * Submit a mission choice and complete the attempt
 * @deprecated Use startMissionAttempt + completeMissionAttempt instead
 */
export async function submitMissionChoice(
  payload: MissionChoiceSubmission
): Promise<MissionChoiceResponse> {
  // Legacy endpoint - this is now a two-step process:
  // 1. startMissionAttempt() to create the attempt
  // 2. completeMissionAttempt() to record the choice
  throw new Error(
    "Use startMissionAttempt() + completeMissionAttempt() instead"
  );
}

/**
 * Complete a mission attempt with the teen's choice
 */
export async function completeMissionAttempt(
  missionSlug: string,
  payload: {
    missionAttemptId: string;
    decisionOptionId: string;
    thinkingTrapId: string;
  }
): Promise<{ missionChoiceId: string; missionAttemptId: string }> {
  const response = await fetch(
    `${API_BASE}/api/teen/missions/${missionSlug}/complete`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MOCK_AUTH_TOKEN}`,
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Unable to save mission choice.");
  }

  const data = (await response.json()) as CompleteResponse;
  return {
    missionChoiceId: data.data.missionChoiceId,
    missionAttemptId: data.data.missionAttemptId,
  };
}

export async function submitAnonymousReflection(
  payload: ReflectionSubmission,
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/pack/reflections`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${MOCK_AUTH_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to post reflection.");
  }
}
