/**
 * Mission Factory
 *
 * Template system for creating standardized, scalable mission definitions.
 * Each mission has a narrative arc, binary choices, thinking trap tags,
 * and sensory grounding prompts.
 */

export type ThinkingTrapCode =
  | "ACCURATE_THINKING"
  | "CATASTROPHIZING"
  | "ALL_OR_NOTHING"
  | "MIND_READING"
  | "OVERGENERALIZATION"
  | "LABELING"
  | "EMOTIONAL_REASONING"
  | "SHOULD_STATEMENTS";

export interface MissionDecisionTemplate {
  label: string;
  narrativeOutcome: string;
  thinkingTrapId: ThinkingTrapCode;
}

export interface MissionTemplate {
  /** Unique slug for URL and database */
  slug: string;

  /** Display title */
  title: string;

  /** Opening narrative (sets scene) */
  narrativeIntro: string;

  /** Sensory grounding prompt (e.g., "Feel your feet on the ground...") */
  sensoryPrompt: string;

  /** Context tag for categorization (school, family, peer, digital, self) */
  theme: "school" | "family" | "peer" | "digital" | "self";

  /** Estimated completion time in minutes */
  estimatedMinutes: number;

  /** Chapter/phase label (e.g., "Choice Fork 01") */
  chapterLabel: string;

  /** Binary choice pair: [healthy_choice, unhealthy_choice] */
  decisions: [MissionDecisionTemplate, MissionDecisionTemplate];
}

/**
 * Create a mission template with sensible defaults
 */
export function createMission(overrides: MissionTemplate): MissionTemplate {
  return overrides;
}

/**
 * Mission Library (25 missions across school, family, peer, digital, and self lanes)
 *
 * Organized by theme:
 * - School: pressure, shame, performance, planning, attendance
 * - Family: conflict, caregiver instability, comparison, privacy, alcohol-related chaos
 * - Peer: comparison, crushes, rumors, belonging, silence
 * - Digital: scrolling, late-night phone loops, status panic
 * - Self: body image, mistakes, self-talk, confidence, recovery
 */
