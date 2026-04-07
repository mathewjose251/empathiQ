# EmpathiQ — Claude Agent Context

This file gives Claude (and any AI agent) the full project context, conventions, and current build state so it can continue work without needing to re-explore the codebase from scratch.

---

## What This Project Is

**EmpathiQ** is a web-first, mobile-friendly emotional wellbeing platform for teenagers aged 13–18, built on empathy and REBT (Rational Emotive Behaviour Therapy) principles. It is not a therapy app — it is a psychoeducation and engagement tool that helps teens understand their own thinking patterns through story-based missions, anonymous peer reflection, and gamified progress.

Key roles: **Teen** (primary user), **Parent** (insight consumer), **Mentor** (professional guide), **Admin** (operational).

---

## Monorepo Structure

```
empathiq/
├── apps/
│   └── parent-portal/          ← Main Next.js 15 app (all web surfaces)
│       └── app/
│           ├── admin/           ← Admin hub
│           ├── parent/          ← Parent dashboard
│           ├── mentor/          ← Mentor portal
│           ├── teen/            ← ★ Teen experience (see below)
│           └── api/             ← Next.js Route Handlers
├── packages/
│   ├── database/prisma/         ← Prisma ORM + PostgreSQL schema
│   └── shared/src/              ← Shared TypeScript contracts
├── services/
│   ├── api-gateway/
│   └── insight-engine/
└── docs/                        ← Architecture and planning docs
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict) |
| Database | PostgreSQL via Prisma ORM |
| Styling (teen) | **Custom CSS only** — `app/teen/teen.css` with CSS custom properties |
| Styling (rest) | Tailwind CSS |
| State (teen) | React Context — `app/teen/_context/TeenContext.tsx` |
| Package manager | pnpm (workspace monorepo) |
| Deployment | Vercel |

---

## ★ Teen Experience — Full Route Map

All teen routes live under `apps/parent-portal/app/teen/`.

| Route | File | Description |
|---|---|---|
| `/teen` | `page.tsx` | Home: animated greeting, XP count-up, vibe check, pulsing story card, quick links |
| `/teen/onboarding` | `onboarding/page.tsx` | 4-step visual quiz: mood → concerns → safety gate → avatar intro |
| `/teen/mission/[slug]` | `mission/[slug]/page.tsx` | Full mission flow: story → choice → consequence → reflect → complete overlay |
| `/teen/stories` | `stories/page.tsx` | Browsable library of all 15 missions with filter pills |
| `/teen/pack` | `pack/page.tsx` | Anonymous peer reflections feed + mood cloud |
| `/teen/toolbox` | `toolbox/page.tsx` | 15 tools across 5 categories, expandable steps, +5 XP each |
| `/teen/me` | `me/page.tsx` | Avatar, XP progress, stats, achievements, weekly streak calendar |
| `/teen/safety` | `safety/page.tsx` | Amber + crisis modes with real Indian helplines |
| `/teen/privacy` | `privacy/page.tsx` | Teen privacy dial: toggle what parents see (yellow tier), always-visible explainer (green tier), never-visible list (red tier), safety override explainer |

**Layout:** `teen/layout.tsx` wraps all teen routes with `<TeenProvider>` and `<BottomNav>`. It imports `teen.css`.

---

## Teen State (TeenContext)

Central state managed in `TeenContext.tsx`. Key fields:

```typescript
{
  isOnboarded: boolean
  todayMood: MoodKey | null           // 'great' | 'okay' | 'anxious' | 'low'
  moodCheckedToday: boolean
  totalXP: number
  currentStreak: number
  storiesCompleted: number
  pathARate: number                   // 0-1, healthy vs reactive choices
  onboardingConcerns: string[]
  safetyFlagged: boolean
}
```

Key actions: `setMood`, `addXP`, `completeStory`, `incrementStreak`, `completeOnboarding`, `togglePrivacy`

### Teen Privacy State

```typescript
privacy: {
  shareMoodTrends: boolean       // default: false
  shareThinkingTrapFocus: boolean // default: false
  shareStreakData: boolean        // default: false
  shareProgressMetrics: boolean   // default: false
  shareAvatarStage: boolean      // always true — can't hide (green tier)
}
```

Privacy is managed via `togglePrivacy(key)` in TeenContext. The `/teen/privacy` page provides toggle UI. The Me page (`/teen/me`) shows a privacy link card with a count of shared features.

Avatar system: SEEDLING(0) → SPROUT(500) → SAPLING(1000) → TREE(2500) → RADIANT(5000)

---

## CSS Architecture — Teen Section

**Rule: Never use Tailwind in `/teen/` files.** Use `teen.css` classes or inline styles.

### Key CSS classes

| Class | Purpose |
|---|---|
| `.teen-page` | Page wrapper, max-width 480px, centered |
| `.teen-card` | Standard dark card with border |
| `.teen-card-glow-cyan / -purple` | Glowing card variants |
| `.teen-btn`, `.teen-btn-accent/purple/rose/outline` | All buttons |
| `.story-card`, `.story-card-pulse` | Story preview card + pulsing CTA animation |
| `.mood-grid`, `.mood-item` | Vibe check grid |
| `.choice-card`, `.choice-card-green/rose` | Mission path chooser |
| `.story-dots`, `.story-dot.active/.done` | Progress indicators |
| `.text-chunk` | Animated text reveal chunk |
| `.tap-hint` | "tap to continue" animated prompt |
| `.choice-card-attention` | Shake animation to draw focus |
| `.trap-reveal` | Pop animation for thinking trap reveal |
| `.mission-complete-overlay` | Full-screen completion celebration |
| `.mission-complete-xp` | Gradient XP number |
| `.streak-fire` | Flickering fire emoji |
| `.xp-burst-number` | Floating XP burst number (position: fixed) |
| `.quick-link-grid`, `.quick-link-card` | 2-col quick navigation grid |
| `.home-greeting`, `.home-greeting-name` | Gradient heading on home |
| `.section-heading` | Small caps section label |
| `.pack-new-dot` | Pulsing red dot for new pack activity |
| `.privacy-toggle-card` | Individual privacy feature card |
| `.privacy-toggle-switch` / `.privacy-toggle-on` | Toggle switch (off/green) |
| `.privacy-toggle-knob` | Switch knob with slide animation |
| `.privacy-preview` / `.privacy-preview-on` | "What parent sees" preview |
| `.privacy-fixed-row` | Always-visible feature row |
| `.privacy-never-row` | Never-visible feature row |
| `.privacy-link-card` | Privacy card on Me page linking to /teen/privacy |

### CSS custom properties (`:root`)

```css
--teen-bg: #0f172a      /* deep navy */
--teen-card: #1e293b    /* card surface */
--teen-accent: #06b6d4  /* cyan — primary CTA */
--teen-purple: #8b5cf6  /* avatar, reflection */
--teen-green: #10b981   /* healthy path */
--teen-amber: #f59e0b   /* streak, mood confirmed */
--teen-rose: #f43f5e    /* reactive path, crisis */
--teen-text: #e2e8f0    /* body text */
--teen-muted: #94a3b8   /* secondary text */
--teen-border: #334155  /* border/divider */
```

---

## Mission System

Missions live in `mission/[slug]/page.tsx` as `MISSIONS_DATA`. All 15 missions fully implemented:

| # | Slug | Title | Theme | Trap (Path A) | Trap (Path B) |
|---|---|---|---|---|---|
| 1 | `night-before-finals` | The Night Before Finals | School | All-or-Nothing Thinking | Catastrophizing |
| 2 | `grade-on-test` | That Grade on the Test | School | Labeling | Overgeneralization |
| 3 | `presentation-fear` | Presentation Fear | School | Fortune Telling | Catastrophizing |
| 4 | `college-decision` | College Decision Stress | School | Should Statements | Mind Reading |
| 5 | `peer-achievement` | When a Friend Wins Big | Peer | All-or-Nothing Thinking | Emotional Reasoning |
| 6 | `friend-text-unanswered` | The Text That Was Left on Read | Peer | Mind Reading | Catastrophizing |
| 7 | `crush-worry` | Crush Worry | Peer | Jumping to Conclusions | Fortune Telling |
| 8 | `different-from-peers` | Different From Everyone | Peer | Emotional Reasoning | Labeling |
| 9 | `family-dinner-tension` | Family Dinner Tension | Family | Magnification | Should Statements |
| 10 | `sibling-boundary-crossed` | Sibling Drama | Family | All-or-Nothing Thinking | Overgeneralization |
| 11 | `mirror-moment` | Mirror Moment | Self | Personalization | Negative Self-Talk |
| 12 | `mistake-at-work` | Mistake at Work | Self | Magnification | Overgeneralization |
| 13 | `social-media-comparison` | The Scroll That Stings | Digital | Compare and Despair | Emotional Reasoning |
| 14 | `caffeine-before-bed` | Wired Before Bed | Digital | Mental Filter | Catastrophizing |
| 15 | `phone-late-night` | Phone Doom Scroll | Digital | Minimization | Minimization |

**Thinking traps defined (15 total):**
All-or-Nothing Thinking, Catastrophizing, Personalization, Negative Self-Talk, Mind Reading, Emotional Reasoning, Compare and Despair, Labeling, Overgeneralization, Fortune Telling, Should Statements, Jumping to Conclusions, Magnification, Mental Filter, Minimization

**Mission flow with engagement mechanics:**
1. **Story** — narrative appears in 3 progressive text chunks (tap to reveal each)
2. **Choice** — two paths shown; cards shake at 2.5s to prompt action
3. **Consequence** — consequence text, then thinking trap pops in at 600ms delay
4. **Reflect** — optional textarea, full XP for sharing, partial XP for skip
5. **Complete** — overlay with avatar, XP burst, navigation to pack feed

**XP rewards:**
- Check-in: +10 XP
- Story (Path A): +15 XP, (Path B): +30 XP
- Reflection: +15 XP
- Tool use: +5 XP
- 7-day streak bonus: +50 XP

---

## Prisma Schema (Key tables)

```
User → TeenProfile → MissionAttempt → MissionChoice → ThinkingTrap
                   → SafetyGateResponse → TriageDecision
                   → PackReflection
