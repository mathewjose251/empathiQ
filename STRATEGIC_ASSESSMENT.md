# EmpathiQ Strategic Assessment
**Date:** April 8, 2026
**Status:** Pre-Phase 4 Planning
**Document:** Comprehensive pending work analysis, mentor module strategy, design quality audit

---

## Executive Summary

EmpathiQ has successfully completed **Phase 1–3 of parent module API integration** and has achieved a solid **teen experience** with full engagement layers. However, the project is at an inflection point:

1. **Mentor module is severely underdeveloped** — Only 1 page exists; no sub-navigation, sub-pages, or specialized workflows
2. **Admin module is functional but minimal** — Moderation queue works but lacks broader admin operations
3. **Design quality gaps** — Current design does not meet professional wellness app standards (e.g., Calm, Headspace, BetterHelp)
4. **Missing data integrations** — Parent notification system, real-time updates, workshop admin portal
5. **Missing product slices** — Weekly Replay, Pack v2, color theme finalization

This assessment defines **Phase 4** as the **Mentor Module Foundation**, laying groundwork for mentors to onboard, manage cohorts, observe teen safety signals, and guide clinical strategy.

---

## Part 1: Current Project State

### Completed Work (✅)

| Layer | Status | Coverage |
|---|---|---|
| **Teen Experience** | ✅ Complete | 8 routes + animations + missions system + engagement layer + safety gate |
| **Parent Module APIs** | ✅ Complete (Phase 1–3) | Real data aggregation, privacy filtering, pack digest, parent-teen linking |
| **Parent Pages** | ✅ Complete | Home, insights, learn, moments with real data integration |
| **Admin Pack Queue** | ✅ Complete | Moderation queue with RED/YELLOW/GREEN zones + risk classifier |
| **Teen Privacy Toggles** | ✅ Complete | 4-tier privacy model (green/yellow/red) in `/teen/privacy` |
| **Safety System** | ✅ Complete | Crisis detection + Indian helplines + triage |
| **15 Core Missions** | ✅ Complete | All 15 narratives, dual paths, thinking traps, XP rewards |

### Inventory of Routes by Role

```
TEEN (9 routes)
├── / (home)
├── /onboarding
├── /mission/[slug]
├── /stories
├── /pack
├── /toolbox
├── /me
├── /safety
└── /privacy

PARENT (4 routes)
├── / (home/weather)
├── /insights
├── /learn
└── /moments

ADMIN (4 routes)
├── / (hub)
├── /moderation-queue
├── /surveys
└── /workshops/family-dose

MENTOR (1 route) ❌ UNDERDEVELOPED
└── / (dashboard only)

SURVEYS (3 routes)
├── /survey/teen
├── /survey/parent
└── /survey/tween

PREVIEW (1 route)
├── /teen-preview

ROOT (1 route)
├── /login
```

---

## Part 2: Pending Work Inventory

### ✏️ Complete List of Pending Tasks (Categorized)

#### PHASE 4: MENTOR MODULE FOUNDATION 🎯 **CRITICAL PATH**

| Task | Scope | Effort | Purpose |
|---|---|---|---|
| Mentor onboarding flow | 3 pages: welcome → cohort assignment → setup | 3 days | First login experience |
| Mentor dashboard (home) | Real cohort overview, teen activity grid, flags | 2 days | Daily operations hub |
| Teen library (for mentors) | Browsable teen profiles, safety signals, engagement trends | 3 days | Observation + strategy |
| Cohort management | Group teens, set workshops, track completion | 2 days | Mentor operations |
| Mentor learning center | REBT deep-dive, clinical frameworks, case studies | 3 days | Professional development |
| Safety escalation flows | RED zone → escalate with evidence + decision log | 2 days | Clinical operations |
| Real mentor data APIs | `/api/mentor/cohorts`, `/api/mentor/teens`, `/api/mentor/signals` | 3 days | Data layer |
| Mentor-teen assignments | Store cohort memberships in Prisma + UI | 2 days | Relationship management |

**Phase 4 Subtotal:** ~21 days (3 weeks)

