# EmpathiQ Teen Module — Development Status Report

**As of April 3, 2026**

---

## Executive Summary

The teen module has a **detailed blueprint and execution plan** (docs: `teen-module-blueprint.md`, `teen-module-execution-plan.md`) but implementation is currently at **Proof of Concept (PoC)** stage. Only **Slice 3 (Mission Engine v1)** has a partial demo; the other 5 product slices remain in the backlog.

**Current coverage: ~10% of planned teen module**

---

## What's Implemented ✅

### Mission Engine Demo (Partial Slice 3)

**Location:** `apps/teen-mobile/src/features/missions/`

**Components:**
- `MissionHubScreen.tsx` — Main orchestrator (story → reflection flow)
- `ChoiceForkScreen.tsx` — Binary choice narrative UI (NativeWind + Tailwind styling)
- `ReflectionScreen.tsx` — Anonymous post-mission reflection capture
- `types.ts` — Mission, decision, and submission TypeScript contracts
- `mockMission.ts` — Single hardcoded "Night Before Finals" story
- `missions.ts` — API client for two endpoints

**Features:**
1. **Choice Fork** — Teen reads narrative, makes binary choice
   - Visual design: dark theme, cyan/emerald/rose accent colors
   - Thinking trap tagging: `ACCURATE_THINKING` vs `CATASTROPHIZING`
   - Consequence feedback to teen
   - Loading state management

2. **Reflection Capture** — Teen posts anonymous pack reflection
   - Multi-line text input
   - Minimum 8-character validation
   - Submit state management
   - "Share with Pack" CTA

3. **API Integration** (Hardcoded, not yet functional)
   - `POST https://api.empathiq.app/missions/choices`
   - `POST https://api.empathiq.app/pack/reflections`

**Tech Stack:**
- React Native 0.79 + Expo 53
- NativeWind 4.1 for Tailwind styling
- React 19 hooks for state

**What Works:**
- UI component composition and styling
- Local state management (choice, reflection text)
- Form validation and loading states
- Error alerting flow
- Decision routing (story → reflection)

**What Doesn't Work:**
- Backend endpoints are not yet live (`api.empathiq.app` is hardcoded but not functional)
- Only one static mission exists
- No auth/session validation
- No mission data fetching
- No real attempt tracking

---

## What's Designed But NOT Implemented ❌

### Slice 1: Intake and Baseline

**Purpose:** Teen enters system with personalized baseline instead of generic missions.

**Designed artifacts:**
- Risk tier logic: `GREEN`, `AMBER`, `RED`, `CRISIS`
- Baseline load score
- School connectedness score
- Family climate score
- Digital overload score
- Mission lane routing

**Missing implementations:**
- Intake form (age, school stage, exam load, sleep, screen time, home stress, help-seeking comfort)
- Risk tier assignment logic
- Baseline storage schema (Prisma model needed)
- `POST /teen/intake` API
- `GET /teen/:teenId/baseline` API

**Est. complexity:** Medium (form + scoring logic + DB)

---

### Slice 2: Daily Signal and Mission Recommendation

**Purpose:** Teen opens app, sees relevant next mission based on today's emotional state.

**Designed artifacts:**
- Daily signal check-in (body load, mood, stress)
- Dominant-lane scoring
- Mission recommendation engine
- State machine: `MISSION_ACTIVE`, `MENTOR_WATCH`

**Missing implementations:**
- Daily signal check-in screen
- Scoring algorithm
- Mission recommendation API
- State transition logic
- `POST /teen/daily-check-in` API
- `GET /teen/:teenId/recommendation` API

**Est. complexity:** High (scoring + recommendation engine)

---

### Slice 4: Toolbox and Safety Interrupts

**Purpose:** Teen can self-regulate outside missions; high-risk signals trigger mentor escalation.

**Designed artifacts:**
- Toolbox library (grounding exercises, breathing, affirmations, etc.)
- Emergency-use markers
- Safety interrupt flow
- Mentor escalation event schema

**Missing implementations:**
- Toolbox library UI
- Tool item cards and interaction
- Safety threshold detection
- Interrupt screen flow
- `GET /teen/:teenId/toolbox` API
- `POST /teen/:teenId/safety-interrupt` API

