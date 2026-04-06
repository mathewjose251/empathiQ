import type {
  AdminPagePayload,
  MentorPagePayload,
  NavItem,
  OverviewPagePayload,
  PackFeedItem,
  PanelData,
  ParentPagePayload,
  PortalCardData,
  TeenPreviewPagePayload,
  TeenMissionChoice,
  TimelineItem,
  MetricData,
} from "@empathiq/shared/contracts/webPortal";

export const ecosystemNav: NavItem[] = [
  { href: "/admin", label: "Admin" },
  { href: "/parent", label: "Parent" },
  { href: "/mentor", label: "Mentor" },
  { href: "/teen-preview", label: "Teen" },
];

export const portalCards: PortalCardData[] = [
  {
    href: "/admin",
    label: "Admin Hub",
    title: "Operate the whole ecosystem",
    detail:
      "Review platform posture, enter each experience, and coordinate the product without jumping across separate apps.",
    accent: "cyan",
  },
  {
    href: "/parent",
    label: "Parent View",
    title: "Plain-language insight dashboard",
    detail:
      "See how parent-facing summaries, family posture, and sideways invitations feel in a calm support-first UI.",
    accent: "mint",
  },
  {
    href: "/mentor",
    label: "Mentor View",
    title: "Strategy room for patterns",
    detail:
      "Inspect trap trends, pack signals, and intervention posture through a more analytical workspace.",
    accent: "cyan",
  },
  {
    href: "/teen-preview",
    label: "Teen View",
    title: "Narrative mission preview",
    detail:
      "Preview the emotional atmosphere of mission flow, choice forks, and the anonymous Pack reflection step.",
    accent: "amber",
  },
];

export const landingMetrics: MetricData[] = [
  { label: "Active Packs", value: "18", detail: "Closed cohorts currently running" },
  { label: "Weekly Insights", value: "142", detail: "Generated for mentors and parents" },
  { label: "Mentor Reviews", value: "27", detail: "Strategy-room follow-ups" },
  { label: "Parent Invitations", value: "63", detail: "Suggested offline moments" },
];

export const landingPanels: PanelData[] = [
  {
    label: "Thinking patterns",
    title: "Catastrophizing",
    detail:
      "Stressful moments are starting to snowball into worst-case stories, especially around high-pressure school events.",
  },
  {
    label: "Family posture",
    title: "Stay low-pressure",
    detail:
      "Short, sideways check-ins will land better than direct probing. The UI should feel like support, not surveillance.",
  },
  {
    label: "Suggested move",
    title: "Walk and wonder",
    detail:
      "Swap best case, worst case, and most likely outcomes during a short walk to make middle-ground thinking easier.",
  },
];

export const insightTimeline: TimelineItem[] = [
  { id: "mission", text: "Mission completed: The Night Before Finals" },
  { id: "reflection", text: "Reflection shared anonymously with Pack" },
  { id: "summary", text: "Insight Engine translated patterns into parent-safe language" },
  { id: "mentor", text: "Mentor Strategy Room updated with weekly trap mix" },
];

export const adminRoleCards: PortalCardData[] = [
  {
    href: "/admin/surveys",
    label: "Survey Signals",
    title: "Read teen and parent intake patterns",
    detail:
      "Review survey submissions, conflict clusters, and whether responses are still in preview memory or already landing in PostgreSQL.",
    accent: "mint",
  },
  {
    href: "/admin/workshops/family-dose",
    label: "Workshop Ops",
    title: "Parent + teen studio",
    detail:
      "Open the two-day workshop planner, review the enriched sessions, and track the next 30-day family follow-through plan.",
    accent: "amber",
  },
  {
    href: "/parent",
    label: "Parent UX",
    title: "Insight dashboard",
    detail:
      "High-level summaries, clear family posture, and gentle offline suggestions.",
    accent: "cyan",
  },
  {
    href: "/mentor",
    label: "Mentor UX",
    title: "Strategy room",
    detail:
      "Deeper pattern analysis, pack signals, and intervention planning context.",
    accent: "mint",
  },
  {
    href: "/teen-preview",
    label: "Teen UX",
    title: "Mission preview",
    detail:
      "Narrative mission framing, emotional atmosphere, and anonymous Pack reflection flow.",
    accent: "amber",
  },
];

export const adminResponsibilities: TimelineItem[] = [
  { id: "workshop-ops", text: "Prepare workshop cohorts, session materials, and the 30-day follow-through sequence." },
  { id: "pack-health", text: "Watch overall Pack health without exposing private teen reflections." },
  { id: "mentor-load", text: "Review mentor capacity and insight volume across cohorts." },
  { id: "family-tone", text: "Verify parent summaries stay supportive and non-surveillant." },
  { id: "qa-flow", text: "Jump into each portal to QA the experience end to end." },
];

export const parentPanels: PanelData[] = [
  {
    label: "Thinking patterns",
    title: "Catastrophizing is rising under academic pressure",
    detail:
      "Stressful moments are escalating into fast worst-case predictions, especially before performance-heavy days.",
  },
  {
    label: "Conversation posture",
    title: "Lead with calm curiosity",
    detail:
      "Keep questions short, specific, and indirect. The product should feel like support, not monitoring.",
  },
  {
    label: "Sideways invitation",
    title: "Walk and wonder",
    detail:
      "During a short walk, compare the worst case, best case, and most likely outcome of one current stressor.",
  },
];

