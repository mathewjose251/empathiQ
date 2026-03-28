import { ActivityIndicator, Pressable, Text, View } from "react-native";

import type { MissionDecision, MissionStory } from "../types";

interface ChoiceForkScreenProps {
  mission: MissionStory;
  isSubmitting: boolean;
  onChoose: (decision: MissionDecision) => void;
}

export function ChoiceForkScreen({
  mission,
  isSubmitting,
  onChoose,
}: ChoiceForkScreenProps) {
  return (
    <View className="flex-1 bg-slate-950 px-6 py-10">
      <View className="rounded-[28px] border border-cyan-400/20 bg-slate-900/90 p-6">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-cyan-300">
          {mission.chapterLabel}
        </Text>
        <Text className="mt-3 text-3xl font-bold text-white">{mission.title}</Text>
        <Text className="mt-5 text-base leading-7 text-slate-200">
          {mission.prompt}
        </Text>
        <View className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-100/5 p-4">
          <Text className="text-xs font-semibold uppercase tracking-[2px] text-amber-200">
            Sensory Cue
          </Text>
          <Text className="mt-2 text-sm leading-6 text-amber-50">
            {mission.atmosphere}
          </Text>
        </View>
      </View>

      <View className="mt-8 gap-4">
        {mission.decisions.map((decision, index) => (
          <Pressable
            key={decision.id}
            className={`rounded-[24px] border px-5 py-5 ${
              index === 0
                ? "border-emerald-400/40 bg-emerald-300/10"
                : "border-rose-400/40 bg-rose-300/10"
            }`}
            disabled={isSubmitting}
            onPress={() => onChoose(decision)}
          >
            <Text className="text-lg font-semibold text-white">
              Path {index + 1}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-slate-100">
              {decision.label}
            </Text>
            <Text className="mt-3 text-xs uppercase tracking-[2px] text-slate-300">
              sends `{decision.thinkingTrapId}`
            </Text>
          </Pressable>
        ))}
      </View>

      {isSubmitting ? (
        <View className="mt-6 flex-row items-center gap-3">
          <ActivityIndicator color="#67e8f9" />
          <Text className="text-sm text-cyan-100">Saving your path...</Text>
        </View>
      ) : null}
    </View>
  );
}
