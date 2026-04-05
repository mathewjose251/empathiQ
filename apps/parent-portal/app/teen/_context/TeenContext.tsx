"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

/* ============================================================
   EmpathiQ Teen Context
   Manages: auth, mood, XP, streaks, avatar, onboarding state
   ============================================================ */

// Avatar evolution stages
export type AvatarStage = "SEEDLING" | "SPROUT" | "SAPLING" | "TREE" | "RADIANT";

const AVATAR_THRESHOLDS: Record<AvatarStage, number> = {
  SEEDLING: 0,
  SPROUT: 500,
  SAPLING: 1000,
  TREE: 2500,
  RADIANT: 5000,
};

const AVATAR_EMOJI: Record<AvatarStage, string> = {
  SEEDLING: "\u{1F331}",
  SPROUT: "\u{1F33F}",
  SAPLING: "\u{1F333}",
  TREE: "\u{1F332}",
  RADIANT: "\u2728",
};

const AVATAR_LABELS: Record<AvatarStage, string> = {
  SEEDLING: "Seedling",
  SPROUT: "Sprout",
  SAPLING: "Sapling",
  TREE: "Tree",
  RADIANT: "Radiant",
};

export function getAvatarStage(xp: number): AvatarStage {
  if (xp >= 5000) return "RADIANT";
  if (xp >= 2500) return "TREE";
  if (xp >= 1000) return "SAPLING";
  if (xp >= 500) return "SPROUT";
  return "SEEDLING";
}

export function getNextThreshold(xp: number): number {
  const stage = getAvatarStage(xp);
  const stages: AvatarStage[] = ["SEEDLING", "SPROUT", "SAPLING", "TREE", "RADIANT"];
  const idx = stages.indexOf(stage);
  if (idx >= stages.length - 1) return 5000;
  return AVATAR_THRESHOLDS[stages[idx + 1]];
}

export function getLevel(xp: number): number {
  const stage = getAvatarStage(xp);
  const stages: AvatarStage[] = ["SEEDLING", "SPROUT", "SAPLING", "TREE", "RADIANT"];
  return stages.indexOf(stage) + 1;
}

export { AVATAR_EMOJI, AVATAR_LABELS, AVATAR_THRESHOLDS };

// Mood types
export type MoodKey = "great" | "okay" | "anxious" | "low" | "stressed" | "frustrated" | "tired" | "numb" | "sad" | "confused" | "confident";

export interface MoodOption {
  key: MoodKey;
  emoji: string;
  label: string;
  signal: number; // 1-10 scale for daily signal API
}

export const MOOD_OPTIONS_QUICK: MoodOption[] = [
  { key: "great", emoji: "\u{1F60A}", label: "Great", signal: 9 },
  { key: "okay", emoji: "\u{1F610}", label: "Okay", signal: 6 },
  { key: "anxious", emoji: "\u{1F630}", label: "Anxious", signal: 3 },
  { key: "low", emoji: "\u{1F622}", label: "Low", signal: 2 },
];

export const MOOD_OPTIONS_FULL: MoodOption[] = [
  { key: "great", emoji: "\u{1F60A}", label: "Great", signal: 9 },
  { key: "okay", emoji: "\u{1F610}", label: "Okay", signal: 6 },
  { key: "stressed", emoji: "\u{1F630}", label: "Stressed", signal: 3 },
  { key: "frustrated", emoji: "\u{1F624}", label: "Frustrated", signal: 4 },
  { key: "sad", emoji: "\u{1F622}", label: "Sad", signal: 2 },
  { key: "confused", emoji: "\u{1F914}", label: "Confused", signal: 5 },
  { key: "confident", emoji: "\u{1F60E}", label: "Confident", signal: 8 },
  { key: "tired", emoji: "\u{1F634}", label: "Tired", signal: 4 },
];

// Concern types for onboarding
export interface ConcernOption {
  key: string;
  emoji: string;
  label: string;
  missionLane: string;
}

export const CONCERN_OPTIONS: ConcernOption[] = [
  { key: "school_stress", emoji: "\u{1F4DA}", label: "School Stress", missionLane: "school" },
  { key: "friend_drama", emoji: "\u{1F465}", label: "Friend Drama", missionLane: "peer" },
  { key: "family_stuff", emoji: "\u{1F3E0}", label: "Family Stuff", missionLane: "family" },
  { key: "online_life", emoji: "\u{1F4F1}", label: "Online Life", missionLane: "digital" },
  { key: "self_image", emoji: "\u{1FA9E}", label: "How I See Me", missionLane: "self" },
  { key: "just_off", emoji: "\u{1F636}\u200D\u{1F32B}\uFE0F", label: "Just...Off", missionLane: "self" },
];