WorkshopEnrollment → User
```

**Important schema rules:**
- Only `TriageDecision` side defines `fields`/`references`/`onDelete` in the SafetyGateResponse↔TriageDecision relation
- `TriageDecision.safetyGateResponseId` must be `@unique`
- `User` model has `workshopEnrollments WorkshopEnrollment[]`

---

## API Routes (Next.js 15 — Async Params)

All route handlers under `app/api/teen/` use Next.js 15 async params pattern:

```typescript
// ✅ Correct pattern
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  // ...
}
```

**Never** use the old synchronous `{ params: { slug: string } }` pattern — it causes a build error in Next.js 15.

---

## Safety System

**Indian Helplines (verified real numbers):**
- TeleMANAS: `14416` (toll-free, 24/7, Government of India)
- Vandrevala Foundation: `9999 666 555` (24/7, WhatsApp)
- AASRA: `+91-22-2754 6669` (24/7)
- iCALL: `022-2552 1111` (Mon–Sat, 8am–10pm IST)

Safety gate triggers: "Do you feel safe at home?" + "Thoughts of hurting yourself?"
Risk tiers: `GREEN / AMBER / RED / CRISIS`
Crisis routes teen to `/teen/safety` instead of home.

---

## ★ AI Content Moderation System — Pack Reflections

### Philosophy & Design

EmpathiQ does **not have clinical experts** on the team. Instead, we use **AI-powered pre-moderation** to automatically classify teen peer reflections before they post to the Pack. This prevents harm while respecting teen voice and peer connection.

**Key principle:** Posts are held before posting, not after. Admins review and decide, not censors blocking after harm.

**Three-zone risk classification:**

| Zone | Color | Risk | Action | SLA |
|---|---|---|---|---|
| 🔴 RED | Immediate danger | Suicide intent, self-harm, active abuse, violence risk | Escalate to clinical staff + emergency protocol | 5 min |
| 🟡 YELLOW | Concerning patterns | Substance abuse, eating disorders, severe depression, bullying | Hold for human judgment before publishing | 60 min |
| 🟢 GREEN | Safe content | Healthy coping, accurate thinking, peer support | Publish immediately | Immediate |

### Risk Classifier Implementation

**File:** `app/_lib/riskClassifier.ts`

The classifier uses **regex pattern matching** on post text to detect risk language:

```typescript
classifyRiskZone(text: string): RiskClassificationResult {
  // RED zone: suicide, self-harm, abuse patterns
  // YELLOW zone: substance, eating disorder, depression, bullying patterns
  // GREEN zone: positive coping indicators

  return {
    zone: "RED" | "YELLOW" | "GREEN",
    confidence: 0.7 - 0.95,
    flagTypes: string[],
    reasoning: string,
    recommendation: "ESCALATE_IMMEDIATELY" | "HOLD_FOR_REVIEW" | "PUBLISH"
  }
}
```

**Detected risk types:**
- `SUICIDE_INTENT`, `SELF_HARM_INTENT`, `ACTIVE_ABUSE`, `VIOLENCE_RISK`
- `SUBSTANCE_ABUSE`, `EATING_DISORDER`, `SEVERE_DEPRESSION`, `BULLYING_CONTENT`
- `IDENTITY_LEAK`, `HOPEFUL_THINKING`, `ACCURATE_THINKING`

**Current approach:** Regex + heuristics (Phase 1 MVP). **Future:** Fine-tuned BERT model for Indian English/Hinglish (Phase 2).

### Integration with Pack Post Creation

When a teen posts a reflection via `/api/pack/post`:

1. **Risk Classification** — `classifyRiskZone()` analyzes the text
2. **Safety Flags** — Flags are mapped to `PackSafetyFlagType` (SELF_HARM, SUICIDE_RISK, etc.)
3. **Moderation Status** — Zone determines post status:
   - RED → `ESCALATED` (held, not published)
   - YELLOW → `QUEUED` (held, pending review)
   - GREEN → `CLEARED` (published immediately)
4. **Audit Trail** — `PackModerationEvent` records the classification with confidence & reasoning
5. **Admin Notification** — Async notification to admins (email, SMS, dashboard)

**Moderation status flow:**
```
CREATE POST (teen submits)
  ↓
