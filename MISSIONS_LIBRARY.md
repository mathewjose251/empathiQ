# EmpathiQ Missions Library

**15 scenarios** for teens to practice emotional regulation and thinking patterns.

Each mission presents a real teen situation, offers two choices (one healthy, one unhealthy), and tags the thinking patterns involved.

---

## 📚 All Missions

### 🎓 School (5 Missions)

| # | Slug | Title | Scenario | Healthy Choice | Unhealthy Choice |
|---|------|-------|----------|----------------|------------------|
| 1 | `night-before-finals` | The Night Before Finals | Exam anxiety spiraling | Accurate thinking + planning | Catastrophizing |
| 5 | `grade-on-test` | Not Perfect | Getting a B grade | Accept good grade, learn | Overgeneralization |
| 9 | `presentation-fear` | In Front of Everyone | Public speaking anxiety | Prepare and trust yourself | Catastrophizing |
| 12 | `college-decision` | Path Pressure | Career uncertainty | Accept not knowing, explore | Should statements |
| 15 | `peer-achievement` | Their Success | Peer gets scholarship/role | Celebrate them, focus on self | Emotional reasoning |

### 👨‍👩‍👧 Family (2 Missions)

| # | Slug | Title | Scenario | Healthy Choice | Unhealthy Choice |
|---|------|-------|----------|----------------|------------------|
| 2 | `family-dinner-tension` | Family Dinner Tension | Parent criticism at dinner | Ask clarifying question | All-or-nothing thinking |
| 14 | `sibling-boundary-crossed` | That Wasn't Okay | Sibling invades privacy | Cool down, talk calmly | Emotional rage |

### 👥 Peer & Social (5 Missions)

| # | Slug | Title | Scenario | Healthy Choice | Unhealthy Choice |
|---|------|-------|----------|----------------|------------------|
| 3 | `social-media-comparison` | Social Media Spiral | Peers at party while alone | Remember curated posts, text friend | Emotional reasoning |
| 8 | `crush-worry` | Worried About What They Think | Crush texts someone else | Remember one text ≠ relationship | Catastrophizing |
| 11 | `friend-text-unanswered` | Left on Read | Friend doesn't reply immediately | Give space without spiraling | Mind reading |
| 13 | `peer-achievement` | Their Success | Peer succeeds; you feel less | Celebrate + refocus on self | Emotional reasoning |
| 15 | `different-from-peers` | Not Like Them | Realizing you're different | Own difference, find your people | Labeling |

### 📱 Digital & Technology (1 Mission)

| # | Slug | Title | Scenario | Healthy Choice | Unhealthy Choice |
|---|------|-------|----------|----------------|------------------|
| 4 | `phone-late-night` | Phone at Midnight | Can't sleep due to FOMO | Set phone down | Catastrophizing |

### 🧠 Self & Personal (3 Missions)

| # | Slug | Title | Scenario | Healthy Choice | Unhealthy Choice |
|---|------|-------|----------|----------------|------------------|
| 5 | `mistake-at-work` | The Mistake | Small error spirals into shame | Name it, fix it, learn | Labeling |
| 6 | `caffeine-before-bed` | Caffeine at Night | Choosing energy drink over sleep | Skip caffeine, sleep well | Should statements |
| 7 | `mirror-moment` | What You See in the Mirror | Body image criticism | Appreciate what body can do | All-or-nothing |

---

## 🎯 Thinking Traps Covered

Each mission targets one or two thinking patterns. Distribution:

| Trap | Count | Missions |
|------|-------|----------|
| `ACCURATE_THINKING` | 12 | ✅ Healthy choice in most missions |
| `CATASTROPHIZING` | 5 | Finals, Phone, Crush, Presentation, Social Media |
| `ALL_OR_NOTHING` | 2 | Family Dinner, Mirror |
| `MIND_READING` | 1 | Left on Read |
| `OVERGENERALIZATION` | 2 | Family Dinner, Test Grade |
| `LABELING` | 2 | The Mistake, Identity |
| `EMOTIONAL_REASONING` | 2 | Peer Achievement, Social Media |
| `SHOULD_STATEMENTS` | 2 | Caffeine, College Decision |

