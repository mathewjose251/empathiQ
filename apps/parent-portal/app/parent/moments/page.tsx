/*
 * ─── PARENT MOMENTS ──────────────────────────────────────────
 *
 * Sideways connection suggestions. These are AI-suggested
 * offline activities, conversation starters, and micro-rituals
 * based on the teen's current patterns. No raw data is exposed.
 *
 * The metaphor is "sideways" because the best connections with
 * teens happen shoulder-to-shoulder (on a walk, during cooking,
 * in the car) rather than face-to-face interrogation.
 */

const MOMENT_CATEGORIES = [
  {
    category: "Walk & Talk",
    emoji: "🚶",
    colour: "mint",
    description: "Side-by-side movement lowers defenses. No eye contact = less pressure.",
  },
  {
    category: "Kitchen Table",
    emoji: "🍳",
    colour: "amber",
    description: "Cooking together creates natural pauses. Questions land differently when hands are busy.",
  },
  {
    category: "Car Conversations",
    emoji: "🚗",
    colour: "cyan",
    description: "Captive audience with a natural end point. Perfect for one calm question.",
  },
  {
    category: "Quiet Rituals",
    emoji: "🕯️",
    colour: "rose",
    description: "Shared silence, small traditions, bedtime routines. Connection without words.",
  },
];

const SUGGESTED_MOMENTS = [
  {
    id: "walk-worst-best-likely",
    category: "Walk & Talk",
    emoji: "🚶",
    title: "Walk and wonder",
    description:
      "During a short walk, compare the worst case, the best case, and the most likely outcome of one thing they're stressed about. No fixing — just widening.",
    why: "Suggested because catastrophizing is the current focus area. Walking conversations lower cortisol and remove the pressure of eye contact.",
    duration: "15 min",
    difficulty: "Easy",
  },
  {
    id: "kitchen-feeling-words",
    category: "Kitchen Table",
    emoji: "🍳",
    title: "Feeling words game",
    description:
      "While cooking together, take turns naming how you feel right now in one word. Then ask: \"What would make that word shift by one degree?\" No fixing, just naming.",
    why: "Naming emotions with precision (\"overwhelmed\" vs \"bad\") is a core REBT skill. Doing it together normalises the practice.",
    duration: "10 min",
    difficulty: "Easy",
  },
  {
    id: "car-one-question",
    category: "Car Conversations",
    emoji: "🚗",
    title: "The one calm question",
    description:
      "On the next car ride, ask one question and then sit with whatever they say. Don't follow up. Don't fix. Just thank them for telling you. Try: \"What's one thing that felt harder than expected this week?\"",
    why: "Teens answer more honestly when there's a natural end point (arriving somewhere). One question signals trust; five questions signal interrogation.",
    duration: "5 min",
    difficulty: "Easy",
  },
  {
    id: "quiet-3-sounds",
    category: "Quiet Rituals",
    emoji: "🕯️",
    title: "Three sounds before sleep",
    description:
      "Before saying goodnight, sit together for 30 seconds and each name three sounds you can hear. That's it. A micro-grounding ritual that becomes an anchor.",
    why: "Grounding exercises are more powerful as shared rituals than as solo techniques. This creates a sensory pause at the day's edge.",
    duration: "2 min",
    difficulty: "Easy",
  },
  {
    id: "walk-should-prefer",
    category: "Walk & Talk",
    emoji: "🚶",
    title: "The should-to-prefer swap",
    description:
      "On a walk, take turns changing 'should' statements into 'I'd prefer' statements. Start with your own: \"I should exercise more\" → \"I'd prefer to move my body after work.\" Then invite them.",
    why: "Should Statements create rigid expectations. Modelling the swap out loud — with your own real examples — teaches by demonstration, not correction.",
    duration: "15 min",
    difficulty: "Medium",
  },
  {
    id: "kitchen-trap-spotting",
    category: "Kitchen Table",
    emoji: "🍳",
    title: "Trap-spotting in the wild",
    description:
      "While watching TV or scrolling together, spot thinking traps in characters or posts. \"That character just did All-or-Nothing — did you catch it?\" Make it a game, not a lesson.",
    why: "Externalising the trap (seeing it in others) builds the skill without the vulnerability of applying it to yourself first.",
    duration: "Ongoing",
    difficulty: "Medium",
  },
  {
    id: "car-scale-check",
    category: "Car Conversations",
    emoji: "🚗",
    title: "Scale of 1 to 10",
    description:
      "Ask: \"On a scale of 1 to 10, how heavy is this week feeling?\" Whatever they say, ask one follow-up: \"What would move it one point in a better direction?\" That's it.",
    why: "Scaling questions come from solution-focused therapy. They bypass the need to explain the whole problem and jump straight to agency.",
    duration: "3 min",
    difficulty: "Easy",
  },
  {
    id: "quiet-shared-breathing",
    category: "Quiet Rituals",
    emoji: "🕯️",
    title: "Two breaths together",
    description:
      "Before a stressful event (exam day, big conversation), stand together and take exactly two deep breaths. No words. No pep talk. Just shared regulation.",
    why: "Co-regulation (calming together) is more powerful than solo regulation for teens. Your nervous system cues theirs.",
    duration: "1 min",
    difficulty: "Easy",
  },
];

