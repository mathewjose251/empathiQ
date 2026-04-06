/*
 * ─── PARENT LEARN ────────────────────────────────────────────
 *
 * REBT education for parents. The same thinking traps teens
 * learn about, reframed with parent-specific examples.
 * The goal: parents become co-learners, not supervisors.
 */

const THINKING_TRAPS_FOR_PARENTS = [
  {
    name: "Catastrophizing",
    emoji: "🌪️",
    teenExample:
      "\"I'm going to fail the exam, then I won't get into college, and my life will be ruined.\"",
    parentMirror:
      "\"If they fail this test, they'll never recover. I should have pushed them harder.\"",
    reframe:
      "What is the most likely outcome? Not the best, not the worst — the most realistic one.",
    tryAtHome:
      "During a walk, compare three versions of the same worry — worst case, best case, most likely. Don't fix anything. Just widen the frame.",
    dontDoThis:
      "Don't say \"Stop worrying\" or \"It's not a big deal.\" Dismissing the feeling makes it louder.",
  },
  {
    name: "All-or-Nothing Thinking",
    emoji: "⚫⚪",
    teenExample:
      "\"I got a B. I'm a failure. There's no point trying anymore.\"",
    parentMirror:
      "\"Either they get top marks or they're wasting their potential. There's no middle ground.\"",
    reframe:
      "What are three things between 'perfect' and 'disaster' that would still count as real progress?",
    tryAtHome:
      "When they share a result, name one specific thing that went well before discussing what didn't.",
    dontDoThis:
      "Don't compare them to siblings, classmates, or your own school days. It triggers the very trap they're learning to catch.",
  },
  {
    name: "Mind Reading",
    emoji: "🔮",
    teenExample:
      "\"Everyone in class thinks I'm weird. My teacher hates me. My friends are just being nice out of pity.\"",
    parentMirror:
      "\"The teacher must think I'm a bad parent. Other families have it together.\"",
    reframe:
      "What evidence do I actually have? Am I reading minds or reading facts?",
    tryAtHome:
      "When they say \"everyone hates me,\" ask gently: \"What did someone actually say?\" vs \"What are you imagining they're thinking?\"",
    dontDoThis:
      "Don't say \"That's not true\" without asking first. Invalidating without understanding pushes them further into the trap.",
  },
  {
    name: "Emotional Reasoning",
    emoji: "💔",
    teenExample:
      "\"I feel anxious, so something bad must be about to happen.\"",
    parentMirror:
      "\"I feel worried about them, so something must actually be wrong.\"",
    reframe:
      "A feeling is real, but it isn't proof. What would change if the feeling were just a signal, not a verdict?",
    tryAtHome:
      "Name the feeling together: \"I notice I'm feeling anxious too. That doesn't mean something is wrong — it means this matters to us.\"",
    dontDoThis:
      "Don't project your anxiety onto them. \"You seem stressed\" when they're fine can install worry where there was none.",
  },
  {
    name: "Should Statements",
    emoji: "📏",
    teenExample:
      "\"I should be able to handle this. Everyone else manages fine. What's wrong with me?\"",
    parentMirror:
      "\"They should be more grateful. At their age, I was already managing the house.\"",
    reframe:
      "Replace 'should' with 'I'd prefer.' It shifts from judgment to preference, which is negotiable.",
    tryAtHome:
      "Catch your own 'should' statements out loud: \"I was about to say you should study more. What I actually mean is I'd feel calmer if I knew you had a plan.\"",
    dontDoThis:
      "Don't use guilt-based comparisons: \"When I was your age...\" This activates the should loop, not the solution.",
  },
  {
    name: "Labeling",
    emoji: "🏷️",
    teenExample:
      "\"I'm stupid. I'm a loser. I'm the weird one in the group.\"",
    parentMirror:
      "\"They're lazy. They're irresponsible. They just don't care.\"",
    reframe:
      "Separate the person from the action. \"I made a mistake\" is different from \"I am a failure.\"",
    tryAtHome:
      "When frustrated, describe what happened without labeling: \"The homework didn't get done\" instead of \"You're so irresponsible.\"",
    dontDoThis:
      "Never label them — even affectionately. \"My dramatic one\" or \"the sensitive child\" become identity prisons.",
  },
  {
    name: "Overgeneralization",
    emoji: "♾️",
    teenExample:
      "\"This always happens to me. Nobody ever listens. I'll never get it right.\"",
    parentMirror:
      "\"We've tried everything. Nothing ever works with them.\"",
    reframe:
      "Replace 'always' and 'never' with 'this time' and 'so far.' One event is not a pattern.",
    tryAtHome:
      "When you hear \"always\" or \"never,\" gently ask: \"Can you think of one time it went differently?\"",
    dontDoThis:
      "Don't use absolute language yourself: \"You never listen\" trains the same trap you're trying to break.",
  },
];