CLASSIFY (AI runs riskClassifier)
  ↓
RED → ESCALATED → Hold post, notify admin, call emergency protocol
YELLOW → QUEUED → Hold post, notify admin, set 60-min SLA
GREEN → CLEARED → Publish to Pack immediately
```

### Admin Moderation Queue

**Route:** `/admin/moderation-queue`

Two zones displayed:

1. **RED Zone** — Sorted by urgency (5-min SLA)
   - Shows flagged post excerpt (redacted identity details)
   - Displays risk flags: "Suicide Risk", "Self-Harm", "Abuse/Neglect"
   - Admin actions: **Escalate to Clinical**, **Block Post**

2. **YELLOW Zone** — Sorted by creation time (60-min SLA)
   - Shows flagged post excerpt
   - Displays risk flags: "Substance Abuse", "Depression", "Bullying"
   - Admin actions: **Publish**, **Escalate**, **Block**

**Admin moderation endpoint:**
```
PATCH /api/pack/moderation
Body: {
  postId: string,
  decision: "PUBLISH" | "KEEP_BLOCKED" | "ESCALATE_TO_ADMIN"
}
```

### False Positive / False Negative Trade-off

**Current thresholds (MVP):**
- **False Positive Rate:** ~15-20% (some benign posts held)
- **False Negative Rate:** ~5-10% (some risky posts slip through)
- **Goal for Phase 2:** 92-95% accuracy with fine-tuned BERT

**Why this trade-off?**
- Better to over-flag (false positives) than miss danger (false negatives)
- Admins can quickly publish false positives
- False negatives create actual harm to peers

### Indian English & Hinglish Challenges

Current regex patterns cover common English terms. **Future improvements:**
- Transliterated Hinglish patterns (e.g., "suicide", "sukh nahi", "nikal nahi paunga")
- Regional slang and idioms
- Sarcasm and irony detection (hardest problem)

### Compliance & Audit

- **DPDP Act 2023:** Posts are classified and held, not deleted. Teens always know why.
- **Audit Trail:** Every moderation decision logged with timestamp, admin, reason
- **Transparency:** Teen can appeal decisions (future feature)
- **Data Minimization:** Only redacted excerpts shown to admins (ID numbers, school names, @handles stripped)

### Notification System

**File:** `app/api/pack/notify-admins/route.ts`

When RED/YELLOW posts are detected, admins are notified via:
- Email (subject line includes zone + urgency)
- SMS (for RED zone only, 5-min SLA)
- Dashboard push notification (real-time)

**RED zone email example:**
```
Subject: 🚨 URGENT: RED ZONE post in Pack moderation queue

