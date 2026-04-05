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

Key actions: `setMood`, `addXP`, `completeStory`, `incrementStreak`, `completeOnboarding`

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

## Pending Work / Next Slices

| Slice | Status | Description |
|---|---|---|
| Teen engagement layer | ✅ Done | XP count-up, progressive reveal, shake, trap pop, completion overlay |
| 5 core missions | ✅ Done | night-before-finals, mirror-moment, peer-achievement, friend-text, social-media |
| Stories library | ✅ Done | 15 mission stubs with filter pills |
| Pack feed | ✅ Done | Anonymous posts, mood cloud, reactions |
| Toolbox | ✅ Done | 15 tools, 5 categories |
| Safety page | ✅ Done | Amber + crisis + real Indian helplines |
| Color theme pick | 🔲 Pending | User reviewing 3 options: Midnight / Dusk Garden / Bloom |
| 10 additional missions | ✅ Done | All 15 missions complete with narrative, dual paths, thinking traps |
| Real API integration | 🔲 Pending | Connect teen pages to Prisma-backed API routes |
| Workshop admin UI | 🔲 Pending | Connect existing UI to real workshop APIs |
| Pack v2 | 🔲 Pending | Real-time reflection sharing, cohort formation |
| Weekly Replay (Slice 6) | 🔲 Pending | Weekly insight summary for teen |
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