// Mission type
export interface Mission {
  slug: string;
  title: string;
  theme: string;
  description: string;
  estimatedMinutes: number;
  xpReward: number;
}

// The state shape
export interface TeenState {
  // Auth
  isOnboarded: boolean;
  teenId: string;
  authToken: string;

  // Mood
  todayMood: MoodKey | null;
  moodCheckedToday: boolean;

  // Onboarding data
  primaryConcerns: string[];
  safetyFlagged: boolean;

  // Gamification
  totalXP: number;
  currentStreak: number;
  storiesCompleted: number;
  pathARate: number;

  // Achievements
  achievements: string[];
}

interface TeenContextValue extends TeenState {
  setMood: (mood: MoodKey) => void;
  addXP: (amount: number, source: string) => void;
  completeOnboarding: (concerns: string[], safetyFlagged: boolean) => void;
  completeStory: (pathA: boolean) => void;
  incrementStreak: () => void;
  resetState: () => void;
}

const defaultState: TeenState = {
  isOnboarded: false,
  teenId: "teen-1",
  authToken: "mock-token-teen-1",
  todayMood: null,
  moodCheckedToday: false,
  primaryConcerns: [],
  safetyFlagged: false,
  totalXP: 0,
  currentStreak: 0,
  storiesCompleted: 0,
  pathARate: 0,
  achievements: [],
};

const TeenContext = createContext<TeenContextValue | null>(null);

export function TeenProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TeenState>(defaultState);

  const setMood = useCallback((mood: MoodKey) => {
    setState((prev) => ({
      ...prev,
      todayMood: mood,
      moodCheckedToday: true,
      totalXP: prev.moodCheckedToday ? prev.totalXP : prev.totalXP + 10,
    }));
  }, []);

  const addXP = useCallback((amount: number, _source: string) => {
    setState((prev) => {
      const newXP = prev.totalXP + amount;
      const newAchievements = [...prev.achievements];

      // Check for new achievements
      if (newXP >= 500 && !newAchievements.includes("first_evolution")) {
        newAchievements.push("first_evolution");
      }
      if (newXP >= 100 && !newAchievements.includes("first_100xp")) {
        newAchievements.push("first_100xp");
      }

      return { ...prev, totalXP: newXP, achievements: newAchievements };
    });
  }, []);

  const completeOnboarding = useCallback((concerns: string[], safetyFlagged: boolean) => {
    setState((prev) => ({
      ...prev,
      isOnboarded: true,
      primaryConcerns: concerns,
      safetyFlagged,
      currentStreak: 1,
    }));
  }, []);

  const completeStory = useCallback((pathA: boolean) => {
    setState((prev) => {
      const newCompleted = prev.storiesCompleted + 1;
      const pathACount = Math.round(prev.pathARate * prev.storiesCompleted / 100) + (pathA ? 1 : 0);
      const newRate = Math.round((pathACount / newCompleted) * 100);
      const xpEarned = pathA ? 30 : 15;

      const newAchievements = [...prev.achievements];
      if (newCompleted === 1 && !newAchievements.includes("first_story")) {
        newAchievements.push("first_story");
      }
      if (newCompleted >= 5 && !newAchievements.includes("five_stories")) {
        newAchievements.push("five_stories");
      }

      return {
        ...prev,
        storiesCompleted: newCompleted,
        pathARate: newRate,
        totalXP: prev.totalXP + xpEarned,
        achievements: newAchievements,
      };
    });
  }, []);

  const incrementStreak = useCallback(() => {
    setState((prev) => {
      const newStreak = prev.currentStreak + 1;
      const newAchievements = [...prev.achievements];
      let bonusXP = 0;

      if (newStreak === 7 && !newAchievements.includes("7_day_streak")) {
        newAchievements.push("7_day_streak");
        bonusXP = 50;
      }
      if (newStreak === 30 && !newAchievements.includes("30_day_streak")) {
        newAchievements.push("30_day_streak");
        bonusXP = 200;
      }

      return {
        ...prev,
        currentStreak: newStreak,
        totalXP: prev.totalXP + bonusXP,
        achievements: newAchievements,
      };
    });
  }, []);

  const resetState = useCallback(() => {
    setState(defaultState);
  }, []);

  return (
    <TeenContext.Provider
      value={{
        ...state,
        setMood,
        addXP,
        completeOnboarding,
        completeStory,
        incrementStreak,
        resetState,
      }}
    >
      {children}
    </TeenContext.Provider>
  );
}

export function useTeen(): TeenContextValue {
  const ctx = useContext(TeenContext);
  if (!ctx) throw new Error("useTeen must be used within a TeenProvider");
  return ctx;
}