---

#### PHASE 5: ADMIN & OPERATIONS HARDENING

| Task | Scope | Effort | Purpose |
|---|---|---|---|
| Admin dashboard redesign | Full operational hub (current is minimal) | 3 days | Operations visibility |
| Mentor management UI | Onboard/offboard mentors, assign cohorts, permissions | 2 days | Admin control |
| Workshop admin portal | Connect existing `/admin/workshops` to real APIs | 2 days | Dose management |
| Safety escalation dashboard | Track RED zone cases, clinical decisions, follow-ups | 2 days | Safety oversight |
| Audit & compliance logs | Full trail of all decisions (moderation, escalations, privacy) | 2 days | DPDP Act 2023 compliance |
| System health dashboard | API uptime, error rates, data pipeline status | 1 day | Operations |

**Phase 5 Subtotal:** ~12 days (2 weeks)

---

#### PARENT NOTIFICATION SYSTEM (Post-Phase 3)

| Task | Scope | Effort | Purpose |
|---|---|---|---|
| Safety alert emails | Template + queue when RED zone triggered | 2 days | Immediate parental notification |
| Weekly digest emails | Parent pack summary + trending insights | 2 days | Engagement + retention |
| SMS fallback (RED only) | Twilio integration for crisis alerts | 1 day | High-priority channel |
| Email template system | Reusable family of templates (alert, digest, reminder) | 1 day | Consistency |
| Notification preferences UI | Parents opt-in/out of digest, timezone config | 1 day | UX |

**Notification Subtotal:** ~7 days (1 week)

---

#### TEEN ENGAGEMENT SLICES (Post-Phase 4)

| Task | Scope | Effort | Purpose |
|---|---|---|---|
| Weekly Replay (Slice 6) | 1-page weekly summary: mood arc, traps worked, achievements | 2 days | Teen reflection + retention |
| Pack v2 | Real-time reflection feed, cohort formation, reactions | 3 days | Social features |
| Badges & achievements | Unlock badges for milestones (7-day streak, 5 missions, etc.) | 2 days | Gamification |
| Leaderboard (optional) | Anonymous peer comparisons (XP, streaks) | 1 day | Social motivation |

**Teen Engagement Subtotal:** ~8 days (1 week)

---

#### DESIGN & POLISH

| Task | Scope | Effort | Purpose |
|---|---|---|---|
| Color theme finalization | Pick final theme from 3 options + apply globally | 1 day | Visual identity |
| Design system audit | Component inventory, consistency across roles | 2 days | Professional quality |
| Accessibility pass | WCAG 2.1 AA compliance (contrast, keyboard nav, ARIA) | 2 days | Inclusivity |
| Mobile refinement | Test on actual devices, fix responsive gaps | 2 days | Mobile-first |
| Loading states & error UI | Skeleton screens, error boundaries, retry logic | 2 days | Robustness |
| Animations & micro-interactions | Polish (transitions, hover states, feedback) | 2 days | Delight |

**Design Polish Subtotal:** ~11 days (1.5 weeks)

---

#### AI & MODERATION (Phase 2)

| Task | Scope | Effort | Purpose |
|---|---|---|---|
| BERT model fine-tuning | Train on Indian English/Hinglish dataset | 3 days | 92-95% accuracy |
| Sarcasm detection layer | Add heuristics for irony (hardest problem) | 2 days | Reduce false negatives |
| Hinglish pattern expansion | Transliterated terms, regional idioms | 2 days | India-specific |
| Moderation appeals | Teen can challenge blocked post | 2 days | Fairness |

**AI Moderation Subtotal:** ~9 days (1+ weeks)

---

#### INFRASTRUCTURE & PERFORMANCE

| Task | Scope | Effort | Purpose |
|---|---|---|---|
| Real-time data updates | WebSocket for live pack feed + mentor signals | 3 days | Engagement |
| API response caching | Redis layer for `/api/parent/weather`, `/api/mentor/cohorts` | 2 days | Performance |
| Database query optimization | Index teen activity queries, N+1 prevention | 2 days | Scale |
| CDN setup (images, assets) | Serve teen avatars, mission artwork via CDN | 1 day | Load time |
| Monitoring & alerts | Datadog/Sentry for errors + performance degradation | 2 days | Reliability |