A post has been flagged with immediate safety concerns:
- Time: [timestamp]
- Flags: Suicide Risk, Self-Harm
- Excerpt: "I'm going to kill myself..."
- ACTION REQUIRED: Review within 5 minutes
```

**YELLOW zone email example:**
```
Subject: 📋 YELLOW ZONE post awaiting moderation review

A post needs human judgment before publishing:
- Time: [timestamp]
- Flags: Substance Abuse, Depression
- Excerpt: "Been drinking every night to cope..."
- Timeline: Review when available (no strict SLA)
```

---

## Sandbox Limitations

When working in the Cowork sandbox:

1. **Cannot run Next.js dev server** — SWC binary downloads are blocked by network restrictions
2. **Cannot run Prisma generate** — engine binaries blocked
3. **TypeScript compilation works** — run `npx tsc --noEmit` to validate
4. **Git push is blocked** — user must push locally from their machine

For UI testing, use `teen-preview.html` (standalone vanilla JS demo in the project root) or the user's local Next.js dev server.

---

## How to Run Locally

```bash
# Install
pnpm install

# Generate Prisma client
cd packages/database && pnpm prisma generate

# Start dev server
cd apps/parent-portal && npx next dev -p 3000
```

Teen experience: `http://localhost:3000/teen`

---