---

## 🌈 Themes

- **School pressure** (5) — Academic anxiety, perfectionism, presentations, college
- **Peer/Social** (5) — Comparison, crushes, belonging, friendships
- **Family dynamics** (2) — Conflict, boundaries, communication
- **Self-worth** (3) — Mistakes, body image, self-criticism
- **Digital wellbeing** (1) — Phone habits, FOMO

---

## 🚀 Using in Phase 1

All 15 missions are seeded in the database. The mobile app can:

1. **List all missions** — `GET /api/teen/missions` (returns all 15)
2. **Load by slug** — `GET /api/teen/missions/night-before-finals` (load single)
3. **Track completion** — MissionAttempt records which ones are completed

### Current Flow
- Mobile hardcodes to `night-before-finals` (Mission 1) on load
- In Phase 2, recommendation engine will suggest which mission each teen sees

---

## 📊 Data Structure

Each mission has:
```ts
{
  slug: string              // URL-safe ID
  title: string             // Display name
  theme: string             // school | family | peer | digital | self
  chapterLabel: string      // e.g., "Choice Fork 01"
  narrativeIntro: string    // Scene-setting text
  sensoryPrompt: string     // Grounding instruction
  estimatedMinutes: number  // Time to complete
  decisions: [              // Always 2 options
    {
      label: string                      // Choice text
      narrativeOutcome: string           // What happens if chosen
      thinkingTrapId: ThinkingTrapCode   // The pattern this exposes
    },
    { ... }
  ]
}
```

---

## 🔄 Seeding Missions

To update missions in the database after editing `missionFactory.ts`:

```bash
cd packages/database
pnpm seed
```

This will:
1. Create/update 8 thinking trap categories
2. Create/update 15 missions
3. Link decision options to thinking traps

---

## 💡 Extending the Library

To add a new mission:

```ts
// In missionFactory.ts
"new-mission-slug": createMission({
  slug: "new-mission-slug",
  title: "Mission Title",
  theme: "school" | "family" | "peer" | "digital" | "self",
  chapterLabel: "Choice Fork 16",
  estimatedMinutes: 3,
  narrativeIntro: "Scene setting...",
  sensoryPrompt: "Grounding technique...",
  decisions: [
    {
      label: "Healthy choice",
      narrativeOutcome: "Positive consequence",
      thinkingTrapId: "ACCURATE_THINKING"
    },
    {
      label: "Unhealthy choice",
      narrativeOutcome: "Negative consequence",
      thinkingTrapId: "CATASTROPHIZING"  // or other trap
    }
  ]
}),
```

Then re-seed:
```bash
pnpm --filter @empathiq/database seed
```

---

## 🎨 Design Philosophy

1. **Real Scenarios** — Each mission reflects actual teen situations
2. **Binary Choice** — Two options make the thinking pattern clear
3. **Sensory Grounding** — Each has a grounding prompt to help the teen regulate before choosing
4. **Consequence Narrative** — The outcome text shows what happens with each choice
5. **Non-Judgmental** — The "unhealthy" choice isn't shamed; it shows what happens naturally
6. **Diverse Themes** — Covers school, peer, family, digital, and self domains
7. **Scalable** — Template system makes adding 50+ missions feasible

---

## 📈 Next: Phase 2

In Phase 2, we'll:
- **Daily signal check-in** — Assess teen's current state
- **Mission recommendation** — Score which domain matches today's load
- **Personalized lane** — Suggest missions from school/peer/family/digital/self based on intake
- **Weekly patterns** — Aggregate completed missions to show thinking patterns over time
- **Mentor bridge** — Show mentors which missions teen engages with

---

## Files

- **Definition:** `packages/shared/src/missions/missionFactory.ts`
- **Seeding:** `packages/database/seed.ts`
- **Mobile usage:** `apps/teen-mobile/src/features/missions/` (API + screens)
- **API:** `apps/parent-portal/app/api/teen/missions/`

---

**Total:** 15 missions ready to use. Expandable to 50+ with same structure.