**Infrastructure Subtotal:** ~10 days (1.5 weeks)

---

#### MOBILE APP (Expo)

| Task | Scope | Effort | Purpose |
|---|---|---|---|
| Expo project setup | Initialize, configure EAS Build | 1 day | Foundation |
| Teen mobile shell | Tab navigation, core routes | 3 days | MVP app |
| Deep linking | `/teen/mission/[slug]` routes → app | 1 day | Cross-platform |
| Push notifications | Streak reminders, new pack posts, safety alerts | 2 days | Engagement |
| App store submission | iOS + Google Play store listing | 1 day | Distribution |

**Mobile Subtotal:** ~8 days (1+ weeks) — **NOT BLOCKING INITIAL RELEASE**

---

### Grand Totals by Priority

| Category | Duration | Blocking Release? |
|---|---|---|
| Phase 4: Mentor Foundation | 3 weeks | **YES** |
| Phase 5: Admin Hardening | 2 weeks | **YES** |
| Parent Notifications | 1 week | *Can defer 1 week* |
| Teen Engagement Slices | 1 week | No (nice-to-have) |
| Design & Polish | 1.5 weeks | **YES** — not production ready |
| AI Moderation Phase 2 | 1+ weeks | No (MVP works) |
| Infrastructure & Performance | 1.5 weeks | **YES** — for scale |
| Mobile App | 1+ weeks | No (post-launch) |

**Critical Path to Production:** ~6 weeks minimum (Phase 4 + Phase 5 + Design + Infrastructure)
**Soft Launch Target:** After Phase 4 mentor onboarding complete (~3 weeks from now)

---

## Part 3: Mentor Module Strategy

### Current State: 1 Page, No Strategy

**What exists:**
- `/mentor/page.tsx` — Dashboard that fetches mock data via `getMentorPageData()`
- Uses shared `<AppShell>`, `<SignalGrid>`, `<TimelineStrip>`, `<MentorPackConsole>` components
- No sub-routes, no mentor-specific workflows, no real data

**Why this is insufficient:**
1. **No onboarding** — Mentors land on a dashboard with no context
2. **No teen visibility** — Can't browse teen profiles or safety signals
3. **No cohort management** — Can't assign teens to mentors or track groups
4. **No clinical workflows** — No escalation, case notes, or follow-up tracking
5. **No mentor education** — No access to clinical REBT frameworks

---

### Mentor Personas & Needs

#### Persona 1: **Clinical Mentor** (Primary)
- Trained psychotherapist or counselor
- Supervises 8–15 teens
- Needs: Safety escalation, case review, REBT teaching
- First login: See cohort overview + any RED flags

#### Persona 2: **University Coach** (Secondary)
- Peer mentor (senior student, volunteer)
- Guides 3–5 teens on study/social topics
- Needs: Teen profiles, progress tracking, simple escalation path
- First login: See assigned teens + their mood trends

#### Persona 3: **School Counselor** (Tertiary)
- Licensed school staff, integrates with school guidance
- Sees entire year group (50–100 teens)
- Needs: Cohort-level trends, bulk export, parent communication templates
- First login: Dashboard overview + filter by cohort/grade

---

### What Mentors Should See on First Login

