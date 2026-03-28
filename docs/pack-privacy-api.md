# EmpathiQ Pack Privacy API

This document describes the privacy-first Pack implementation now scaffolded in the app.

## Privacy Rules

- Packs are closed cohorts of 6-8 teens.
- Teens see pseudonymous aliases only.
- Parents do not see raw Pack posts.
- Mentors see aggregate themes and redacted flagged excerpts by default.
- Identity reveal requires audited break-glass access.

## Database Layer

The Prisma schema now includes:

- `PackAlias` for rotating pseudonyms
- privacy flags on `Pack`
- privacy acknowledgement on `PackMembership`
- moderation and privacy fields on `PackReflection`
- `PackReaction`
- `PackSafetyFlag`
- `PackModerationEvent`
- `PackIdentityAccessAudit`
- `PackDigest`

See [schema.prisma](/Users/mathewjose/Documents/empathiQ/packages/database/prisma/schema.prisma).

## API Routes

### `GET /api/pack/feed`

Teen-visible Pack feed only.

Returns:
- privacy notice
- consent notice
- posting rules
- reaction options
- consent state
- cleared posts only

### `POST /api/pack/post`

Teen Pack post submission.

Input:
- `missionId`
- `branchLabel`
- `thinkingTrapTag`
- `mood`
- `body`

Output:
- moderation status
- safety flags
- message
- published post if cleared

### `PATCH /api/pack/consent`

Teen acknowledgement gate for Pack participation.

### `POST /api/pack/report`

Reports a Pack post for:
- privacy leakage
- bullying or harm
- self-harm concern
- substance risk
- other concerns

### `POST /api/pack/hide-alias`

Hides a pseudonymous alias from the current teen's feed.

### `DELETE /api/pack/post/[postId]`

Allows a teen to remove their own Pack post.

### `GET /api/pack/parent-digest`

Parent-safe Pack summary.

Returns:
- privacy boundary notice
- theme cards
- recent signals
- mentor or staff guidance note

### `GET /api/pack/mentor-view`

Mentor Pack console.

Returns:
- theme counts
- moderation counts
- redacted flagged excerpts
- recommended coach actions

### `GET /api/pack/moderation`

Moderation queue for staff tooling.

### `PATCH /api/pack/moderation`

Applies one of:
- `PUBLISH`
- `KEEP_BLOCKED`
- `ESCALATE_TO_ADMIN`

### `GET /api/pack/admin-view`

Admin console payload for moderation queue and identity-access policy reminders.

## Current Moderation Logic

The scaffold uses simple server-side heuristics in [packData.ts](/Users/mathewjose/Documents/empathiQ/apps/parent-portal/app/_data/packData.ts):

- self-harm or suicide language => `ESCALATED`
- identity leakage or doxxing => `BLOCKED`
- substance use or abuse signals => `QUEUED`
- otherwise => `CLEARED`

This is placeholder logic for MVP prototyping. Production should replace it with:

- stronger PII detection
- model-assisted safety review
- human moderation workflow
- encrypted storage of raw text
- explicit retention and deletion policies

## Current UI Behavior

- Teen view requires Pack privacy acknowledgement before posting.
- Teen view supports reporting, hiding an alias, and removing your own post.
- Parent view shows digest summaries only and never raw Pack text.
- Mentor view shows aggregate themes and redacted flagged excerpts.
- Admin view can apply moderation decisions without exposing identity mappings.