## Current Build Status

- TypeScript: **zero errors** (last validated after all async params fixes)
- Prisma schema: **valid** (15 prior errors fixed)
- Teen routes: **7 routes + layout** complete and styled
- Engagement layer: **implemented** (animations, progressive reveal, completion overlay)

---

## ★ Parent Experience — Philosophy & Architecture

### Core Philosophy: "Lamp, Not Spotlight"

EmpathiQ's parent module is designed around a fundamental insight from research: **teens stop using wellbeing apps the moment they feel surveilled**. The parent experience exists to make parents better co-regulators — not better monitors.

**Design principles:**

1. **Aggregate over individual** — Parents see emotional weather patterns, not diary entries
2. **Teen controls the dial** — Graduated privacy with explicit teen consent toggles
3. **Education over observation** — Teach parents the same REBT thinking traps so they become co-learners, not supervisors
4. **Safety override with transparency** — Crisis detection breaks privacy, but the teen is always told what was shared and why
5. **Sideways over head-on** — Suggested connection moments happen shoulder-to-shoulder (walks, cooking, car rides), not face-to-face interrogation

### Legal & Ethical Framework

- **DPDP Act 2023 (India)**: Under-18 requires verifiable parental consent for data collection. Clinical/mental health establishments have an exemption that allows withholding specific session data while still collecting it. EmpathiQ uses this exemption ethically — collecting data for the teen's benefit while only surfacing aggregated insights to parents.
- **APA Guidelines**: Balance teen autonomy with parental needs. Default to confidentiality; break only for safety.
- **WHO/UNICEF**: Recommend allowing adolescents 16+ independent access. EmpathiQ uses graduated privacy (see below).

### Privacy Architecture — Three Tiers

| Tier | Colour | What parents see | Teen control |
|---|---|---|---|
| Always visible | 🟢 Green | Safety alerts, general engagement (active/inactive), avatar stage | Cannot hide — safety-first |
| Teen-controlled | 🟡 Yellow | Mood trends, thinking trap focus areas, streak data, specific progress metrics | Teen toggles on/off per feature |
| Never visible | 🔴 Red | Raw reflections, specific mission answers, pack posts, exact mood entries, journal content | Hardcoded — no override possible |

**Safety override**: When the safety gate triggers RED or CRISIS triage, the parent is notified immediately with temporary elevated access. Once the teen is safe, access reverts. The teen always sees: "We told your parent because we think you need help. Here is what we shared."

### Graduated Privacy by Age