**Est. complexity:** High (safety-critical, requires clear escalation rules)

---

### Slice 5: Pack Integration (Teen Side)

**Purpose:** Teen feels peer belonging in a moderated, structured layer.

**Designed artifacts:**
- Pack prompt generation
- Pack eligibility check
- Structured reflection types
- Low-risk reaction types (emoji, pre-written)
- Moderation hooks (flag/report flow)

**Missing implementations:**
- Pack eligibility check logic
- Structured prompt feed
- Reaction UI (currently hardcoded reflection-only)
- Flag/report mechanism
- `GET /teen/:teenId/pack-eligibility` API
- `POST /teen/:teenId/pack-entry` API
- `POST /teen/:teenId/pack-reaction` API
- `POST /teen/:teenId/pack-report` API

**Est. complexity:** Very High (safety-critical moderation, real-time feed, permissions)

---

### Slice 6: Weekly Replay and Mentor Bridge

**Purpose:** Teen sees patterns in thinking; mentor sees deeper insights for coaching.

**Designed artifacts:**
- Weekly pattern summary
- Thinking trap frequency ranking
- Suggested teen reflections
- Mentor observation schema
- Bridge to mentor escalation

**Missing implementations:**
- Weekly snapshot generation logic
- Pattern visualization
- Mentor conversation starter logic
- `GET /teen/:teenId/weekly-replay` API
- Mentor bridge in web portal

**Est. complexity:** High (aggregation + visualization)

---

## Domain Contracts (In Git, Not Yet Used)

**File:** `packages/shared/src/contracts/teenModule.ts`

**Defined types:**
- `TeenRiskTier` — enum: `GREEN | AMBER | RED | CRISIS`
- `TeenMissionLane` — enum: `SCHOOL_PRESSURE | DIGITAL_OVERLOAD | FAMILY_CLIMATE | BELONGING | SELF_CONTROL`
- `TeenDailyState` — daily check-in data
- `TeenBaselineAssessment` — baseline scores and tier
- `TeenDailyCheckIn` — daily signal capture
- `TeenMissionRecommendation` — recommendation payload
- `TeenToolItem` — toolbox item definition
- `TeenPackPrompt` — pack prompt structure
- `TeenWeeklyReplay` — weekly pattern summary
- `TeenSafetyInterrupt` — safety event
- `TeenMentorEscalation` — escalation event

**Status:** Types defined but not imported or used in any feature code yet.

---

## Database Schema (Partially Modeled)

**File:** `packages/database/prisma/schema.prisma`

**Existing models:**
- `User`, `TeenProfile`, `MentorProfile`, `ParentProfile` ✅
- `Mission`, `MissionDecision`, `MissionAttempt`, `MissionChoice` ✅
- `ThinkingTrap`, `MissionChoiceTrap` ✅
- `Pack`, `PackMembership` ✅
- `PackReflection` ✅
- `InsightSnapshot` ✅

**Missing models for teen module completion:**
- `TeenIntake` — intake responses + risk tier + baseline scores
- `TeenDailyCheckIn` — daily signals
- `TeenMissionRecommendation` — personalization history
- `TeenToolbox` — tool inventory
- `TeenSafetyEvent` — safety interrupts
- `TeenWeeklyReplay` — weekly patterns

---

## API Implementation Status

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `POST /teen/intake` | Collect baseline | ❌ Not built |
| `GET /teen/:teenId/baseline` | Retrieve baseline | ❌ Not built |
| `POST /teen/daily-check-in` | Log daily signals | ❌ Not built |
| `GET /teen/:teenId/recommendation` | Get next mission | ❌ Not built |
| `GET /teen/missions/:missionId` | Fetch mission story | ⚠️ Hardcoded mock only |
| `POST /teen/missions/:missionId/attempt` | Start mission | ⚠️ Hardcoded mock only |
| `POST /teen/missions/:missionId/complete` | End mission | ⚠️ Client-side only |
| `POST /teen/:teenId/toolbox` | Get self-regulation tools | ❌ Not built |
| `POST /teen/:teenId/safety-interrupt` | Escalate high risk | ❌ Not built |
| `GET /teen/:teenId/pack-eligibility` | Check pack access | ❌ Not built |
| `POST /teen/:teenId/pack-entry` | Join pack cohort | ❌ Not built |
| `POST /teen/:teenId/pack-reaction` | React to pack posts | ❌ Not built |
| `POST /teen/:teenId/pack-report` | Report unsafe content | ❌ Not built |
| `GET /teen/:teenId/weekly-replay` | Get pattern summary | ❌ Not built |