const ANTI_PATTERNS = [
  {
    title: "The interrogation trap",
    bad: "\"How was school? What happened? Who did you talk to? Did you eat?\"",
    better: "One question. Then wait. Silence is not failure — it's space.",
  },
  {
    title: "The fix-it reflex",
    bad: "\"Here's what you should do...\" (before they finish talking)",
    better: "\"That sounds hard. Do you want me to help think it through, or just listen?\"",
  },
  {
    title: "The comparison trap",
    bad: "\"Your sister handles stress so much better\" or \"When I was your age...\"",
    better: "Every comparison activates All-or-Nothing Thinking. Name what you see in them, not what you see in others.",
  },
  {
    title: "The reassurance loop",
    bad: "\"Don't worry, it'll be fine! Everything always works out.\"",
    better: "\"I can see this matters to you. What's the most likely thing that will actually happen?\"",
  },
  {
    title: "The surveillance reveal",
    bad: "\"I saw on your screen that...\" or \"Your mood score dropped, what happened?\"",
    better: "Never reference specific data from this app. Ask about their day, not their dashboard.",
  },
];

export default function ParentMomentsPage() {
  return (
    <div className="parent-page">
      <section className="parent-hero parent-hero-compact">
        <div className="parent-hero-eyebrow">Moments</div>
        <h1 className="parent-hero-title">Sideways, not head-on.</h1>
        <p className="parent-hero-lede">
          The best conversations with teens happen shoulder-to-shoulder — on a
          walk, in the car, during cooking. These are small, timed activities
          designed to create connection without pressure.
        </p>
      </section>

      {/* ── Category Overview ── */}
      <section className="parent-section">
        <span className="parent-section-chip">Moment types</span>
        <div className="parent-moment-categories">
          {MOMENT_CATEGORIES.map((cat) => (
            <div className={`parent-moment-cat parent-moment-cat-${cat.colour}`} key={cat.category}>
              <span className="parent-moment-cat-emoji">{cat.emoji}</span>
              <strong>{cat.category}</strong>
              <p>{cat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Suggested Moments ── */}
      <section className="parent-section">
        <span className="parent-section-chip">Suggested this week</span>
        <div className="parent-moment-list">
          {SUGGESTED_MOMENTS.map((moment) => (
            <article className="parent-moment-card-full" key={moment.id}>
              <div className="parent-moment-card-top">
                <span className="parent-moment-card-emoji">{moment.emoji}</span>
                <div>
                  <span className="parent-moment-card-cat">{moment.category}</span>
                  <h3>{moment.title}</h3>
                </div>
                <div className="parent-moment-card-meta">
                  <span>{moment.duration}</span>
                  <span>{moment.difficulty}</span>
                </div>
              </div>
              <p className="parent-moment-card-desc">{moment.description}</p>
              <p className="parent-moment-card-why">
                <strong>Why this, why now: </strong>
                {moment.why}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Anti-Patterns ── */}
      <section className="parent-section">
        <span className="parent-section-chip">What to avoid</span>
        <p className="parent-hero-lede" style={{ marginBottom: 16 }}>
          These are common patterns that feel helpful but activate the exact
          thinking traps your teen is learning to catch. Spotting them in
          yourself is the most powerful thing you can model.
        </p>
        <div className="parent-antipattern-list">
          {ANTI_PATTERNS.map((ap) => (
            <div className="parent-antipattern-card" key={ap.title}>
              <h3>{ap.title}</h3>
              <div className="parent-ap-row parent-ap-bad">
                <span className="parent-ap-icon">✕</span>
                <p>{ap.bad}</p>
              </div>
              <div className="parent-ap-row parent-ap-good">
                <span className="parent-ap-icon">✓</span>
                <p>{ap.better}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
