import { Pressable, Text, TextInput, View } from "react-native";

interface ReflectionScreenProps {
  consequence: string;
  reflection: string;
  isSubmitting: boolean;
  onChangeReflection: (value: string) => void;
  onSubmit: () => void;
}

export function ReflectionScreen({
  consequence,
  reflection,
  isSubmitting,
  onChangeReflection,
  onSubmit,
}: ReflectionScreenProps) {
  const isDisabled = isSubmitting || reflection.trim().length < 8;

  return (
    <View className="flex-1 bg-slate-950 px-6 py-10">
      <View className="rounded-[28px] border border-fuchsia-400/20 bg-slate-900/90 p-6">
        <Text className="text-xs font-semibold uppercase tracking-[2px] text-fuchsia-200">
          Anonymous Reflection
        </Text>
        <Text className="mt-4 text-base leading-7 text-slate-100">
          {consequence}
        </Text>
        <Text className="mt-4 text-sm leading-6 text-slate-300">
          Share one honest thought with your Pack. Your name stays hidden.
        </Text>
      </View>

      <View className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4">
        <TextInput
          multiline
          placeholder="What did this choice feel like in your body or your mind?"
          placeholderTextColor="#94a3b8"
          className="min-h-36 text-base leading-7 text-white"
          value={reflection}
          onChangeText={onChangeReflection}
          textAlignVertical="top"
        />
      </View>

      <Pressable
        className={`mt-6 items-center rounded-full px-5 py-4 ${
          isDisabled ? "bg-slate-700" : "bg-cyan-400"
        }`}
        disabled={isDisabled}
        onPress={onSubmit}
      >
        <Text className="text-base font-semibold text-slate-950">
          {isSubmitting ? "Posting..." : "Share with Pack"}
        </Text>
      </Pressable>
    </View>
  );
}
