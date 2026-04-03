# EmpathiQ Missions: Visual Map

## 🗺️ All 15 Missions by Theme

```
┌─────────────────────────────────────────────────────────────────────┐
│                      EMPATHIQ MISSIONS LIBRARY                      │
│                           (15 Scenarios)                            │
└─────────────────────────────────────────────────────────────────────┘

🎓 SCHOOL (5 missions)
├── 1️⃣  night-before-finals
│   └─ "The Night Before Finals"
│      Exam anxiety / Catastrophizing vs Accurate Thinking
│
├── 5️⃣  grade-on-test
│   └─ "Not Perfect"
│      One bad grade = total failure? / Overgeneralization vs Accurate
│
├── 9️⃣  presentation-fear
│   └─ "In Front of Everyone"
│      Public speaking anxiety / Catastrophizing vs Accurate Thinking
│
├── 1️⃣2️⃣ college-decision
│   └─ "Path Pressure"
│      Career uncertainty / Should Statements vs Accurate Thinking
│
└── 1️⃣5️⃣ peer-achievement
    └─ "Their Success"
       Peer succeeds, you feel less / Emotional Reasoning vs Accurate


👥 PEER & SOCIAL (5 missions)
├── 3️⃣  social-media-comparison
│   └─ "Social Media Spiral"
│      FOMO from curated posts / Emotional Reasoning vs Accurate
│
├── 8️⃣  crush-worry
│   └─ "Worried About What They Think"
│      One text = rejection? / Catastrophizing vs Accurate Thinking
│
├── 1️⃣1️⃣ friend-text-unanswered
│   └─ "Left on Read"
│      Silence = end of friendship? / Mind Reading vs Accurate
│
├── 1️⃣3️⃣ peer-achievement
│   └─ "Their Success"
│      Their win = your loss? / Emotional Reasoning vs Accurate
│
└── 1️⃣5️⃣ different-from-peers
    └─ "Not Like Them"
       Difference = broken? / Labeling vs Accurate Thinking


👨‍👩‍👧 FAMILY (2 missions)
├── 2️⃣  family-dinner-tension
│   └─ "Family Dinner Tension"
│      One comment = total judgment? / All-or-Nothing vs Accurate
│
└── 1️⃣4️⃣ sibling-boundary-crossed
    └─ "That Wasn't Okay"
       Rage in the moment / Emotional Reasoning vs Accurate Thinking


🧠 SELF & PERSONAL (3 missions)
├── 5️⃣  mistake-at-work
│   └─ "The Mistake"
│      One error = fundamentally broken? / Labeling vs Accurate
│
├── 6️⃣  caffeine-before-bed
│   └─ "Caffeine at Night"
│      Rules don't apply to me? / Should Statements vs Accurate
│
└── 7️⃣  mirror-moment
    └─ "What You See in the Mirror"
       One flaw = everything wrong? / All-or-Nothing vs Accurate


📱 DIGITAL (1 mission)
└── 4️⃣  phone-late-night
    └─ "Phone at Midnight"
       FOMO + sleep loss / Catastrophizing vs Accurate Thinking
```

---

## 🧩 Thinking Trap Distribution

```
Healthy Outcome (ACCURATE_THINKING)
════════════════════════════════════════════════════════ 12 missions

Catastrophizing
════════════════════════ 5 missions
(Finals, Phone, Crush, Presentation, Social Media)

All-or-Nothing Thinking
═════════ 2 missions
(Family Dinner, Mirror)

Should Statements
═════════ 2 missions
(Caffeine, College Decision)

Overgeneralization
═════════ 2 missions
(Family Dinner, Test Grade)

Emotional Reasoning
═════════ 2 missions
(Social Media, Peer Achievement)

Labeling
════ 1 mission
(The Mistake)

Mind Reading
════ 1 mission
(Left on Read)
```

---

## 📊 Theme Distribution