const PARENT_REBT_PRINCIPLES = [
  {
    principle: "Feelings are valid. Conclusions from feelings are not always accurate.",
    explanation:
      "When your teen says \"I feel stupid,\" the feeling is real. But the conclusion — that they ARE stupid — is the trap. REBT helps separate the signal from the story.",
  },
  {
    principle: "You cannot control what they think. You can model better thinking.",
    explanation:
      "Teens learn more from watching you handle frustration than from any lecture about handling frustration. When you catch your own traps out loud, it normalises the process.",
  },
  {
    principle: "Curiosity beats correction.",
    explanation:
      "Asking \"What's the story your brain is telling right now?\" is more powerful than \"Stop being so negative.\" One opens a door; the other slams it.",
  },
  {
    principle: "Progress is not linear. Bad days are not backslides.",
    explanation:
      "A week of good streaks followed by a rough day is normal. The trap is treating the bad day as proof that progress was fake.",
  },
];

export default function ParentLearnPage() {
  return (
    <div className="parent-page">
      <section className="parent-hero parent-hero-compact">
        <div className="parent-hero-eyebrow">Learn</div>
        <h1 className="parent-hero-title">
          The same traps, different mirrors.
        </h1>
        <p className="parent-hero-lede">
          Your teen is learning to spot thinking traps through stories. These
          are the same traps, reframed for parents — because the patterns
          run in families, and the best way to help is to become a co-learner.
        </p>
      </section>

      {/* ── REBT Principles for Parents ── */}
      <section className="parent-section">
        <span className="parent-section-chip">
          Core principles (REBT for families)
        </span>
        <div className="parent-principles-list">
          {PARENT_REBT_PRINCIPLES.map((p) => (
            <div className="parent-principle-card" key={p.principle}>
              <h3>{p.principle}</h3>
              <p>{p.explanation}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Thinking Trap Cards ── */}
      <section className="parent-section">
        <span className="parent-section-chip">Thinking traps — parent edition</span>
        <div className="parent-trap-cards">
          {THINKING_TRAPS_FOR_PARENTS.map((trap) => (
            <article className="parent-trap-card" key={trap.name}>
              <div className="parent-trap-card-header">
                <span className="parent-trap-card-emoji">{trap.emoji}</span>
                <h3>{trap.name}</h3>
              </div>

              <div className="parent-trap-card-section">
                <span className="parent-trap-card-label">
                  When your teen says...
                </span>
                <p className="parent-trap-card-quote">{trap.teenExample}</p>
              </div>

              <div className="parent-trap-card-section">
                <span className="parent-trap-card-label">
                  When you catch yourself thinking...
                </span>
                <p className="parent-trap-card-quote parent-trap-card-mirror">
                  {trap.parentMirror}
                </p>
              </div>

              <div className="parent-trap-card-section">
                <span className="parent-trap-card-label">The reframe</span>
                <p>{trap.reframe}</p>
              </div>

              <div className="parent-trap-card-actions">
                <div className="parent-trap-card-do">
                  <strong>Try this at home</strong>
                  <p>{trap.tryAtHome}</p>
                </div>
                <div className="parent-trap-card-dont">
                  <strong>What to avoid</strong>
                  <p>{trap.dontDoThis}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