---

## Key Gaps

### 1. Backend Infrastructure
- No teen-specific API routes (currently hardcoded to `api.empathiq.app`)
- No auth/session middleware for teen endpoints
- No intake processing
- No risk assessment pipeline
- No mission recommendation engine

### 2. Data Persistence
- No teen intake storage
- No daily check-in persistence
- No tool interaction logging
- No safety event audit trail
- No weekly aggregation logic

### 3. Moderation & Safety
- No content moderation strategy
- No escalation thresholds defined
- No mentor notification pipeline
- No crisis routing (how do we detect `CRISIS` tier?)
- No parent notification hooks

### 4. Mobile UX
- Only one mission story exists
- No mission library/discovery
- No toolbox UI
- No daily check-in screen
- No weekly replay visualization
- No mentor messaging/bridge UI (though exists in web portal)

### 5. Testing & Validation
- No unit tests for domain logic
- No integration tests for API flows
- No safety scenario testing
- No accessibility review (critical for teen UX)

---

## Recommended Phased Rollout

### Phase 1: Stabilize Slice 3 (Current PoC) — 2-3 weeks

**Goals:**
- Connect hardcoded API endpoints to real backend
- Build 3-5 additional mission stories
- Add session/auth validation
- Implement error recovery and offline fallback

**Deliverables:**
- Real `GET /teen/missions` endpoint (fetch from DB)
- Real `POST /teen/missions/:missionId/attempt` (store attempt, return ID)
- Real `POST /teen/missions/:missionId/complete` (finalize attempt)
- `POST /pack/reflections` connected to PackReflection model
- Auth middleware protecting all endpoints
- Mission library UI allowing selection from 3+ stories

**Why first:** Validates core mission loop before adding complexity.

---

### Phase 2: Slice 1 + Slice 2 (Intake & Recommendation) — 3-4 weeks

**Goals:**
- Route teens based on baseline instead of generic missions
- Daily check-in ritual establishes emotional awareness
- Recommendation engine picks relevant missions

**Deliverables:**
- Intake form screen (5-10 questions)
- `POST /teen/intake` → store TeenIntake, assign risk tier
- `GET /teen/:teenId/baseline` → return scores + tier
- Daily check-in screen (3 questions)
- `POST /teen/daily-check-in` → score and log
- `GET /teen/:teenId/recommendation` → recommend by lane
- Mission lane assignment in mission picker
- Risk tier badge in UI (mentor-visible)

**Why second:** Enables personalization before adding safety complexity.

---

### Phase 3: Slice 4 (Toolbox & Safety) — 3-4 weeks

**Goals:**
- Teen has self-regulation options outside missions
- Safety threshold triggers mentor escalation
- Builds trust for more vulnerable disclosures

**Deliverables:**
- Toolbox library (10+ tools: breathing, grounding, affirmations, journaling prompt)
- `GET /teen/:teenId/toolbox` → return available tools
- Tool selection and interaction logging
- Safety threshold definition (e.g., if risk_score > 8, interrupt)
- Safety interrupt screen
- `POST /teen/:teenId/safety-interrupt` → log event + notify mentor
- Mentor alert in web portal
- Crisis triage (when to escalate to emergency)

**Why third:** Safety-critical; needs Phase 2 baseline to be meaningful.

---

### Phase 4: Slice 5 (Pack v1) — 3-4 weeks

**Goals:**
- Teen feels peer belonging in safe, moderated cohort
- Structured reflection prevents bullying/exposure

