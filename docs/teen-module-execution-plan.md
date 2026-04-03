# Teen Module Execution Plan

## Purpose

This turns the teen-module blueprint into an implementation sequence.

The goal is to answer:

- what we build first
- what data contracts are needed
- what APIs are needed
- what events we need to track
- what should stay teen-only versus mentor-visible versus parent-safe

## Current gap

Today the repo has:

- a mission demo
- a choice fork
- a reflection step

But it does not yet have:

- intake
- baseline mapping
- mission recommendation
- safety interruption
- weekly replay
- teen toolbox
- Pack eligibility rules in the teen flow
- mentor escalation contracts

## Domain contracts

The starter teen module domain contracts now live in [teenModule.ts](/Users/mathewjose/Documents/empathiQ/packages/shared/src/contracts/teenModule.ts).

They define:

- `TeenRiskTier`
- `TeenMissionLane`
- `TeenDailyState`
- `TeenBaselineAssessment`
- `TeenDailyCheckIn`
- `TeenMissionRecommendation`
- `TeenToolItem`
- `TeenPackPrompt`
- `TeenWeeklyReplay`
- `TeenSafetyInterrupt`
- `TeenMentorEscalation`

## Product slices

### Slice 1. Intake and baseline

User outcome:

- the teen enters the system with a real baseline instead of generic missions

Build:

- intake form
- risk tier assignment
- starter mission lane assignment
- baseline storage

API shape:

- `POST /teen/intake`
- `GET /teen/:teenId/baseline`

### Slice 2. Daily signal and mission recommendation

User outcome:

- the teen opens the module and gets a relevant next step

Build:

- daily signal check
- dominant-lane scoring
- mission recommendation response
- state update to `MISSION_ACTIVE` or `MENTOR_WATCH`

API shape:

- `POST /teen/daily-check-in`
- `GET /teen/:teenId/recommendation`

### Slice 3. Mission engine v1

User outcome:

- the teen completes a full preventive practice loop

Build:

- mission player
- thought-trap tagging
- mission consequence storage
- post-mission action experiment

API shape:

- `GET /teen/missions/:missionId`
- `POST /teen/missions/:missionId/attempt`
- `POST /teen/missions/:missionId/complete`

### Slice 4. Toolbox and safety interrupts

User outcome:

- the teen can self-regulate outside missions, and high-risk signals break the normal flow safely

Build:

- toolbox library
- emergency-use tool items
- safety interrupt screen logic
- mentor escalation event

API shape:

- `GET /teen/:teenId/toolbox`
- `POST /teen/:teenId/safety-interrupt`

### Slice 5. Pack v1

User outcome:

- the teen feels peer belonging inside a moderated, structured layer

Build:

- Pack prompt generation
- Pack eligibility check
- structured reflection types
- low-risk reactions
- moderation hooks

API shape:

- `GET /teen/:teenId/pack-eligibility`
- `POST /teen/:teenId/pack-entry`
- `POST /teen/:teenId/pack-reaction`
- `POST /teen/:teenId/pack-report`

### Slice 6. Weekly replay and mentor bridge

User outcome:

- the teen sees their week as a pattern, and mentors see the right teens at the right time

Build:

- weekly replay object
- mentor escalation queue
- parent-safe summary gate

API shape:

- `GET /teen/:teenId/weekly-replay`
- `POST /mentor/escalations`
- `GET /parent/:parentId/teen-summary`

## Visibility rules

### Teen-only

- raw daily signal answers
- private mission reflections
- toolbox usage detail
- non-escalated emotional notes

### Mentor-visible

- top lanes
- trend direction
- safety interruptions
- escalation summaries
- Pack theme summaries

### Parent-safe only

- high-level themes
- routines to try at home
- sideways invitations
- broad signs of school pressure or withdrawal

### Never default-share

- raw Pack text
- raw journal text
- exact crisis language unless safety policy requires escalation

## Event model

The teen module should emit events for analytics and safety.

Core events:

- `teen_intake_completed`
- `teen_risk_tier_assigned`
- `teen_daily_check_in_submitted`
- `teen_mission_recommended`
- `teen_mission_started`
- `teen_mission_completed`
- `teen_tool_used`
- `teen_pack_prompt_opened`
- `teen_pack_post_submitted`
- `teen_safety_interrupt_triggered`
- `teen_mentor_escalation_created`
- `teen_weekly_replay_viewed`

## Content operations

To scale the teen module, content creation needs structure.

Each mission should have:

- lane
- age band
- thinking trap target
- scene description
- sensory cue
- choice fork
- grounded path consequence
- trap path consequence
- action experiment
- Pack reflection prompt
- parent-bridge eligibility
- risk exclusions

## Success metrics

We should track:

- mission completion rate
- reflection completion rate
- toolbox reuse rate
- improvement in sleep and school-pressure signals
- repeat catastrophizing rate
- Pack report rate
- mentor escalation rate
- mentor follow-through time
- teen weekly replay return rate

## Definition of MVP for the teen module

The teen module MVP is complete when a teen can:

1. onboard
2. complete a daily check-in
3. receive a relevant mission
4. finish the mission
5. use one toolbox support
6. post one moderated Pack reflection
7. be safely escalated when risk rises

## Recommended next implementation order

1. add teen module contracts to shared domain
2. build intake and daily check-in APIs
3. build mission recommendation service
4. expand mission content schema
5. wire Pack eligibility into the teen flow
6. add weekly replay and mentor escalation outputs
