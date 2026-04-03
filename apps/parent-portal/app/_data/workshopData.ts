import type {
  WorkshopDayPlan,
  WorkshopFollowThrough,
  WorkshopModule,
  WorkshopPagePayload,
  WorkshopRoadmapPhase,
} from "@empathiq/shared/contracts/workshops";
import type { MetricData, NavItem } from "@empathiq/shared/contracts/webPortal";

const workshopNav: NavItem[] = [
  { href: "/", label: "Overview" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/workshops/family-dose", label: "Workshop Ops" },
  { href: "/parent", label: "Parent" },
  { href: "/mentor", label: "Mentor" },
  { href: "/teen-preview", label: "Teen" },
];

const workshopMetrics: MetricData[] = [
  {
    label: "2 mornings",
    value: "15",
    detail: "Core sessions compressed into Saturday and Sunday morning delivery blocks.",
  },
  {
    label: "Weekend span",
    value: "9h",
    detail: "Live programme window runs from 7:00 AM to 11:30 AM on both days.",
  },
  {
    label: "Family size",
    value: "8-12",
    detail: "Ideal cohort size for mixing, safety, and facilitator visibility.",
  },
  {
    label: "Booster loop",
    value: "5",
    detail: "Five follow-through checkpoints keep the workshop alive after the weekend.",
  },
];

const workshopModules: WorkshopModule[] = [
  {
    label: "Preventive REBT",
    title: "Thought-trap coaching inside family activities",
    detail:
      "We keep the workshop experiential, then layer in brief Rational Emotive Education style moments so families learn to spot pressure stories before they harden into conflict.",
    bullets: [
      "Add thought, feeling, and response prompts inside the shared journal and contract review.",
      "Translate catastrophic or all-or-nothing language into middle-ground options without turning the session into therapy.",
      "Give mentors structured signals after the workshop rather than raw family disclosures.",
    ],
    accent: "cyan",
  },
  {
    label: "Mindfulness Layer",
    title: "Micro grounding before hard conversations",
    detail:
      "Borrow the low-friction mindfulness style from preventive school programming and place it at the edges of transitions, not as a separate lecture block.",
    bullets: [
      "Use 60-90 second breath or sensory resets before journalling, storytelling, and contract negotiation.",
      "Keep language simple enough for parents and teens to repeat at home the same day.",
      "Tie each reset to sleep, exam pressure, and conflict recovery rather than abstract wellness talk.",
    ],
    accent: "mint",
  },
  {
    label: "Growth Mindset",
    title: "Move from performance to progress language",
    detail:
      "The workshop now shifts praise from achievement and compliance toward effort, repair, and willingness to try again.",
    bullets: [
      "Games and art sessions use 'not yet' coaching instead of talent or comparison framing.",
      "Parents practice noticing process, calm recovery, and curiosity under pressure.",
      "Academic overload becomes a solvable pattern, not a fixed identity story.",
    ],
    accent: "amber",
  },
  {
    label: "Parent Safety",
    title: "Emotional safety for the home, not just the venue",
    detail:
      "This is where EmpathiQ becomes distinct: we treat family tone, blame, and rupture-repair as first-class product outcomes, not side effects.",
    bullets: [
      "Questions-only rules during empathy walks and storytelling reduce correction reflexes.",
      "Parents receive sideways language to support without surveillance after the workshop.",
      "Admin workflows separate standard follow-up from referral cases involving self-harm, violence, or substance risk.",
    ],
    accent: "mint",
  },
  {
    label: "School Bridge",
    title: "Optional educator and counselor handoff",
    detail:
      "Inspired by whole-school prevention models, the workshop now has a clean bridge for schools without exposing raw family content.",
    bullets: [
      "Generate a minimum-necessary summary for school counselors only when families opt in.",
      "Translate workshop themes into classroom-friendly support actions like load balancing or presentation scaffolds.",
      "Keep educator access separate from parent and mentor views inside the product.",
    ],
    accent: "cyan",
  },
  {
    label: "Booster Engine",
    title: "Keep the intervention alive past the applause",
    detail:
      "The published AllzWellEver paper explicitly noted the need for booster sessions and parent involvement. We turn those gaps into the next product advantage.",
    bullets: [
      "Schedule Day 7, Day 14, and Day 30 checkpoints inside the admin workflow.",
      "Reuse the shared journal, contract, and family artwork as commitment anchors.",
      "Escalate unresolved academic overload or family strain into mentor review instead of waiting for crisis.",
    ],
    accent: "amber",
  },
];

const workshopRoadmap: WorkshopRoadmapPhase[] = [
  {
    id: "intake",
    label: "Phase 1",
    title: "Family intake, consent, and safety triage",
    detail:
      "Before a family enters the workshop, the admin flow should decide whether they belong in a standard preventive cohort or need a mentor-led or referral path.",
    deliverables: [
      "Digital intake for caregiver posture, academic pressure, and home stress signals",
      "Eligibility gate for age, crisis flags, and consent completeness",
      "Cohort assignment with facilitator ratio and school-partner context",
    ],
  },
  {
    id: "delivery",
    label: "Phase 2",
    title: "Live workshop operations console",
    detail:
      "The admin workshop page becomes a real operating surface during delivery, not just a reference page.",
    deliverables: [
      "Attendance tracking, material checklist, and facilitator notes by session",
      "Quiet incident logging for dysregulation, refusal, or safeguarding concerns",
      "Session-by-session output capture for contract drafts, journal themes, and next actions",
    ],
  },
  {
    id: "booster",
    label: "Phase 3",
    title: "30-day booster loop for parent, teen, and mentor",
    detail:
      "After the workshop, EmpathiQ should keep small actions moving through structured nudges rather than leaving families with inspiration only.",
    deliverables: [
      "Parent-friendly prompts at Day 3, Day 7, Day 14, and Day 30",
      "Mentor review queue for families showing persistent overload or conflict",
      "Reunion planning, contract check-ins, and home ritual completion tracking",
    ],
  },
  {
    id: "outcomes",
    label: "Phase 4",
    title: "School bridge, outcome review, and referrals",
    detail:
      "The final layer distinguishes us from workshop providers: we connect family experiences to real follow-through without overexposing private content.",
    deliverables: [
      "Optional counselor snapshot focused on support needs, not disclosures",
      "Outcome dashboard for family climate, academic load, and booster completion",
      "Referral tracker for high-risk cases outside the mentoring workshop pathway",
    ],
  },
];

const dayOnePlan: WorkshopDayPlan = {
  id: "day-1",
  label: "Saturday · Day 1",
  title: "Verukal - Finding our roots",
  summary:
    "Saturday keeps the DOSE runbook's body-first and family-first tone, then deepens it with emotional safety rules, REBT-style noticing, and early parent involvement habits inside a shorter morning window.",
  checkpoint:
    "Families leave Saturday with a shared journal, one phone-free evening task, and a baseline read on stress, connection, and repair posture before returning Sunday morning.",
  sessions: [
    {
      id: "d1-s1",
      startTime: "7:00 AM",
      duration: "20 min",
      title: "Phone surrender and Kolam welcome circle",
      tagline: "Set the tone around presence before anyone starts performing.",
      signals: ["Oxytocin", "Serotonin", "Digital reset"],
      flow: [
        "Collect phones, create the Kolam pattern together, and replace awkward introductions with a tactile family ritual.",
        "Teach the DOSE language in one pass so every later debrief has a shared vocabulary.",
        "Start with one-word feeling responses to keep vulnerability light but real.",
      ],
      enrichments: [
        "Capture two baseline pulses in admin notes: current stress load and how safe it feels to talk at home.",
        "Frame the workshop as preventive emotional skill-building, not correction for a failing family.",
        "Give parents a one-minute support rule: notice, mirror, ask before advising.",
      ],
      adminOutputs: [
        "Attendance and phone-free agreement logged.",
        "Opening family climate posture recorded for later comparison.",
      ],
    },
    {
      id: "d1-s2",
      startTime: "7:20 AM",
      duration: "40 min",
      title: "Beach walk in silence with empathy prompts",
      tagline: "Slow the nervous system down before trying to improve communication.",
      signals: ["Serotonin", "Endorphins", "Oxytocin"],
      flow: [
        "Use shoreline silence first, then guided empathy cards, then a shared beach object that represents the relationship today.",
        "Let facilitators hold distance so the walk stays private and non-surveillant.",
        "Close with a short group surprise debrief instead of analysis-heavy processing.",
      ],
      enrichments: [
        "Add a mindfulness notice-breathe-name reset before the first prompt card.",
        "Insert one REBT card: what am I assuming versus what do I know right now.",
        "Use this session to model low-pressure 'bonding beyond words' rather than direct interrogation.",
      ],
      adminOutputs: [
        "Observation note on whether the pair moved toward silence, curiosity, or defensiveness.",
      ],
    },
    {
      id: "d1-s3",
      startTime: "8:00 AM",
      duration: "45 min",
      title: "Pallanguzhi, Nondi, and movement games",
      tagline: "Let patience, play, and role reversal do the teaching.",
      signals: ["Dopamine", "Oxytocin", "Endorphins"],
      flow: [
        "Use face-to-face play and teen-as-coach moments to create eye contact and mutual respect.",
        "Keep rules light so discovery and teaching happen inside the family, not from the stage.",
        "Debrief around what it felt like to teach and be taught.",
      ],
      enrichments: [
        "Use growth mindset language such as 'not yet' and 'try one more way' during the debrief.",
        "Reward calm recovery and playful persistence rather than only winning.",
        "Notice parent reactions when the teen becomes the expert; that becomes empathy data later.",
      ],
      adminOutputs: [
        "Quick note on coaching style: collaborative, controlling, or avoidant.",
      ],
    },
    {
      id: "d1-s4",
      startTime: "8:45 AM",
      duration: "45 min",
      title: "Walk As Me empathy reversal",
      tagline: "Give the teen leadership without making the parent powerless.",
      signals: ["Oxytocin", "Serotonin"],
      flow: [
        "Teens lead, parents ask questions only, and facilitators intervene only when correction sneaks back in.",
        "Use the beachfront path as a softer place to explore curiosity and difference.",
        "Keep the close focused on surprise rather than explanation.",
      ],
      enrichments: [
        "Turn the 'questions only' rule into a Family Emotional Safety module parents can reuse at home.",
        "After the walk, invite one sentence from the teen on what adults usually miss.",
        "Use the parent response as a practice rep for non-defensive listening.",
      ],
      adminOutputs: [
        "Curiosity-versus-correction note logged for each facilitator group.",
      ],
    },
    {
      id: "d1-s5",
      startTime: "9:30 AM",
      duration: "45 min",
      title: "Iru Manam back-to-back journalling",
      tagline: "Shared writing becomes the bridge from emotion to language.",
      signals: ["Serotonin", "Oxytocin"],
      flow: [
        "Use five parallel questions, a structured reveal, and limited response phrases to keep defensiveness low.",
        "Seal the final line in the journal so families leave with a physical artifact of discovery.",
        "Treat the journal as a long-term tool, not a one-day worksheet.",
      ],
      enrichments: [
        "Add one REBT page: situation, thought, feeling, and a more helpful next response.",
        "Include a growth mindset prompt on what each person is still learning, not failing at.",
        "Translate repeat themes into parent-friendly follow-up language for later nudges.",
      ],
      adminOutputs: [
        "Theme tags only, never raw journal content, captured for mentor or booster planning.",
      ],
    },
    {
      id: "d1-s6",
      startTime: "10:15 AM",
      duration: "45 min",
      title: "Lagori and Kho-Kho with cross-family teams",
      tagline: "Break family hierarchy for a while so new identities can emerge.",
      signals: ["Endorphins", "Oxytocin", "Dopamine"],
      flow: [
        "Mix families intentionally, let teens lead one strategy round, then use appreciation before reforming original pairs.",
        "Keep energy high and the rules clear enough for fast participation.",
        "Use the cool-down to convert adrenaline into genuine noticing.",
      ],
      enrichments: [
        "Cross-family mixing mirrors school-based prevention models and widens empathy beyond one home.",
        "Add respectful-cheering prompts so mistakes do not turn into shame or mockery.",
        "Flag dysregulation quietly for follow-up instead of correcting people publicly.",
      ],
      adminOutputs: [
        "Facilitator note on peer energy, regulation, and inclusion across families.",
      ],
    },
    {
      id: "d1-s7",
      startTime: "11:00 AM",
      duration: "30 min",
      title: "Saturday close and evening homework",
      tagline: "End the first day with language, breath, and one doable task.",
      signals: ["Oxytocin", "Serotonin"],
      flow: [
        "Run a fast DOSE round, collect one surprising discovery, then hand out a clear evening assignment.",
        "Use the shared breathing close to give the family one reset they can repeat tomorrow morning.",
        "Keep homework tiny enough to complete, but specific enough to matter.",
      ],
      enrichments: [
        "Turn the evening task into a menu of low-pressure home rituals rather than homework that feels graded.",
        "Schedule Day 7 booster nudges before families leave so follow-through is designed, not hoped for.",
        "Use the breath close as a repeatable mindfulness technique tied to exam stress and conflict recovery.",
      ],
      adminOutputs: [
        "Home task chosen and first booster schedule captured.",
      ],
    },
  ],
};

const dayTwoPlan: WorkshopDayPlan = {
  id: "day-2",
  label: "Sunday · Day 2",
  title: "Vazhvu - Choosing to grow",
  summary:
    "Sunday keeps the emotional warmth of the original runbook, but pushes harder into growth mindset, digital behaviour change, and long-tail follow-through inside the same four-and-a-half-hour morning window.",
  checkpoint:
    "Families leave with a living contract, one family artwork, a booster schedule, and an optional school or mentor handoff path.",
  sessions: [
    {
      id: "d2-s1",
      startTime: "7:00 AM",
      duration: "25 min",
      title: "Homework share and technology obituary",
      tagline: "Name what screens have cost without making the teen the villain.",
      signals: ["Digital reset", "Serotonin"],
      flow: [
        "Celebrate completed homework first so accountability starts with success.",
        "Write honest losses caused by screens, seal them in the clay pot, and keep the pot visible all day.",
        "Treat the ritual as a pivot away from blame and toward rebuilding.",
      ],
      enrichments: [
        "Convert the obituary into a digital-drama map: time lost, mood shifts, missed conversations, and sleep disruption.",
        "Ask parents to identify one of their own screen costs first so the room stays collaborative.",
        "Pull one repair promise from each family before the session closes.",
      ],
      adminOutputs: [
        "Digital strain themes captured for contract customization later in the day.",
      ],
    },
    {
      id: "d2-s2",
      startTime: "7:25 AM",
      duration: "40 min",
      title: "Shoreline scavenger sketch walk",
      tagline: "Replace quick capture with slow noticing.",
      signals: ["Dopamine", "Endorphins", "Oxytocin"],
      flow: [
        "Use sketching rather than photographing so attention slows down and effort becomes part of the reward.",
        "Let families search independently and then present their sketchbook as a story, not a scorecard.",
        "Award creativity of observation rather than speed or perfect drawing.",
      ],
      enrichments: [
        "This becomes anti-scroll attention training rather than just an outdoor activity.",
        "Use curiosity prompts that mirror growth mindset language: what did you keep looking for after it got hard.",
        "Keep the difficulty ramp intentional so the reward comes from persistence.",
      ],
      adminOutputs: [
        "Note which families can tolerate slow search and which rush back to completion mode.",
      ],
    },
    {
      id: "d2-s3",
      startTime: "8:05 AM",
      duration: "45 min",
      title: "Kai Maavu cooking challenge",
      tagline: "The teen leads, the parent supports, and food becomes family regulation.",
      signals: ["Oxytocin", "Endorphins", "Serotonin"],
      flow: [
        "Make the teen the head chef, keep parents in an assistant role, and let the elder volunteer offer encouragement instead of control.",
        "Use hands-on preparation and a team-based judging rubric to reinforce shared effort.",
        "Tie the meal back to gut, mood, and real-world home replication.",
      ],
      enrichments: [
        "Link nourishment to emotional steadiness and exam resilience rather than diet policing.",
        "Give parents praise language for cooperation, patience, and calm correction.",
        "Add a low-cost home version so the exercise can repeat after the workshop.",
      ],
      adminOutputs: [
        "One realistic food or mealtime ritual captured for the 30-day plan.",
      ],
    },
    {
      id: "d2-s4",
      startTime: "8:50 AM",
      duration: "40 min",
      title: "Gilli-Danda and Gundu memory bridge",
      tagline: "Use memory, teaching, and flow to challenge screen-based stimulation habits.",
      signals: ["Dopamine", "Endorphins", "Oxytocin"],
      flow: [
        "Start with parent childhood memories, let parents teach, then move into quiet marble play for flow.",
        "Use the contrast between noisy play and silent focus to talk about different kinds of reward.",
        "Keep the debate on what felt better because the contrast teaches itself.",
      ],
      enrichments: [
        "Explicitly name the difference between fast stimulation and flow-state dopamine.",
        "Invite teens to notice when slow fun starts feeling uncomfortable and why.",
        "Capture the family's preferred analog activity for booster scheduling.",
      ],
      adminOutputs: [
        "Preferred phone-free family activity stored for Day 14 follow-up.",
      ],
    },
    {
      id: "d2-s5",
      startTime: "9:30 AM",
      duration: "35 min",
      title: "Paaladai storytelling circle",
      tagline: "Parents tell stories without turning them into lessons.",
      signals: ["Oxytocin", "Serotonin"],
      flow: [
        "Use the speaking stick, keep everyone on the ground, and enforce the no-lesson rule.",
        "Let teens respond only with recognition language so the exchange stays relational, not argumentative.",
        "Close by naming shared humanity across generations.",
      ],
      enrichments: [
        "Ask what belief the parent carried at that age, which opens an REBT bridge without sounding clinical.",
        "Translate stories into middle-ground language rather than morals and warnings.",
        "Flag themes that may need mentor or counselor follow-up after the workshop.",
      ],
      adminOutputs: [
        "Themes suitable for optional parent summary or counselor handoff tagged without raw quotes.",
      ],
    },
    {
      id: "d2-s6",
      startTime: "10:05 AM",
      duration: "40 min",
      title: "Flow-state family art challenge",
      tagline: "Turn the future into something the family can see on the wall.",
      signals: ["Dopamine", "Serotonin"],
      flow: [
        "Begin in silence, then move into collaborative conversation around a five-year family image.",
        "Keep the art process focused on the dialogue it produces, not artistic skill.",
        "End with a short gallery share so the vision becomes spoken, not only painted.",
      ],
      enrichments: [
        "Add growth mindset and future-self prompts so the picture includes what the family is becoming, not just what it wants.",
        "Invite families to draw one stressor shrinking and one shared ritual growing.",
        "Make the artwork part of the booster engine by referring back to it during check-ins.",
      ],
      adminOutputs: [
        "Artwork theme and one future ritual logged as commitment anchors.",
      ],
    },
    {
      id: "d2-s7",
      startTime: "10:45 AM",
      duration: "30 min",
      title: "DOSE family contract negotiation",
      tagline: "The contract becomes a living home workflow, not a speech.",
      signals: ["Digital reset", "Oxytocin", "Dopamine"],
      flow: [
        "Reframe the contract by asking teens what they want to change in parent phone use first.",
        "Negotiate clause by clause and leave blanks rather than forcing fake agreement.",
        "Sign physically and read one clause aloud for public accountability.",
      ],
      enrichments: [
        "Expand the contract beyond screens into sleep, study load, calm check-ins, and repair after conflict.",
        "Add one parent promise, one teen promise, and one family ritual with named review dates.",
        "Set Day 7, Day 14, and Day 30 review points directly from this session.",
      ],
      adminOutputs: [
        "Contract follow-up schedule saved for parent, mentor, and reunion workflows.",
      ],
    },
    {
      id: "d2-s8",
      startTime: "11:15 AM",
      duration: "15 min",
      title: "Closing ceremony and DOSE pledge",
      tagline: "Turn appreciation into the bridge back to ordinary life.",
      signals: ["Oxytocin", "Serotonin", "Dopamine"],
      flow: [
        "Use public appreciations, certificates, a leaf intention, and the pledge to end on meaning rather than hype.",
        "Return phones only after the family has named what will change tomorrow.",
        "Keep the final moment quiet so the shift feels real, not performative.",
      ],
      enrichments: [
        "Attach a booster card with the next check-in dates before the phone comes back.",
        "Offer an opt-in school or counselor summary path for families needing coordinated support.",
        "Turn the appreciation statements into the emotional baseline for future follow-up.",
      ],
      adminOutputs: [
        "Reunion invitation, opt-in school bridge, and next-step owner confirmed.",
      ],
    },
  ],
};

const followThrough: WorkshopFollowThrough[] = [
  {
    label: "Day 3",
    title: "Parent calm-check nudge",
    detail:
      "Send one sideways invitation to the caregiver: ask a question, mirror the answer, and stop before advice. The goal is tone repair, not content control.",
    owner: "Parent portal",
  },
  {
    label: "Day 7",
    title: "Contract and journal checkpoint",
    detail:
      "Family reviews one clause, one journal page, and one phone-free ritual. Admin sees completion, not raw journal text.",
    owner: "Admin + parent",
  },
  {
    label: "Day 14",
    title: "Mentor and school bridge review",
    detail:
      "If academic overload or conflict remains high, a mentor sees pattern summaries and the school summary can be shared only if the family opted in.",
    owner: "Mentor + school",
  },
  {
    label: "Day 21",
    title: "Growth mindset reset",
    detail:
      "Families revisit one 'not yet' challenge, one tiny win, and one routine that fell apart without turning it into failure.",
    owner: "Parent portal",
  },
  {
    label: "Day 30",
    title: "Reunion and revision",
    detail:
      "Bring families back for a short reunion, update the contract, replay one analog activity, and decide who needs the next layer of support.",
    owner: "Admin workshop ops",
  },
];

export function getDoseWorkshopPayload(): WorkshopPagePayload {
  return {
    navItems: workshopNav,
    hero: {
      eyebrow: "Admin Workshop Ops",
      title: "Parent + teen beach workshop, with real follow-through.",
      lede:
        "This admin module turns the DOSE family workshop into an EmpathiQ operating flow: a Saturday and Sunday morning in-person reset from 7:00 AM to 11:30 AM, a 30-day booster path, and clean handoffs into parent, mentor, and school support when needed.",
    },
    metrics: workshopMetrics,
    setup: [
      {
        label: "Cohort shape",
        value: "8-12 families · one teen + one caregiver per pair",
        helper:
          "This keeps the physical sessions lively while preserving enough facilitator visibility for emotional safety.",
      },
      {
        label: "Weekend schedule",
        value: "Saturday + Sunday · 7:00 AM to 11:30 AM",
        helper:
          "The flow is intentionally built as two focused morning blocks so families stay emotionally present and can still absorb the material.",
      },
      {
        label: "Age band",
        value: "13-18 for the main workshop track",
        helper:
          "Younger children should move into a separate parent-child lite programme rather than the teen-focused family flow.",
      },
      {
        label: "Venue posture",
        value: "Beachside venue with shaded indoor fallback",
        helper:
          "The beach walk, shoreline sketching, and low-stimulation pauses work best when the environment itself lowers the family's pace.",
      },
      {
        label: "Lead team",
        value: "1 lead per 4 families + safety lead + elder volunteer",
        helper:
          "The elder role strengthens intergenerational warmth without turning the room into instruction-heavy authority.",
      },
      {
        label: "School partner",
        value: "Optional counselor or teacher bridge on consent",
        helper:
          "Families stay private by default; school support becomes opt-in, minimum-necessary, and post-workshop only.",
      },
      {
        label: "Booster cadence",
        value: "Day 3, Day 7, Day 14, Day 21, Day 30",
        helper:
          "This is where we differentiate from workshop-only models and keep behaviour change alive.",
      },
    ],
    safeguards: [
      {
        label: "Privacy posture",
        value: "No raw teen reflections in parent summaries or school handoffs",
        helper:
          "The workshop supports trust by sharing patterns and next steps, not sensitive word-for-word disclosures.",
      },
      {
        label: "Safety gate",
        value: "Crisis and substance-risk cases bypass standard cohorts",
        helper:
          "Self-harm, violence, coercion, or acute substance-risk disclosures should go to referral or mentor-led safety workflows.",
      },
      {
        label: "Facilitator rule",
        value: "Invite sharing, never force it",
        helper:
          "This mirrors the runbook's emotional safety logic and prevents later sessions from collapsing into guarded performance.",
      },
      {
        label: "Evidence lens",
        value: "REE or REBT, mindfulness, growth mindset, and family systems",
        helper:
          "We are blending preventive school-style tools into a family workflow rather than offering a generic wellness event.",
      },
      {
        label: "Outcome frame",
        value: "Support academic function and emotional load together",
        helper:
          "The workshop only matters if home tone, study stress, and recovery skills improve after the weekend is over.",
      },
      {
        label: "Product handoff",
        value: "Admin -> parent -> mentor -> school only when needed",
        helper:
          "This keeps the workshop connected to the wider EmpathiQ system without turning it into surveillance.",
      },
    ],
    modules: workshopModules,
    roadmap: workshopRoadmap,
    days: [dayOnePlan, dayTwoPlan],
    followThrough,
    adminChecklist: [
      "Confirm consent, age eligibility, and safety triage before enrollment.",
      "Use bilingual delivery and local play so the programme feels culturally grounded, not imported.",
      "Log only themes and support needs from journals or stories; never store raw intimate content by default.",
      "Treat the contract, journal, and artwork as long-tail commitment devices inside the product.",
      "Keep school or counselor handoff opt-in and minimum-necessary.",
      "Review booster completion at Day 7, Day 14, and Day 30 before closing the family out.",
    ],
  };
}