```
MENTOR HOME DASHBOARD
├── [Hero Section]
│   ├── Role: "Clinical Mentor" / "Coach" / "Counselor"
│   ├── Cohort: "EmpathiQ Program, Batch 2026-Q1"
│   ├── Welcome message + key metrics
│   └── "Set up your cohort" CTA (if empty)
│
├── [Safety Alerts Strip] ⚠️ HIGHEST PRIORITY
│   ├── Red flags from past 24h (RED zone posts)
│   ├── Each shows: Teen name (anonymized), flag type, time, "Review" button
│   ├── SLA badge: "5 min to review"
│   └── Auto-escalate button for immediate clinical team notification
│
├── [Cohort Overview Grid]
│   ├── # of assigned teens, # active today, # at risk
│   ├── Engagement sparkline (7-day activity trend)
│   ├── Mood distribution (% improving/steady/dipping)
│   └── "View full cohort" → `/mentor/cohorts`
│
├── [Teen at Risk (This Week)]
│   ├── Cards for teens with: declining mood, missed check-ins, RED flags
│   ├── Each shows: Name, last active, current risk level, "Profile" button
│   └── "View all concerns" → `/mentor/concerns`
│
├── [Suggested Actions]
│   ├── "You have 3 teens due for check-in" → `/mentor/check-ins`
│   ├── "RED zone post awaiting escalation" → `/admin/moderation-queue`
│   ├── "2 teens completed new missions this week" → `/mentor/insights`
│   └── "Workshop 'Family Dose' starts Monday" → `/admin/workshops`
│
└── [Quick Navigation]
    ├── Teen Library (browse all)
    ├── Learning Center (REBT + clinical)
    ├── Case Notes (my cohort)
    ├── Settings
    └── Signout
```

---

### Mentor Route Map (Phase 4)

#### Tier 1: CRITICAL (MVP)

| Route | Purpose | Data |
|---|---|---|
| `/mentor` | Home dashboard + cohort overview | Real cohort, safety flags, activity |
| `/mentor/onboarding` | First-login setup (4 steps) | Create mentor profile, assign cohort |
| `/mentor/teens` | Browse all assigned teens + profiles | Name, avatar, mood trend, last active, safety level |
| `/mentor/teens/[id]` | Deep profile: mood arc, missions, flags, notes | Full teen dossier + case notes UI |
| `/mentor/safety` | RED/YELLOW zone escalations | Hold queue + clinical decision UI |
| `/mentor/cohorts` | Manage assigned cohorts (if multi-cohort) | Create/edit cohorts, assign teens to groups |
| `/mentor/learn` | REBT deep-dive + clinical frameworks | 10 core principles, case studies, research |

#### Tier 2: IMPORTANT (Phase 4.5)

| Route | Purpose |
|---|---|
| `/mentor/workshops` | Manage family-dose workshops for cohort |
| `/mentor/insights` | Cohort-level trends (thinking traps, mood, engagement) |
| `/mentor/check-ins` | Due-for-check-in workflow (recommended teens to reach out to) |
| `/mentor/case-notes` | Write + search clinical notes for each teen |
| `/mentor/settings` | Timezone, notification preferences, cohort access |

#### Tier 3: NICE-TO-HAVE (Post-Phase 4)

| Route | Purpose |
|---|---|
| `/mentor/reports` | Export cohort data for clinical supervision |
| `/mentor/integrations` | Connect to school systems, therapist notes |
| `/mentor/templates` | Parent communication templates, check-in scripts |

---

## Part 4: Design Quality Audit

### Current Design Gap Analysis

**EmpathiQ's current design does NOT meet professional wellness app standards.** Comparing to Calm, Headspace, BetterHelp:

#### ❌ Missing Professional Elements

| Element | Status | Gap | Impact |
|---|---|---|---|
| **Color palette** | Defined (custom CSS) | Limited to 8 colors; no accessibility-first design | Low contrast in some states |
| **Typography hierarchy** | Basic | Not formally specified; inconsistent sizing across roles | Scannability issues |
| **Component library** | Ad-hoc | No Storybook or documented components | Inconsistency across roles |
| **Spacing system** | Arbitrary | No 8px/4px grid system | Visual chaos |
| **Icon system** | Emoji only | No branded SVG icon set | Unprofessional, inconsistent |
| **Loading states** | Missing | No skeleton screens, no spinners | Perceived sluggishness |
| **Error states** | Minimal | Basic error text; no recovery paths | Confusion on failure |
| **Animations** | Teens only | Mentor/parent/admin have none | Feels disjointed |
| **Responsiveness** | Teens-first | Desktop mentor/parent untested on mobile | Not device-agnostic |
| **Accessibility (WCAG AA)** | Not tested | No color contrast audit, no keyboard navigation, missing ARIA labels | Excludes users with disabilities |
| **Microcopy** | Inconsistent | Tone varies (clinical vs. casual); no voice + tone guide | Unprofessional feel |
| **Empty states** | Missing | No guidance when data is absent | User confusion |
| **Onboarding UX** | Teen only | Parent/mentor have no guided setup | Friction on login |
| **Dark mode** | Partial | Only teen module; rest are light/broken | Inconsistent experience |

