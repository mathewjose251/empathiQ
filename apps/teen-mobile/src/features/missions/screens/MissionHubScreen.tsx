import { useState } from "react";
import { Alert } from "react-native";

import { submitAnonymousReflection, submitMissionChoice } from "../api/missions";
import { mockMission } from "../data/mockMission";
import { ChoiceForkScreen } from "./ChoiceForkScreen";
import { ReflectionScreen } from "./ReflectionScreen";
import type { MissionDecision } from "../types";

type MissionStage = "story" | "reflection";

export function MissionHubScreen() {
  const [stage, setStage] = useState<MissionStage>("story");
  const [selectedDecision, setSelectedDecision] = useState<MissionDecision | null>(
    null,
  );
  const [missionAttemptId, setMissionAttemptId] = useState<string | null>(null);
  const [reflection, setReflection] = useState("");
  const [isSubmittingChoice, setIsSubmittingChoice] = useState(false);
  const [isSubmittingReflection, setIsSubmittingReflection] = useState(false);

  const consequence = selectedDecision?.consequence ?? "";

  async function handleChoose(decision: MissionDecision) {
    try {
      setIsSubmittingChoice(true);

      const response = await submitMissionChoice({
        missionId: mockMission.id,
        decisionId: decision.id,
        thinkingTrapId: decision.thinkingTrapId,
      });

      setSelectedDecision(decision);
      setMissionAttemptId(response.missionAttemptId);
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
    } catch (error) {
      Alert.alert(
        "We couldn't post that reflection",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setIsSubmittingReflection(false);
    }
  }

  if (stage === "story") {
    return (
      <ChoiceForkScreen
        mission={mockMission}
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