```
School       ████████░░ 33% (5 missions) - Exams, grades, presentations, careers
Peer/Social  ████████░░ 33% (5 missions) - Crushes, friends, comparison, belonging
Self         ██░░░░░░░░ 20% (3 missions) - Mistakes, sleep, body image
Family       ███░░░░░░░  7% (2 missions) - Dinner, boundaries
Digital      ██░░░░░░░░  7% (1 mission)  - Phone habits
```

---

## 🔄 Scenario Flow Example

Taking "night-before-finals" as an example:

```
📱 Mobile App loads mission
         ↓
🎬 Displays narrative + sensory prompt
   "Your phone lights up about tomorrow's exam..."
   "Feel your feet on the floor..."
         ↓
🤔 Teen sees two paths
   Path 1: "Take a breath, remind yourself one test ≠ future"
   Path 2: "Spiral and assume this test will ruin everything"
         ↓
👆 Teen taps a choice
         ↓
📍 Backend records:
   - MissionAttempt created
   - MissionChoice tagged with ThinkingTrap
   - Consequence displayed: "You create space... which helps you plan"
         ↓
💭 Teen reflects anonymously
   "What did this choice feel like?"
         ↓
✅ Data stored for:
   - Mentor to review patterns over time
   - Parent to see thinking improvement trends
   - Weekly replay to show frequency of thinking traps
```

---

## 🚀 Getting Started

### 1. Re-seed with all 15 missions
```bash
cd packages/database
pnpm seed
cd ../..
```

### 2. Check what was seeded
```bash
# In your database client:
SELECT slug, title, theme FROM "Mission" ORDER BY slug;
```

Expected output: 15 rows

### 3. Mobile app will load them
```bash
pnpm dev:mobile
```

Mobile now has access to:
- `GET /api/teen/missions` → returns all 15
- `GET /api/teen/missions/night-before-finals` → returns single with choices

### 4. Test different missions
The mobile app currently hardcodes to "night-before-finals" on load.
In Phase 2, you can change the slug to test any mission:

```ts
// In MissionHubScreen.tsx, change:
const loadedMission = await fetchMissionBySlug("night-before-finals");

// To any mission slug:
const loadedMission = await fetchMissionBySlug("social-media-comparison");
```

---

## 📋 Mission Checklist

- [x] 15 missions designed
- [x] Mission factory created
- [x] Seed script handles all 15
- [x] API ready to serve them
- [x] Mobile app can load any mission by slug
- [ ] Test all 15 work end-to-end
- [ ] Add mission selector UI to mobile (Phase 2)
- [ ] Connect to recommendation engine (Phase 2)

---

## 💭 Philosophy Behind Each Category

### 🎓 School Missions
Teens face constant academic pressure. These missions help them distinguish between "I made a mistake" (normal, fixable) and "I am a failure" (thinking trap).

### 👥 Peer Missions
Peer relationships and social anxiety are huge in adolescence. These missions teach the difference between reality and the catastrophic stories their minds spin.

### 👨‍👩‍👧 Family Missions
Family is the foundation. Even healthy families have conflict. These missions help teens communicate needs without catastrophizing or shutting down.

### 🧠 Self Missions
Self-criticism is normal. These missions help teens notice when one mistake or moment becomes "proof" they're broken.

### 📱 Digital Mission
Screen culture is new for teens. This mission addresses how FOMO and late-night scrolling disrupt sleep and well-being.

---

## 🎯 Success Criteria

After re-seeding, you should see:

```bash
✅ pnpm seed completes without errors
✅ 15 Mission rows in database
✅ GET /api/teen/missions returns all 15 with full metadata
✅ Mobile app loads "night-before-finals" successfully
✅ User can choose a path and see consequence
✅ MissionAttempt + MissionChoice recorded in DB
```

Ready to test? Run:
```bash
pnpm install
pnpm prisma:migrate
cd packages/database && pnpm seed && cd ../..
pnpm dev:web &
pnpm dev:mobile
```

Then tap through different missions! 🚀