**Deliverables:**
- Pack eligibility check (risk tier + account age gates)
- Structured reflection prompt types (vs free-form)
- Pack feed (recent reflections + reactions only)
- Reaction types: emoji reactions, pre-written replies (no free text)
- Flag/report mechanism for unsafe content
- Moderation dashboard for review
- `GET /teen/:teenId/pack-eligibility`
- `POST /teen/:teenId/pack-entry`
- `POST /teen/:teenId/pack-reaction`
- `POST /teen/:teenId/pack-report`

**Why fourth:** Requires Slice 3 + moderation confidence from Phase 1-3.

---

### Phase 5: Slice 6 (Weekly Replay & Mentor Bridge) — 2-3 weeks

**Goals:**
- Teens see their own patterns over time
- Mentors see actionable insights for coaching

**Deliverables:**
- Weekly aggregation job (runs Sunday night)
- Thinking trap pattern ranking
- Teen-facing weekly replay screen
- Mentor-visible insights in web portal
- Suggested teen reflection starters (generated or templated)
- `GET /teen/:teenId/weekly-replay`
- Weekly notification to teen and mentor

**Why fifth:** Highest-leverage step once earlier phases are stable.

---

## Technical Recommendations

### 1. Backend Architecture
- Use a dedicated `services/teen-service` (like `insight-engine`)
- Or add to existing API gateway with `/teen/*` routes
- Use Prisma for all DB operations
- Add request validation middleware (Zod)
- Implement audit logging for safety events

### 2. Testing
- Unit test: risk tier assignment logic
- Unit test: mission recommendation algorithm
- Integration test: full intake → recommendation flow
- Safety scenario tests (e.g., what happens if daily check-in flags crisis?)
- Accessibility audit before Phase 2 launch

### 3. Monitoring & Alerts
- Log all safety events (interrupt, escalation, flag)
- Alert mentor/parent when `RED` or `CRISIS` detected
- Monitor reflection moderation queue
- Track teen engagement (missions/week, toolbox use)

### 4. Privacy & Compliance
- All teen data PII-locked (no parent/mentor can see identity in pack)
- Reflection moderation SLA (24-48 hours for flags)
- Data retention policy (e.g., delete after 2 years)
- Consent flow before any parent/mentor visibility

---

## Open Questions for Product

1. **Crisis detection threshold:** What daily check-in or behavior pattern triggers `CRISIS` tier? How fast must we escalate?

2. **Mentor visibility:** Can mentors see teen identity + all data, or only aggregated patterns? Current design suggests patterns-only (see `pack-privacy-api.md`).

3. **Toolbox scope:** Should we include guided audio (breathing exercises)? Text? Interactive (mini-games)? Start minimal?

4. **Pack moderation:** Who reviews flags? Mentor? Staff? What's the SLA? What's the escalation path for urgent harm?

5. **School integration:** Should we send school attendance/GPA signals into recommendation engine? Or keep it teen-only?

6. **Parent access:** When/how does parent see teen insights? Only summary? Weekly? Can they intervene?

---

## Success Metrics (Suggested)

- **Adoption:** % of new teens completing intake within 7 days
- **Engagement:** Avg missions/week, avg reflections/week
- **Safety:** % of daily check-ins that flag elevated risk (should be <5%)
- **Moderation:** Avg flag-to-review time, % of flags upheld
- **Impact:** Correlation between tool use + mission completion → reduction in parent-reported family conflict (qualitative survey)

---

## Files to Monitor

- `apps/teen-mobile/src/features/missions/` — Core implementation
- `packages/shared/src/contracts/teenModule.ts` — Domain model
- `packages/database/prisma/schema.prisma` — Data model
- `docs/teen-module-blueprint.md` — Product strategy (source of truth)
- `docs/teen-module-execution-plan.md` — Implementation sequencing

---

## Next Steps

1. **Immediate (this week):** Review this report with product + engineering
2. **Week 2:** Decide whether to proceed with Phase 1 stabilization or iterate on PoC first
3. **Week 2-3:** Set up backend routes + hook up real mission endpoints
4. **Week 4:** Begin Slice 2 (intake + recommendation)

---

**Report prepared:** April 3, 2026
**Scope:** EmpathiQ teen module (mobile app)
**Status:** Proof of concept, 10% feature complete
**Next review:** After Phase 1 completion