---

### Design Quality Recommendations (Phase 4+)

#### 1. Create Formal Design System Document
```
docs/DESIGN_SYSTEM.md
├── Color palette (primary, semantic, neutrals) with WCAG AA validation
├── Typography scale (6pt–48pt with line heights)
├── Spacing system (4px grid: 4, 8, 12, 16, 24, 32, 48, 64)
├── Component inventory (buttons, cards, forms, modals)
├── Motion guidelines (duration, easing, when to use)
├── Accessibility checklist (keyboard nav, ARIA, color contrast)
├── Tone + voice guide (when to be clinical, empathetic, direct)
└── Dos & don'ts for each role
```

#### 2. Audit & Fix Color Contrast
- Current CSS custom properties use `#06b6d4` (cyan) — test on `#1e293b` card backgrounds
- Ensure all text meets **WCAG AA minimum (4.5:1 for normal text)**
- Create semantic color map: success (green), warning (amber), danger (rose), neutral (slate)

#### 3. Establish Icon System
- Replace emojis with branded SVG icon set (24px base size)
- Examples: mood indicators, trap categories, nav items
- Use Lucide React (already in project) or design custom set

#### 4. Add Component Library (Storybook)
```bash
npx storybook init
```
Document: buttons, cards, modals, forms, avatar, streak counter, progress bars

#### 5. Implement Loading & Error States
- Skeleton screens for data-heavy pages (teen library, cohort grid)
- Error boundaries with recovery paths ("Try again", "Contact support")
- Toast notifications for transient feedback

#### 6. Test Accessibility (WCAG 2.1 AA)
- Use axe DevTools, Lighthouse, WAVE tools
- Keyboard-only navigation (Tab, Enter, Escape)
- Screen reader testing (NVDA, JAWS)
- Color contrast: 4.5:1 for text, 3:1 for UI components

#### 7. Apply Dark Mode Consistently
- Teen module: ✅ already dark
- Parent module: redesign for dark mode
- Mentor/admin modules: follow teen design
- Use CSS `prefers-color-scheme: dark` media query + toggle in settings

#### 8. Mobile Responsiveness
- Test mentor/parent on iPhone 12, iPad
- Fix layouts that assume desktop width
- Use responsive breakpoints: 320px (mobile), 768px (tablet), 1024px (desktop)

---

## Part 5: Comparison with CLAUDE.md

### What's Documented in CLAUDE.md (✅)

| Section | Coverage |
|---|---|
| Teen Experience | ✅ Complete — route map, missions, state, CSS, engagement mechanics |
| Parent Experience | ✅ Complete — philosophy, privacy architecture, route map, API phases 1–3 |
| Mission System | ✅ Complete — all 15 missions with trap mappings, XP rewards |
| Safety System | ✅ Complete — helplines, triage, crisis detection |
| Tech Stack | ✅ Complete — tech choices, monorepo structure |
| Pack Moderation AI | ✅ Complete — risk classifier, zones, admin queue, notification system |
| Current Build Status | ✅ Complete — TypeScript zero errors, schema valid |
| Key Decisions Log | ✅ Complete — 20+ decisions with reasoning |
| Pending Work | ✅ Partial — old list from Phase 3, now stale |

### What's MISSING in CLAUDE.md (❌)