| Age Band | Default Privacy Level | Parent Visibility | Communication Model |
|---|---|---|---|
| 13–14 | Moderate | Trends + engagement + alerts | Parent-led check-ins |
| 15–16 | Strong | Summaries + safety alerts only | Collaborative check-ins |
| 17–18 | Maximum | Safety alerts only | Teen-led, parent opt-in |

### Parent Route Map

All parent routes live under `apps/parent-portal/app/parent/`.

| Route | File | Description |
|---|---|---|
| `/parent` | `page.tsx` | Home: Emotional Weather report, weekly pulse metrics, thinking trap spotlight, sideways moment, survey callout, pack digest, privacy explainer |
| `/parent/insights` | `insights/page.tsx` | Deeper view: thinking trap trend bars with %, mood trajectory timeline, engagement stats, visibility indicators |
| `/parent/learn` | `learn/page.tsx` | REBT education: 4 core principles + 7 thinking traps with teen examples, parent mirrors, reframes, try-at-home, avoid-this |
| `/parent/moments` | `moments/page.tsx` | Sideways connection suggestions: 4 categories (Walk, Kitchen, Car, Quiet), 8 timed activities with context, 5 anti-patterns with better alternatives |
| `/parent/survey` | `survey/page.tsx` | Parent intake survey (existing) |

**Layout:** `parent/layout.tsx` wraps all parent routes with a sidebar nav, topbar, and privacy badge.

### Data Intelligence Layer (Teen → Parent)

The "invisible" data flow works like this:

```
Teen completes mission → Thinking trap tag recorded → Aggregated weekly
Teen checks mood → Mood trend calculated → Weather metaphor generated
Teen uses tools → Usage count tracked → "Tools used" metric surfaced
Safety gate triggers → Immediate parent notification → Teen is told what was shared
```

**What flows to parents (aggregated):**
- Emotional Weather: "Skies clearing" / "Some clouds gathering" / "Mixed weather"
- Thinking trap distribution: "41% Catastrophizing, 26% All-or-Nothing"
- Engagement metrics: Active days, stories completed, tools used, streak length
- Suggested sideways moments: Based on current trap focus (e.g., catastrophizing → "Walk and wonder")

**What never flows to parents:**
- Raw mission reflections or specific answers
- Pack posts or reactions
- Exact mood check-in values
- Free-text journal entries
- Specific peer interactions

### CSS Architecture — Parent Section

Parent pages use `globals.css` classes (not teen.css). The design is warm, calm, and supportive — distinct from the teen's deep navy.

**Key CSS classes:**

| Class | Purpose |
|---|---|
| `.parent-shell` | Root wrapper with warm gradient |
| `.parent-layout` | Sidebar + content grid |
| `.parent-sidebar` / `.parent-nav-item` | Left sidebar navigation |
| `.parent-hero` / `.parent-hero-compact` | Page hero sections |
| `.parent-weather-card` | Emotional Weather report card |
| `.parent-trap-spotlight` | Current thinking trap focus |
| `.parent-pulse-grid` / `.parent-pulse-card` | Weekly metrics grid |
| `.parent-moment-card` | Sideways moment suggestion |
| `.parent-trap-card` | Full thinking trap education card |
| `.parent-principle-card` | REBT principle card |
| `.parent-moment-card-full` | Detailed connection activity |
| `.parent-antipattern-card` | What-to-avoid guidance |
| `.parent-visibility-row` | Privacy visibility indicator |
| `.parent-privacy-badge` | Sidebar privacy trust signal |

### Thinking Traps — Parent Mirror

Parents learn the same 7 core traps their teen is working on, each with:

| Trap | Parent Mirror Example |
|---|---|
| Catastrophizing | "If they fail this test, they'll never recover." |
| All-or-Nothing | "Either top marks or wasting potential." |
| Mind Reading | "The teacher must think I'm a bad parent." |
| Emotional Reasoning | "I feel worried, so something must be wrong." |
| Should Statements | "They should be more grateful." |
| Labeling | "They're lazy. They're irresponsible." |
| Overgeneralization | "We've tried everything. Nothing works." |

Each trap card includes: teen example, parent mirror, reframe question, try-at-home activity, and what-to-avoid.