export const PHASE1_MISSIONS: Record<string, MissionTemplate> = {
  // Mission 1: School Pressure
  "night-before-finals": createMission({
    slug: "night-before-finals",
    title: "The Night Before Finals",
    theme: "school",
    chapterLabel: "Choice Fork 01",
    estimatedMinutes: 3,
    narrativeIntro:
      "Your phone lights up with messages about tomorrow's exam. Your chest tightens, and your first thought is that one bad score could define everything.",
    sensoryPrompt:
      "Pause. Feel your feet on the floor. Notice three sounds around you before choosing.",
    decisions: [
      {
        label: "Take a breath and remind yourself one test does not define your future.",
        narrativeOutcome:
          "You create a little space between the panic and the facts, which helps you plan your next hour.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Assume this test will ruin everything and spiral into worst-case thoughts.",
        narrativeOutcome:
          "The pressure grows fast, making the problem feel bigger than the moment in front of you.",
        thinkingTrapId: "CATASTROPHIZING",
      },
    ],
  }),

  // Mission 2: Family Conflict
  "family-dinner-tension": createMission({
    slug: "family-dinner-tension",
    title: "Family Dinner Tension",
    theme: "family",
    chapterLabel: "Choice Fork 02",
    estimatedMinutes: 3,
    narrativeIntro:
      "Your parent makes a comment about your grades during dinner. You feel heat rise in your chest, and suddenly one remark feels like they think you're a failure at everything.",
    sensoryPrompt:
      "Notice the tightness in your body. Can you name one color in the room around you?",
    decisions: [
      {
        label: "Ask a clarifying question instead of assuming their judgment is total.",
        narrativeOutcome:
          "The conversation shifts. You learn they were worried, not critical. The dinner becomes a chance to connect.",
        thinkingTrapId: "ALL_OR_NOTHING",
      },
      {
        label: "Shut down and think they'll never believe in you anyway.",
        narrativeOutcome:
          "Silence grows. You feel more alone, and the hurt becomes proof that your family doesn't get you.",
        thinkingTrapId: "OVERGENERALIZATION",
      },
    ],
  }),

  // Mission 3: Peer Comparison
  "social-media-comparison": createMission({
    slug: "social-media-comparison",
    title: "Social Media Spiral",
    theme: "peer",
    chapterLabel: "Choice Fork 03",
    estimatedMinutes: 3,
    narrativeIntro:
      "You scroll and see your peers at a party. They look happy, confident, effortless. You're home alone. A voice inside says you're the problem.",
    sensoryPrompt:
      "Take one intentional breath. What's one small good thing that happened to you today, even if it's tiny?",
    decisions: [
      {
        label: "Remember that posts are curated moments, not full lives, and text a friend.",
        narrativeOutcome:
          "Your friend replies that they felt awkward at the party. You feel less alone.",
        thinkingTrapId: "MIND_READING",
      },
      {
        label: "Believe everyone else has it figured out and you never will.",
        narrativeOutcome:
          "The spiral deepens. You feel separate from everyone, convinced no one struggles like you do.",
        thinkingTrapId: "EMOTIONAL_REASONING",
      },
    ],
  }),

  // Mission 4: Digital Overload
  "phone-late-night": createMission({
    slug: "phone-late-night",
    title: "Phone at Midnight",
    theme: "digital",
    chapterLabel: "Choice Fork 04",
    estimatedMinutes: 3,
    narrativeIntro:
      "It's midnight. You should sleep for school tomorrow, but your phone keeps buzzing. FOMO whispers that you're missing something huge.",
    sensoryPrompt:
      "Close your eyes and listen. What's the furthest sound you can hear? Stay with that for a moment.",
    decisions: [
      {
        label: "Set the phone down, knowing nothing urgent will happen while you sleep.",
        narrativeOutcome:
          "You sleep better than you have in days. Morning comes easier.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Keep scrolling because not checking might mean a real crisis you miss.",
        narrativeOutcome:
          "Sleep becomes fragmented. You wake exhausted and more anxious than before.",
        thinkingTrapId: "CATASTROPHIZING",
      },
    ],
  }),

  // Mission 5: Self-Worth
  "mistake-at-work": createMission({
    slug: "mistake-at-work",
    title: "The Mistake",
    theme: "self",
    chapterLabel: "Choice Fork 05",
    estimatedMinutes: 3,
    narrativeIntro:
      "You made a mistake at work or school. Small. Fixable. But immediately you think: I'm incompetent. I should just quit. Everyone saw. I'm ruined.",
    sensoryPrompt:
      "Notice something solid around you - a wall, a chair. Touch it if you can. What does it feel like?",
    decisions: [
      {
        label: "Name the specific mistake, fix it, and remind yourself you're learning.",
        narrativeOutcome:
          "The mistake becomes data. Your manager appreciates that you handled it maturely.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Internalize it as proof you're fundamentally broken.",
        narrativeOutcome:
          "You spiral into shame. The mistake festers into self-doubt that lasts weeks.",
        thinkingTrapId: "LABELING",
      },
    ],
  }),

  // Mission 6: Sleep & Health
  "caffeine-before-bed": createMission({
    slug: "caffeine-before-bed",
    title: "Caffeine at Night",
    theme: "self",
    chapterLabel: "Choice Fork 06",
    estimatedMinutes: 3,
    narrativeIntro:
      "It's 8 PM and you reach for energy drink number two. You know you should sleep early, but you tell yourself it won't affect you. You're different.",
    sensoryPrompt:
      "Notice your breathing. Slow it down. Count: in for 4, out for 4. Do that three times.",
    decisions: [
      {
        label: "Skip the caffeine and stick to your sleep goal.",
        narrativeOutcome:
          "You sleep well. Morning comes easier. You're sharper in class.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Believe this one drink won't matter and that rules don't apply to you.",
        narrativeOutcome:
          "You're up until 2 AM. You're groggy and irritable all day. The cycle repeats.",
        thinkingTrapId: "SHOULD_STATEMENTS",
      },
    ],
  }),

  // Mission 7: Body Image
  "mirror-moment": createMission({
    slug: "mirror-moment",
    title: "What You See in the Mirror",
    theme: "self",
    chapterLabel: "Choice Fork 07",
    estimatedMinutes: 3,
    narrativeIntro:
      "You catch your reflection and immediately criticize what you see. One perceived flaw becomes evidence that everything about your body is wrong.",
    sensoryPrompt:
      "Look at your hands. They've held things you love, created things, helped people. What have they done for you?",
    decisions: [
      {
        label: "Notice one thing your body can do well and appreciate it.",
        narrativeOutcome:
          "You spend the day less focused on how you look and more present in what you do.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Spiral into all-or-nothing criticism about your entire appearance.",
        narrativeOutcome:
          "The rest of your day feels darker. You avoid photos and mirrors.",
        thinkingTrapId: "ALL_OR_NOTHING",
      },
    ],
  }),

  // Mission 8: Romantic Anxiety
  "crush-worry": createMission({
    slug: "crush-worry",
    title: "Worried About What They Think",
    theme: "peer",
    chapterLabel: "Choice Fork 08",
    estimatedMinutes: 3,
    narrativeIntro:
      "You see your crush texting someone else. Immediately, you assume they don't like you. You rewrite yesterday's conversation as proof they were bored.",
    sensoryPrompt:
      "Name five people who genuinely care about you, regardless of romance. Say their names slowly.",
    decisions: [
      {
        label: "Remember that one text doesn't define how they feel about you.",
        narrativeOutcome:
          "You stay calm. Later, they text you. You're ready to engage without anxiety.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Assume the worst and catastrophize about a rejection that hasn't happened.",
        narrativeOutcome:
          "You avoid them. They sense the distance. An actual rift forms from fear.",
        thinkingTrapId: "CATASTROPHIZING",
      },
    ],
  }),

  // Mission 9: Academic Perfectionism
  "grade-on-test": createMission({
    slug: "grade-on-test",
    title: "Not Perfect",
    theme: "school",
    chapterLabel: "Choice Fork 09",
    estimatedMinutes: 3,
    narrativeIntro:
      "You get a B on a test. It's a good grade. But your brain says: B means failure. You're not smart. You'll never get into college.",
    sensoryPrompt:
      "Stand up if you can. Feel your feet on the ground. You are grounded. You are okay.",
    decisions: [
      {
        label: "Celebrate the B, learn from the questions you missed, move forward.",
        narrativeOutcome:
          "You adjust your study approach. The next test goes better. You're proud.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Let one grade convince you that all your efforts are worthless.",
        narrativeOutcome:
          "You feel hopeless. Studying feels pointless. Your grades actually drop.",
        thinkingTrapId: "OVERGENERALIZATION",
      },
    ],
  }),

  // Mission 10: Social Anxiety
  "presentation-fear": createMission({
    slug: "presentation-fear",
    title: "In Front of Everyone",
    theme: "school",
    chapterLabel: "Choice Fork 10",
    estimatedMinutes: 3,
    narrativeIntro:
      "You have to present tomorrow. Your mind floods with worst-case scenarios: you'll forget everything, everyone will judge you, it will be humiliating.",
    sensoryPrompt:
      "Place your hand on your heart. Feel it beating. That rhythm has carried you through every challenge so far.",
    decisions: [
      {
        label: "Prepare as best you can, then remind yourself you've done hard things before.",
        narrativeOutcome:
          "The presentation goes fine. You're relieved. You realize you're more capable than anxiety told you.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Believe every outcome will be disaster and consider skipping.",
        narrativeOutcome:
          "You either panic-present and regret it, or avoid and face consequences.",
        thinkingTrapId: "CATASTROPHIZING",
      },
    ],
  }),

  // Mission 11: Friendship Conflict
  "friend-text-unanswered": createMission({
    slug: "friend-text-unanswered",
    title: "Left on Read",
    theme: "peer",
    chapterLabel: "Choice Fork 11",
    estimatedMinutes: 3,
    narrativeIntro:
      "You text your friend something personal. Hours pass with no reply. Your brain says: they don't care about you. The friendship is over.",
    sensoryPrompt:
      "Breathe in for 4 counts. Hold for 4. Out for 4. Notice you're still here. Still worthy.",
    decisions: [
      {
        label: "Remember they might be busy and give them space without spiraling.",
        narrativeOutcome:
          "They reply hours later with a genuine response. The friendship continues.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Assume silence means rejection and shut down toward them.",
        narrativeOutcome:
          "You become distant. When they finally respond, you're cold. Confusion grows.",
        thinkingTrapId: "MIND_READING",
      },
    ],
  }),

  // Mission 12: Future Uncertainty
  "college-decision": createMission({
    slug: "college-decision",
    title: "Path Pressure",
    theme: "school",
    chapterLabel: "Choice Fork 12",
    estimatedMinutes: 3,
    narrativeIntro:
      "Everyone asks what you want to do after high school. You don't know. This uncertainty feels like failure. Like you're broken or lazy.",
    sensoryPrompt:
      "You don't need to have all the answers today. Breathe. You have time.",
    decisions: [
      {
        label: "Accept that uncertainty is normal and explore options without pressure.",
        narrativeOutcome:
          "You talk to people, try things, discover interests. Clarity builds over time.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Believe you should have it all figured out and panic about the future.",
        narrativeOutcome:
          "Anxiety paralyzes you. You make rushed decisions you regret later.",
        thinkingTrapId: "SHOULD_STATEMENTS",
      },
    ],
  }),

  // Mission 13: Comparison Trap
  "peer-achievement": createMission({
    slug: "peer-achievement",
    title: "Their Success",
    theme: "peer",
    chapterLabel: "Choice Fork 13",
    estimatedMinutes: 3,
    narrativeIntro:
      "A peer announces they got a scholarship or lead role. Immediately you feel less-than. Their win feels like your loss.",
    sensoryPrompt:
      "Someone else's good news doesn't change your worth. Say that three times.",
    decisions: [
      {
        label: "Congratulate them genuinely and recommit to your own path.",
        narrativeOutcome:
          "You feel good about supporting them. You refocus on what matters to you.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Let their success convince you that you're failing compared to them.",
        narrativeOutcome:
          "Resentment builds. You isolate. Progress on your own goals stalls.",
        thinkingTrapId: "EMOTIONAL_REASONING",
      },
    ],
  }),

  // Mission 14: Anger in the Moment
  "sibling-boundary-crossed": createMission({
    slug: "sibling-boundary-crossed",
    title: "That Wasn't Okay",
    theme: "family",
    chapterLabel: "Choice Fork 14",
    estimatedMinutes: 3,
    narrativeIntro:
      "Your sibling goes into your room without asking. Rage floods in. Your first thought is to lash out and destroy something.",
    sensoryPrompt:
      "Pause. Notice where anger lives in your body. Breathe into that space. You're in control.",
    decisions: [
      {
        label: "Step away, cool down, then talk calmly about boundaries.",
        narrativeOutcome:
          "They understand. The conversation leads to respect instead of resentment.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Explode in anger, yell, or destroy something in the moment.",
        narrativeOutcome:
          "You feel worse afterward. Conflict escalates. Trust erodes.",
        thinkingTrapId: "EMOTIONAL_REASONING",
      },
    ],
  }),

  // Mission 15: Identity & Belonging
  "different-from-peers": createMission({
    slug: "different-from-peers",
    title: "Not Like Them",
    theme: "peer",
    chapterLabel: "Choice Fork 15",
    estimatedMinutes: 3,
    narrativeIntro:
      "You realize you're different from your peers in ways that matter to you - interests, identity, values. Part of you feels broken.",
    sensoryPrompt:
      "Differences make you interesting. Sameness makes the world boring. You matter.",
    decisions: [
      {
        label: "Own your difference and seek people who appreciate the real you.",
        narrativeOutcome:
          "You find your people. Belonging deepens when you stop pretending.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Hide who you are and exhaust yourself trying to fit in.",
        narrativeOutcome:
          "You feel lonely even in a crowd. Authenticity keeps being deferred.",
        thinkingTrapId: "LABELING",
      },
    ],
  }),

  // Mission 16: Teacher Shame
  "teacher-calls-you-out": createMission({
    slug: "teacher-calls-you-out",
    title: "Called Out in Class",
    theme: "school",
    chapterLabel: "Choice Fork 16",
    estimatedMinutes: 4,
    narrativeIntro:
      "A teacher corrects you sharply in front of everyone. Your face burns. Your mind jumps from one embarrassing moment to the belief that this teacher now sees you as a problem student.",
    sensoryPrompt:
      "Notice the heat in your body. One public moment feels huge, but it is still only one moment.",
    decisions: [
      {
        label: "Treat it as one rough interaction and check the issue privately later.",
        narrativeOutcome:
          "The sting fades. You get clarity on the work without turning the entire class into a verdict on your worth.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Decide the teacher hates you and stop trying in that subject.",
        narrativeOutcome:
          "Distance grows, your confidence drops, and one awkward correction starts shaping your whole term.",
        thinkingTrapId: "MIND_READING",
      },
    ],
  }),

  // Mission 17: Tuition Overload
  "tuition-overload": createMission({
    slug: "tuition-overload",
    title: "Too Much Coaching, Not Enough Air",
    theme: "school",
    chapterLabel: "Choice Fork 17",
    estimatedMinutes: 4,
    narrativeIntro:
      "School, tuition, homework, tests, repeat. Your calendar is full and your brain feels empty. Part of you wants to rest, but another part says slowing down means falling behind forever.",
    sensoryPrompt:
      "Put one hand on your chest and one on your stomach. Your body is giving you information, not betraying you.",
    decisions: [
      {
        label: "Admit the load is unsustainable and plan one realistic recovery block.",
        narrativeOutcome:
          "You still work hard, but with more honesty. One reset helps your focus return instead of collapsing completely.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Tell yourself you should be able to handle everything without breaking.",
        narrativeOutcome:
          "The guilt gets louder, your energy gets lower, and even simple tasks start to feel impossible.",
        thinkingTrapId: "SHOULD_STATEMENTS",
      },
    ],
  }),

  // Mission 18: Attendance Shame
  "attendance-warning": createMission({
    slug: "attendance-warning",
    title: "Attendance Warning",
    theme: "school",
    chapterLabel: "Choice Fork 18",
    estimatedMinutes: 4,
    narrativeIntro:
      "You've missed classes and now there is a warning message from school. Home stress played a part, but the message makes it sound like you simply do not care.",
    sensoryPrompt:
      "Slow down enough to separate the facts from the shame. There is still time to respond with honesty.",
    decisions: [
      {
        label: "Face the warning, explain the pattern, and ask for a recovery plan.",
        narrativeOutcome:
          "The problem is still real, but now it has shape. Support becomes possible because the silence is gone.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Assume you're already seen as a failure and avoid school even more.",
        narrativeOutcome:
          "Avoidance confirms the story your fear invented. The practical problem gets harder to solve.",
        thinkingTrapId: "LABELING",
      },
    ],
  }),

  // Mission 19: Parent Conflict After Results
  "parents-argue-after-results": createMission({
    slug: "parents-argue-after-results",
    title: "The Result Card Fight",
    theme: "family",
    chapterLabel: "Choice Fork 19",
    estimatedMinutes: 4,
    narrativeIntro:
      "Your marks are on the table and now your parents are arguing about each other, not helping you. You feel pulled into the middle, as if their fight is somehow now your responsibility too.",
    sensoryPrompt:
      "Notice the urge to rescue, explain, or absorb everyone's anger. Their conflict is loud, but it is not yours to carry alone.",
    decisions: [
      {
        label: "Step out of the blame loop and choose one calmer conversation later.",
        narrativeOutcome:
          "You protect your energy and create a better chance of being heard when the room is not on fire.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Decide their whole relationship problem is your fault because of the marks.",
        narrativeOutcome:
          "The guilt becomes enormous. You start carrying adult conflict on top of your own disappointment.",
        thinkingTrapId: "EMOTIONAL_REASONING",
      },
    ],
  }),

  // Mission 20: Weekend Alcohol Chaos
  "weekend-home-chaos": createMission({
    slug: "weekend-home-chaos",
    title: "Weekend Home Chaos",
    theme: "family",
    chapterLabel: "Choice Fork 20",
    estimatedMinutes: 4,
    narrativeIntro:
      "You can feel the house changing again. Voices get louder, plans get unstable, and part of you starts bracing before anything has even happened because weekends have become unpredictable.",
    sensoryPrompt:
      "Your body learned this alarm for a reason. Thank it for warning you, then choose the next small safe step.",
    decisions: [
      {
        label: "Name the early signs, protect your space, and reach for one safe support.",
        narrativeOutcome:
          "You do not control the house, but you do reduce how much of its chaos gets inside you.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Assume the whole weekend is ruined and there is no point trying anything good.",
        narrativeOutcome:
          "You shut down before the day has even unfolded, and fear decides the whole story in advance.",
        thinkingTrapId: "CATASTROPHIZING",
      },
    ],
  }),

  // Mission 21: Relative Comparison
  "relative-comparison-visit": createMission({
    slug: "relative-comparison-visit",
    title: "Compared to Your Cousin Again",
    theme: "family",
    chapterLabel: "Choice Fork 21",
    estimatedMinutes: 4,
    narrativeIntro:
      "A relative visits and starts comparing your marks, confidence, or future to someone else's. The room laughs it off, but you feel yourself shrinking inside.",
    sensoryPrompt:
      "Comparison is loud, but it is not objective truth. Breathe before you let it define you.",
    decisions: [
      {
        label: "Remember someone else's path is not a measuring tape for your worth.",
        narrativeOutcome:
          "The comment still stings, but it does not become your identity. You recover faster.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Take the comparison as proof that you are permanently behind.",
        narrativeOutcome:
          "One insensitive comment turns into a heavy story you keep replaying long after the visit ends.",
        thinkingTrapId: "OVERGENERALIZATION",
      },
    ],
  }),

  // Mission 22: Rumor in the Group Chat
  "group-chat-rumor": createMission({
    slug: "group-chat-rumor",
    title: "Something About You in the Group Chat",
    theme: "peer",
    chapterLabel: "Choice Fork 22",
    estimatedMinutes: 4,
    narrativeIntro:
      "A screenshot reaches you. People in a class group chat are talking about you, and you only have half the context. Your heart races and your head fills in the rest with the worst possible version.",
    sensoryPrompt:
      "Pause before reacting to the parts you cannot see. Gaps in the story are where panic loves to perform.",
    decisions: [
      {
        label: "Get context from one trusted person before deciding what it means.",
        narrativeOutcome:
          "The situation becomes clearer, and you avoid turning partial information into a social disaster movie.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Assume everyone is against you and fire off angry replies immediately.",
        narrativeOutcome:
          "The conflict grows fast. Panic becomes public before the facts arrive.",
        thinkingTrapId: "CATASTROPHIZING",
      },
    ],
  }),

  // Mission 23: Being Excluded
  "weekend-plan-exclusion": createMission({
    slug: "weekend-plan-exclusion",
    title: "You Weren't Invited",
    theme: "peer",
    chapterLabel: "Choice Fork 23",
    estimatedMinutes: 4,
    narrativeIntro:
      "Plans happened without you. Photos are up. The story in your head is instant: they are moving on, you were extra, and now everyone knows you matter less.",
    sensoryPrompt:
      "Exclusion hurts. Let yourself feel that without turning pain into prophecy.",
    decisions: [
      {
        label: "Acknowledge the hurt and resist making one event your whole social future.",
        narrativeOutcome:
          "You stay honest about the feeling without handing it the steering wheel. You can still choose your next move clearly.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Translate one missed plan into proof that nobody really wants you around.",
        narrativeOutcome:
          "The loneliness deepens because your mind turns a painful moment into a permanent identity.",
        thinkingTrapId: "LABELING",
      },
    ],
  }),

  // Mission 24: Comment About Your Body
  "body-comment-from-relative": createMission({
    slug: "body-comment-from-relative",
    title: "That Comment About Your Body",
    theme: "self",
    chapterLabel: "Choice Fork 24",
    estimatedMinutes: 4,
    narrativeIntro:
      "Someone makes a casual comment about your weight, skin, or appearance. They act like it is normal conversation, but the comment sticks to you for the rest of the day.",
    sensoryPrompt:
      "Notice the urge to inspect every flaw. One careless comment can wound, but it still does not define your body.",
    decisions: [
      {
        label: "Treat the comment as their opinion, not a final truth about you.",
        narrativeOutcome:
          "The hurt is real, but it passes faster because you do not build your whole self-view around it.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Let the comment become proof that your body is the problem.",
        narrativeOutcome:
          "You start policing yourself harshly and carrying someone else's voice inside your head.",
        thinkingTrapId: "EMOTIONAL_REASONING",
      },
    ],
  }),

  // Mission 25: Starting Again After a Bad Week
  "restart-after-bad-week": createMission({
    slug: "restart-after-bad-week",
    title: "Restart After a Rough Week",
    theme: "self",
    chapterLabel: "Choice Fork 25",
    estimatedMinutes: 4,
    narrativeIntro:
      "You missed routines, lost focus, slept badly, and now the week feels spoiled. Part of you wants to reset, but another part says you already messed it up, so why even bother.",
    sensoryPrompt:
      "A week is not your identity. A rough stretch is a state, not a sentence.",
    decisions: [
      {
        label: "Choose one small restart instead of waiting to feel perfect again.",
        narrativeOutcome:
          "Momentum comes back in small pieces. Restarting imperfectly works better than waiting for a magical fresh start.",
        thinkingTrapId: "ACCURATE_THINKING",
      },
      {
        label: "Tell yourself the whole week is ruined and give up on recovery.",
        narrativeOutcome:
          "The slump stretches longer because all-or-nothing thinking turns one hard week into two.",
        thinkingTrapId: "ALL_OR_NOTHING",
      },
    ],
  }),
};

/**
 * Get all missions for Phase 1
 */
export function getAllPhase1Missions(): MissionTemplate[] {
  return Object.values(PHASE1_MISSIONS);
}

/**
 * Get a single mission by slug
 */
export function getMissionBySlug(slug: string): MissionTemplate | null {
  return PHASE1_MISSIONS[slug] ?? null;
}