export const mentorSignals: MetricData[] = [
  {
    label: "Catastrophizing",
    value: "41%",
    detail: "Most visible in academic anticipation missions.",
  },
  {
    label: "All-or-Nothing",
    value: "26%",
    detail: "Shows up after social setbacks and comparison spirals.",
  },
  {
    label: "Mind Reading",
    value: "18%",
    detail: "Common in peer-reaction reflection prompts.",
  },
];

export const mentorRecommendations: TimelineItem[] = [
  { id: "normalize", text: "Normalize anticipatory stress before challenging the thought pattern." },
  { id: "middle-ground", text: "Use group-safe prompts that widen middle-ground options." },
  { id: "spikes", text: "Look for repeat spikes before escalating strategy changes." },
];

export const teenChoices: TeenMissionChoice[] = [
  {
    id: "accurate-thinking",
    label: "Path 1",
    title: "Take a breath and remind yourself one test does not define your future.",
    detail:
      "You create space between panic and facts, which makes the next hour feel workable instead of doomed.",
    tag: "ACCURATE_THINKING",
    branchLabel: "Grounded path",
    consequence:
      "Your body settles enough for you to notice the exam is still just one moment in a much bigger story. You can make a plan instead of predicting collapse.",
    mood: "Steadying",
  },
  {
    id: "catastrophizing",
    label: "Path 2",
    title: "Assume this test will ruin everything and spiral into worst-case thoughts.",
    detail:
      "The pressure expands quickly and the night starts feeling like a verdict instead of a challenge.",
    tag: "CATASTROPHIZING",
    branchLabel: "Trap path",
    consequence:
      "Your thoughts speed up and every possible mistake starts sounding permanent. Studying gets harder because the fear becomes the loudest thing in the room.",
    mood: "Storm-heavy",
  },
];

export const teenReflectionFlow: TimelineItem[] = [
  { id: "choice", text: "Teen completes a mission choice." },
  { id: "tag", text: "The selected path sends a thinking trap tag to the backend." },
  { id: "post", text: "A reflection is posted anonymously into the closed Pack feed." },
];

export function getOverviewPayload(): OverviewPagePayload {
  return {
    navItems: ecosystemNav,
    hero: {
      eyebrow: "EmpathiQ Ecosystem",
      title: "One ecosystem, four entry points.",
      lede:
        "Start with the admin hub, then move across the parent, mentor, and teen experiences without losing the product story.",
    },
    metrics: landingMetrics,
    portals: portalCards,
    panels: landingPanels,
    timeline: insightTimeline,
    spotlight: {
      chip: "This week's emotional weather",
      title: "Pressure is making big outcomes feel immediate.",
      detail:
        "We are seeing a pattern where tense moments quickly become worst-case scenarios. The goal is not to correct every thought, but to create more space for middle-ground possibilities.",
      dialValue: "72%",
      dialLabel: "Need for calm structure",
    },
  };
}

export function getAdminPayload(): AdminPagePayload {
  return {
    navItems: [
      { href: "/", label: "Overview" },
      { href: "/admin", label: "Admin" },
      { href: "/admin/surveys", label: "Surveys" },
      { href: "/admin/workshops/family-dose", label: "Workshop" },
      { href: "/parent", label: "Parent" },
      { href: "/mentor", label: "Mentor" },
      { href: "/teen-preview", label: "Teen" },
    ],
    hero: {
      eyebrow: "Platform Control",
      title: "Admin access to every EmpathiQ surface.",
      lede:
        "Use this hub to review system posture and step directly into the parent, mentor, or teen-facing experience from a single admin UI.",
    },
    metrics: landingMetrics,
    roleCards: adminRoleCards,
    timeline: adminResponsibilities,
  };
}

export function getParentPayload(): ParentPagePayload {
  return {
    navItems: ecosystemNav,
    hero: {
      eyebrow: "Parent Dashboard",
      title: "Support without surveillance.",
      lede:
        "A family-facing dashboard that translates emotional patterns into calm, practical language.",
    },
    panels: parentPanels,
  };
}

export function getMentorPayload(): MentorPagePayload {
  return {
    navItems: ecosystemNav,
    hero: {
      eyebrow: "Strategy Room",
      title: "See the patterns behind the pressure.",
      lede:
        "This mentor view keeps the analytical depth while still avoiding direct AI-to-teen interaction.",
    },
    metrics: mentorSignals,
    timeline: mentorRecommendations,
  };
}

export function getTeenPreviewPayload(): TeenPreviewPagePayload {
  return {
    navItems: ecosystemNav,
    hero: {
      eyebrow: "Mission Hub Preview",
      title: "The night before finals.",
      lede:
        "A lightweight web preview of the mobile mission mood, built around narrative choice and anonymous reflection.",
    },
    story: {
      chip: "Choice Fork 01",
      title: "Pressure is making the story feel bigger than the facts.",
      detail:
        "Your phone lights up with messages about tomorrow's exam. Your chest tightens, and your first thought is that one bad score could define everything.",
      dialValue: "",
      dialLabel: "",
    },
    choices: teenChoices,
    timeline: teenReflectionFlow,
    reflectionPrompt:
      "What did this choice feel like in your body or your mind before you acted on it?",
    packFeed: [
      {
        id: "pack-1",
        alias: "North Star",
        mood: "Steadying",
        text: "I noticed my chest calm down when I named the most likely outcome instead of the worst one.",
      },
      {
        id: "pack-2",
        alias: "Echo Lane",
        mood: "Honest",
        text: "My brain went straight to disaster mode, but writing it out made it feel less true.",
      },
      {
        id: "pack-3",
        alias: "Drift Signal",
        mood: "Curious",
        text: "I am trying to catch the story earlier, right when it starts getting huge.",
      },
    ] satisfies PackFeedItem[],
  };
}