| Section | Gap |
|---|---|
| Mentor Experience | ❌ No mentor philosophy, route map, personas, workflows |
| Admin Experience | ❌ Only mentions moderation queue; lacks broader admin operations |
| Design System | ❌ Teen CSS documented but no formal design system, no Figma link |
| Accessibility | ❌ Not mentioned; no WCAG compliance target |
| Phase 4+ Planning | ❌ Not defined; only Phase 1–3 parent work documented |
| Data Integration Roadmap | ❌ Real-time updates, WebSocket, caching not mentioned |
| Mentor Data APIs | ❌ No spec for `/api/mentor/*` routes |
| Mobile App Strategy | ❌ Mentioned as "planned" but no Expo setup or timeline |
| Database Migration Plan | ❌ No mention of Supabase migration workflows |
| Deployment Strategy | ❌ Vercel mentioned but no staging/prod separation |

---

## Part 6: Phase 4 – Mentor Module Foundation (Detailed Spec)

### Phase 4 Objectives

By end of Phase 4 (3 weeks), mentors should be able to:
1. ✅ Onboard into EmpathiQ and see cohort overview
2. ✅ Browse assigned teen profiles with safety signals
3. ✅ Escalate RED zone cases to clinical team with decision log
4. ✅ Learn REBT frameworks via in-app learning center
5. ✅ Access real mentor data APIs (`/api/mentor/cohorts`, `/api/mentor/teens`, etc.)

### Phase 4 Deliverables

#### 1. Mentor Onboarding Flow (3 pages)

**Route:** `/mentor/onboarding`

**Step 1: Welcome**
```
Hero: "Welcome to EmpathiQ Mentor."
Body: "You're joining a community of mentors supporting teen emotional wellbeing."
Form:
  - Full name
  - License type (Clinical / Coach / Counselor)
  - Years of experience
CTA: "Next"
```

**Step 2: Cohort Assignment**
```
Hero: "Connect with your cohort."
Body: "Select the cohort of teens you'll mentor."
Form:
  - Dropdown: existing cohorts OR "Create new cohort"
  - Input: Cohort name (if new)
  - Input: Description (e.g., "Spring 2026 IIT prep cohort")
CTA: "Next"
```

**Step 3: Settings**
```
Hero: "Personalize your experience."
Form:
  - Timezone selector
  - Notification preferences (email, SMS for RED alerts)
  - Check "I agree to clinical protocols" checkbox
CTA: "Complete setup"
→ Redirect to `/mentor` (home)
```

---

#### 2. Mentor Home Dashboard

**Route:** `/mentor/page.tsx` (rebuild existing)

