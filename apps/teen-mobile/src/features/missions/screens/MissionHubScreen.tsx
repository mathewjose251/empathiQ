import { useEffect, useState } from "react";
import { Alert, ActivityIndicator, View, Text } from "react-native";

import {
  submitAnonymousReflection,
  completeMissionAttempt,
  startMissionAttempt,
  fetchMissionBySlug,
} from "../api/missions";
import { mockMission } from "../data/mockMission";
import { ChoiceForkScreen } from "./ChoiceForkScreen";
import { ReflectionScreen } from "./ReflectionScreen";
import type { MissionDecision, MissionStory } from "../types";

type MissionStage = "loading" | "story" | "reflection";

export function MissionHubScreen() {
  const [stage, setStage] = useState<MissionStage>("loading");
  const [mission, setMission] = useState<MissionStory | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<MissionDecision | null>(null);
  const [missionAttemptId, setMissionAttemptId] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [isSubmittingChoice, setIsSubmittingChoice] = useState(false);
  const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);

  const consequence = selectedDecision?.consequence ?? "";

  // Load mission on mount (Phase 1: use first mission as default)
  useEffect(() => {
    async function loadMission() {
      try {
        // In Phase 1, hardcode to "night-before-finals"
        // In Phase 2, this will be dynamically recommended
        const loadedMission = await fetchMissionBySlug("night-before-finals");
        setMission(loadedMission);
        setStage("story");
      } catch (error) {
        Alert.alert(
          "Could not load mission",
          error instanceof Error ? error.message : "Please try again.",
          [
            {
              text: "Use mock data",
              onPress: () => {
                setMission(mockMission);
                setStage("story");
              },
            },
            {
              text: "Exit",
            },
          ]
        );
      }
    }

    loadMission();
  }, []);

  async function handleChoose(decision: MissionDecision) {
    if (!mission) {
      Alert.alert("Error", "Mission not loaded");
      return;
    }

    try {
      setIsSubmittingChoice(true);

      // Step 1: Start a new attempt
      const attemptResponse = await startMissionAttempt(mission.slug || "");
      const newAttemptId = attemptResponse.missionAttemptId;

      // Step 2: Complete the attempt with the choice
      await completeMissionAttempt(mission.slug || "", {
        missionAttemptId: newAttemptId,
        decisionOptionId: decision.id,
        thinkingTrapId: decision.thinkingTrapId,
      });

      setSelectedDecision(decision);
      setMissionAttemptId(newAttemptId);
      setStage("reflection");
    } catch (error) {
      Alert.alert(
        "We couldn't save that choice",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmittingChoice(false);
    }
  }

  async function handleSubmitReflection() {
    if (!missionAttemptId) {
      Alert.alert("Missing mission attempt", "Choose a path before reflecting.");
      return;
    }

    try {
      setIsSubmittingReflection(true);

      await submitAnonymousReflection({
        missionAttemptId,
        body: reflection.trim(),
      });

      Alert.alert("Shared anonymously", "Your Pack can now read your reflection.");
      setReflection("");

      // Reset for next mission (Phase 2: show recommendation)
      setSelectedDecision(null);
      setMissionAttemptId(null);
      setStage("story");
    } catch (error) {
      Alert.alert(
        "We couldn't post that reflection",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmittingReflection(false);
    }
  }

  if (stage === "loading") {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center">
        <ActivityIndicator size="large" color="#67e8f9" />
        <Text className="mt-4 text-slate-200">Loading mission...</Text>
      </View>
    );
  }

  if (!mission) {
    return (
      <View className="flex-1 bg-slate-950 items-center justify-center px-6">
        <Text className="text-white text-lg">Mission failed to load</Text>
      </View>
    );
  }

  if (stage === "story") {
    return (
      <ChoiceForkScreen
        mission={mission}
        isSubmitting={isSubmittingChoice}
        onChoose={handleChoose}
      />
    );
  }

  return (
    <ReflectionScreen
      consequence={consequence}
      reflection={reflection}
      isSubmitting={isSubmittingReflection}
      onChangeReflection={setReflection}
      onSubmit={handleSubmitReflection}
    />
  );
}
