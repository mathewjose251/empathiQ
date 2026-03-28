import type { MissionStory } from "../types";

export const mockMission: MissionStory = {
  id: "mission-night-before-finals",
  title: "The Night Before Finals",
  chapterLabel: "Choice Fork 01",
  prompt:
    "Your phone lights up with messages about tomorrow's exam. Your chest tightens, and your first thought is that one bad score could define everything.",
  atmosphere: "Pause. Feel your feet on the floor. Notice three sounds around you before choosing.",
  decisions: [
    {
      id: "decision-grounded",
      label: "Take a breath and remind yourself one test does not define your future.",
      thinkingTrapId: "ACCURATE_THINKING",
      consequence:
        "You create a little space between the panic and the facts, which helps you plan your next hour.",
    },
    {
      id: "decision-catastrophize",
      label: "Assume this test will ruin everything and spiral into worst-case thoughts.",
      thinkingTrapId: "CATASTROPHIZING",
      consequence:
        "The pressure grows fast, making the problem feel bigger than the moment in front of you.",
    },
  ],
};