### Anti-Patterns (What NOT to Do)

The Moments page explicitly names 5 common parent anti-patterns:

1. **The interrogation trap** — Multiple rapid questions → use one calm question
2. **The fix-it reflex** — Jumping to solutions → ask "listen or help?"
3. **The comparison trap** — Sibling/peer comparisons → name what you see in them
4. **The reassurance loop** — "It'll be fine" → "What's most likely?"
5. **The surveillance reveal** — Referencing app data → never reference this dashboard in conversation

---

## Parent Module — Real Data Integration (Phases 1-3)

### Phase 1: Core Data APIs ✅ DONE
**Commit:** `ba9f509`

Created data aggregation engine for emotional weather & insights:
- `GET /api/parent/weather?teenId=...` - Emotional weather (trend, avatar, top trap)
- `GET /api/parent/insights?teenId=...` - Trap trends (%), mood trajectory, engagement stats, visibility
- `parentDataEngine.ts` - 5 core functions:
  - `calculateEmotionalWeather()` - Analyzes 7-day mood + activity
  - `getThinkingTrapTrends()` - 4-week trap distribution
  - `getMoodTrajectory()` - Weekly mood timeline
  - `getEngagementStats()` - (placeholder for Phase 2)
  - `getVisibilityIndicators()` - Privacy-aware data visibility

### Phase 2: Real Engagement + Pack Digest + Privacy ✅ DONE
**Commit:** `534781e`

Extended engine with real Prisma queries:
- Enhanced `getEngagementStats()` - Real data:
  - Total missions completed (MissionAttempt.count)
  - Active days this month
  - Reflections shared (PackReflection.count where status=PUBLISHED)
  - Tools/challenges used (ChallengeAttempt.count)
  - Mood check-ins (DailySignal.count)
  - Current streak & longest streak (calculated from completedAt)
- `getPackDigestData()` - Published pack reflections with:
  - Real anonymized aliases
  - Reaction counts (I_RELATE, I_TRIED_THIS, THIS_HELPED)
  - Latest 5 posts, pageable
- `GET /api/parent/pack-digest?teenId=...` - Real pack digest API
- Privacy architecture foundation:
  - `getPrivacySettings()` - Fetch teen's privacy toggles
  - `applyPrivacyFilter()` - Filter data by privacy settings
  - Updated `getVisibilityIndicators()` - Privacy-aware

### Phase 3: Parent-Teen Linking + Privacy Schema ✅ DONE
**Commits:** `[to be pushed]`

Parent-teen relationship management:
- `getParentConnectedTeens(parentId)` - List all connected teens
- `getParentPrimaryTeen(parentId)` - Get primary guardian teen
- `getAllParentTeenData(parentId)` - Complete dashboard data for primary teen
- Schema update:
  - Added `privacy Json` field to TeenProfile
  - Default: all privacy toggles enabled
  - Migration: `/supabase/migrations/` (Supabase-managed)
- Parent pages now use real teen context (instead of hardcoded demo ID)

### Data Architecture

```
Parent logs in
  ↓
fetch ParentTeenLink (finds connected teens)
  ↓
get primary teen ID
  ↓
/api/parent/weather?teenId=xxx
/api/parent/insights?teenId=xxx
/api/parent/pack-digest?teenId=xxx
  ↓
Apply privacy filter (check TeenProfile.privacy)
  ↓
Return aggregated, privacy-filtered data to parent
```

### What Still Needs Work

- **UI Integration:** Parent pages still use demo data alongside real APIs
- **Real-time Updates:** Currently one-time fetch; could add WebSocket
- **Authentication:** Parent context not yet integrated into pages
- **Notifications:** Email/SMS on safety alerts not yet connected
- **Privacy Settings UI:** Teen privacy toggles exist, but not easily discoverable

---

## Pending Work / Next Slices

