# EmpathiQ Workshop Roadmap

## Why this module exists

The admin workshop page turns the provided DOSE family workshop runbook into a real EmpathiQ system module.

It is not just a schedule viewer. It is the planning layer for:

- cohort setup
- safety posture
- day-by-day facilitation flow
- post-workshop booster follow-through
- mentor and school handoff when needed

## What we kept from the DOSE workshop runbook

- the strong two-day arc of body, nature, reflection, and family ritual
- the use of local play, journalling, art, food, and role reversal
- the idea of physical commitment anchors such as the journal, contract, and artwork
- the 30-day reunion logic and home continuation after the event

## What we enriched inside EmpathiQ

We used the public AllzWellEver direction as inspiration for preventive programme design, especially:

- Rational Emotive Education style thought work
- mindfulness or MBSR-flavoured daily micro practices
- growth mindset framing
- explicit parent involvement
- teacher or counselor bridge thinking

EmpathiQ extends that in four ways:

1. We add an intake and triage layer before the workshop starts.
2. We translate workshop moments into role-based product workflows for parent, mentor, admin, and optional school support.
3. We build in booster sessions and follow-through instead of ending at inspiration.
4. We keep privacy and safety controls consistent with the rest of the platform.

## Build roadmap

### Phase 1

- family intake form
- cohort assignment rules
- consent tracking
- safety and referral gate

### Phase 2

- live admin workshop console
- attendance and material tracking
- session notes and theme tagging
- contract and journal milestone capture

### Phase 3

- Day 3, Day 7, Day 14, Day 21, and Day 30 booster flows
- parent-facing follow-through prompts
- mentor escalation for high-friction families
- reunion planning and completion tracking

### Phase 4

- optional school or counselor summary workflow
- outcome dashboard for academic load, family tone, and booster completion
- referral follow-up status
- quality review across workshop cohorts

## Near-term implementation priority

The next technical slice should be:

- a persisted workshop model in Prisma
- admin APIs for workshop creation, attendance, and follow-through
- a workshop detail record linked to parent, mentor, and referral workflows