**Key sections:**
- **Safety alerts strip** (RED zone posts from past 24h)
- **Cohort snapshot** (# teens, engagement sparkline, mood distribution)
- **Teens at risk** (declining mood, missed check-ins)
- **Suggested actions** (due check-ins, completed missions, workshops)
- **Quick nav** (to teen library, learning center, case notes)

---

#### 3. Teen Library (Browsable Profiles)

**Route:** `/mentor/teens`

**Features:**
- Grid/list toggle showing: name, avatar, last active, current mood, risk level
- Filter by: cohort, risk level, last active (today/week/month)
- Search by name
- Click → `/mentor/teens/[teenId]` for deep profile

**Teen Profile Page:** `/mentor/teens/[teenId]`

**Sections:**
- Header: Name (or anonymized ID), avatar, age, cohort
- **Mood timeline** (7-day arc with emoji)
- **Thinking trap focus** (current top 3 traps with %)
- **Engagement metrics** (missions completed, tools used, streak, check-ins)
- **Safety signals** (any RED/YELLOW flags, dates, brief excerpt)
- **Case notes** (mentor can add/edit rich-text notes with timestamps)
- **Action buttons:** "Check in", "Escalate", "Email parent", "View pack posts"

---

#### 4. Safety Escalation Flows

**Route:** `/mentor/safety`

**Queue displays:**
- RED zone posts (flagged in past 24h) — sorted by SLA
- YELLOW zone posts (pending review) — sorted by urgency
- CLOSED cases (for audit trail)

**Per-post UI:**
- Post excerpt (redacted ID)
- Risk flags (Suicide Risk, Self-Harm, etc.)
- Mentor actions:
  - "Mark as reviewed" (log decision)
  - "Escalate to clinical team" (adds decision log entry + notification)
  - "Contact parent immediately" (sends alert email)
  - "Close case" (mark resolved)

**Decision log:**
- Timestamp, mentor name, decision, outcome
- Linkable to teen profile

---

#### 5. Mentor Learning Center

**Route:** `/mentor/learn`

**Sections:**
1. **REBT Foundations** — 5 core principles (with citations)
2. **Thinking Traps Deep Dive** — 7 core traps + adolescent manifestations
3. **Case Studies** — 3 anonymized cohort scenarios
4. **Clinical Protocols** — Safety escalation, RED zone decision tree
5. **Supervision Notes** — Links to clinical supervisor resources

---

#### 6. Data Layer (Prisma + APIs)

**Schema additions:**
```prisma
model MentorProfile {
  id String @id @default(cuid())
  userId String @unique
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  licenseType "Clinical" | "Coach" | "Counselor"
  yearsExperience Int
  timezone String @default("Asia/Kolkata")
  cohorts CohortMentor[]
  createdAt DateTime @default(now())
}

model Cohort {
  id String @id @default(cuid())
  name String
  description String?
  mentors CohortMentor[]
  teens CohortTeen[]
  createdAt DateTime @default(now())
}

model CohortMentor {
  cohortId String
  cohort Cohort @relation(fields: [cohortId], references: [id], onDelete: Cascade)
  mentorId String
  mentor MentorProfile @relation(fields: [mentorId], references: [id], onDelete: Cascade)
  assignedAt DateTime @default(now())
  @@id([cohortId, mentorId])
}

model CohortTeen {
  cohortId String
  cohort Cohort @relation(fields: [cohortId], references: [id], onDelete: Cascade)
  teenId String
  teen TeenProfile @relation(fields: [teenId], references: [id], onDelete: Cascade)
  joinedAt DateTime @default(now())
  @@id([cohortId, teenId])
}

model MentorCaseNote {
  id String @id @default(cuid())
  mentorId String
  mentor MentorProfile @relation(fields: [mentorId], references: [id], onDelete: Cascade)
  teenId String
  teen TeenProfile @relation(fields: [teenId], references: [id], onDelete: Cascade)
  content String // Rich text (Markdown)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([mentorId, teenId])
}

model EscalationDecision {
  id String @id @default(cuid())
  packPostId String
  packPost PackReflection @relation(fields: [packPostId], references: [id], onDelete: Cascade)
  mentorId String
  mentor MentorProfile @relation(fields: [mentorId], references: [id], onDelete: Cascade)
  decision "ESCALATED" | "MONITORED" | "CLOSED"
  reasoning String
  parentNotified Boolean @default(false)
  clinicalTeamNotified Boolean @default(false)
  createdAt DateTime @default(now())
  @@unique([packPostId]) // One decision per post
}
```

**API Routes:**
```
GET  /api/mentor/profile              → MentorProfile + cohorts
GET  /api/mentor/cohorts              → Cohort[] with teen counts
GET  /api/mentor/cohorts/[id]/teens   → Teen[] in cohort + safety levels
GET  /api/mentor/teens/[id]           → Full teen profile + mood, traps, notes
POST /api/mentor/teens/[id]/notes     → Create case note
GET  /api/mentor/safety/red           → RED zone posts needing escalation
GET  /api/mentor/safety/yellow        → YELLOW zone posts for review
POST /api/mentor/safety/[postId]/escalate → Log escalation decision
GET  /api/mentor/signals              → Real-time safety signals (WebSocket ready)
```

---

## Part 7: Design System Specification (Quick Start)

### Colors (WCAG AA Compliant)

```css
:root {
  /* Mentors: Warm, calm (different from teen dark navy) */
  --mentor-bg: #f9fafb;       /* Off-white background */
  --mentor-card: #ffffff;     /* Pure white cards */
  --mentor-primary: #0891b2;  /* Cyan (same as teen accent) */
  --mentor-secondary: #7c3aed; /* Purple (trust, wisdom) */
  --mentor-success: #10b981;   /* Green (healthy path) */
  --mentor-warning: #f59e0b;   /* Amber (needs attention) */
  --mentor-danger: #ef4444;    /* Red (urgent) */
  --mentor-text: #1f2937;      /* Dark gray text */
  --mentor-muted: #6b7280;     /* Secondary text */
  --mentor-border: #e5e7eb;    /* Light borders */

  /* Semantic */
  --signal-red: #ef4444;       /* Immediate danger */
  --signal-yellow: #fbbf24;    /* Needs review */
  --signal-green: #10b981;     /* Safe */
}
```

### Typography

```css
h1 { font-size: 32px; font-weight: 700; line-height: 1.2; }  /* Hero titles */
h2 { font-size: 24px; font-weight: 600; line-height: 1.3; }  /* Page titles */
h3 { font-size: 18px; font-weight: 600; line-height: 1.4; }  /* Card titles */
body { font-size: 14px; font-weight: 400; line-height: 1.6; } /* Body text */
small { font-size: 12px; font-weight: 400; line-height: 1.5; } /* Caption */
```

### Spacing (4px grid)

```
--space-xs: 4px    (gap between inline elements)
--space-sm: 8px    (padding inside small components)
--space-md: 16px   (card padding, section gaps)
--space-lg: 24px   (section padding)
--space-xl: 32px   (page margins)
--space-2xl: 48px  (between major sections)
```

### Component Patterns

**Button:**
```
Primary (cyan bg, white text): CTA actions
Secondary (border, no fill): Alternative actions
Danger (red bg, white text): Escalate, close
Disabled (muted bg, muted text): Unavailable actions
```

**Card:**
```
Base: white bg, border: 1px light gray, border-radius: 8px, padding: 16px
Hover: subtle shadow or border color change
Active: cyan border
```

**Form:**
```
Label: 12px uppercase, muted color
Input: border 1px gray, padding 8px 12px, focus: cyan border + shadow
Error: red text below, red border on input
```

---

## Summary: Actionable Next Steps

### Week 1 (Now): Design & Planning Phase
- [ ] Finalize Phase 4 mentor route map (above)
- [ ] Design Figma wireframes for mentor onboarding + home
- [ ] Review + approve design system (colors, typography, spacing)
- [ ] Create Prisma schema additions (MentorProfile, Cohort, etc.)
- [ ] Set up Storybook project

### Week 2: Build Phase 4 Core
- [ ] Implement mentor onboarding flow (3 pages)
- [ ] Build mentor home dashboard (real cohort data)
- [ ] Build teen library + deep profile pages
- [ ] Create mentor data APIs (`/api/mentor/cohorts`, etc.)
- [ ] Set up MentorProfile + Cohort Prisma tables

### Week 3: Safety & Learn
- [ ] Build safety escalation queue (`/mentor/safety`)
- [ ] Implement decision log + EscalationDecision schema
- [ ] Build mentor learning center (`/mentor/learn`)
- [ ] Polish mentor onboarding UX
- [ ] Deploy to staging

### Week 4+: Polish & Phase 5
- [ ] Design quality audit (color contrast, accessibility)
- [ ] Phase 5 admin hardening (admin dashboard, mentor mgmt)
- [ ] Parent notification system
- [ ] Soft launch with first mentor cohort

---

## Appendix: References

**Project Documents:**
- `/CLAUDE.md` — Complete project context (teen, parent, safety, missions)
- `/ARCHITECTURE.md` — Not yet created; recommend creating after Phase 4

**External Standards:**
- WCAG 2.1 AA — Web accessibility guidelines
- DPDP Act 2023 — India data privacy law
- APA Guidelines — Adolescent autonomy + parental involvement balance

**Competitive Benchmarks:**
- **Calm** (meditation + sleep)
- **Headspace** (meditation + therapy)
- **BetterHelp** (therapist-matching platform)
- **Sanvello** (mental health assessment + therapy)

---

**Document completed:** 2026-04-08
**Next review:** After Phase 4 mentor alpha launch