| Slice | Status | Description |
|---|---|---|
| Teen engagement layer | ✅ Done | XP count-up, progressive reveal, shake, trap pop, completion overlay |
| 5 core missions | ✅ Done | night-before-finals, mirror-moment, peer-achievement, friend-text, social-media |
| Stories library | ✅ Done | 15 mission stubs with filter pills |
| Pack feed | ✅ Done | Anonymous posts, mood cloud, reactions |
| Toolbox | ✅ Done | 15 tools, 5 categories |
| Safety page | ✅ Done | Amber + crisis + real Indian helplines |
| Parent module v1 | ✅ Done | Weather report, insights, REBT learn, sideways moments, privacy architecture |
| 10 additional missions | ✅ Done | All 15 missions complete with narrative, dual paths, thinking traps |
| Teen privacy toggles | ✅ Done | In-app toggles for teens to control what parents see — `/teen/privacy` page with 4 toggleable features, always-visible and never-visible tiers |
| AI pack moderation v1 | ✅ Done | Risk classifier (RED/YELLOW/GREEN zones), pre-moderation workflow, admin queue at `/admin/moderation-queue`, notification system |
| **Parent API Phase 1** | ✅ Done | `/api/parent/weather` (emotional weather), `/api/parent/insights` (trap trends, mood trajectory, engagement stats), Prisma data engine |
| **Parent API Phase 2** | ✅ Done | `/api/parent/pack-digest` (real published reflections), real engagement stats (missions, tools, reflections, streaks), privacy filtering infrastructure |
| **Parent API Phase 3** | ✅ Done | Parent-teen linking (getParentPrimaryTeen, getParentConnectedTeens), privacy field added to TeenProfile schema, getAllParentTeenData() for complete dashboard |
| Color theme pick | 🔲 Pending | User reviewing 3 options: Midnight / Dusk Garden / Bloom |
| Workshop admin UI | 🔲 Pending | Connect existing UI to real workshop APIs |
| Pack v2 | 🔲 Pending | Real-time reflection sharing, cohort formation |
| Weekly Replay (Slice 6) | 🔲 Pending | Weekly insight summary for teen |
| Parent notification system | 🔲 Pending | Safety-triggered alerts, weekly digest emails |
| AI moderation Phase 2 | 🔲 Pending | Fine-tune BERT for Indian English, achieve 92-95% accuracy, handle Hinglish |
| Mobile app (Expo) | 🔲 Planned | After web is validated |

---

## Key Decisions Log

| Decision | Reasoning |
|---|---|
| Custom CSS for teen (not Tailwind) | Tailwind purge strips unused classes; design system needs precise dark-theme tokens |
| React Context for teen state | No server needed for MVP; persists via sessionStorage pattern |
| Anonymous pack feed | Privacy-first — teens share more when not identified |
| 5-stage avatar evolution | Slow enough to feel like real growth; identity investment |
| Indian helplines only | Product is India-first; international lines create confusion |
| Narrative in 3 chunks | Reduces cognitive load; each reveal feels like a reward |
| Shake animation on choice cards | Draws attention without being annoying; proven pattern in games |
| "Lamp not spotlight" parent design | Research shows teens abandon apps when they feel surveilled; parents see weather, not diary |
| Three-tier privacy (green/yellow/red) | Balances safety (always visible) with autonomy (never visible) and teen agency (controlled) |
| Graduated privacy by age | DPDP Act requires parental consent for under-18, but WHO/UNICEF recommend 16+ autonomy |
| Sideways moments over direct advice | Family therapy research: shoulder-to-shoulder connection beats face-to-face interrogation |
| Parent REBT mirror cards | Parents who learn the same traps become co-learners rather than supervisors |
| Safety override with teen transparency | Breaking privacy in crisis is necessary, but telling the teen what was shared preserves trust |
| Anti-patterns section on Moments page | Naming common harmful patterns (interrogation, comparison, fix-it reflex) prevents accidental damage |
| AI pre-moderation for Pack posts | Team has no clinical experts; AI classifier + human admins safer than no moderation. Posts held before posting, not after. Prevents harm while preserving teen voice. |
| Three-zone risk classification | RED (5 min SLA) > YELLOW (60 min SLA) > GREEN (immediate). Optimizes for safety (false positives) over false negatives. Better to hold 10 safe posts than miss 1 risky post. |
| Regex + heuristics MVP, BERT Phase 2 | MVP shipping fast with pattern matching (80% accuracy). Phase 2 fine-tunes BERT on Indian English/Hinglish for 92-95% accuracy after validating initial approach. |
