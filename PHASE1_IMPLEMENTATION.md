# EmpathiQ Phase 1: Implementation Guide

**Status:** Complete ✅
**Target:** Stabilize mission engine PoC with real backend

---

## What's Implemented

### 1. Mission Template & Factory (`packages/shared/src/missions/missionFactory.ts`)

A reusable system for defining missions. Each mission includes:
- Narrative intro (scene setting)
- Sensory grounding prompt
- Binary choice pair (healthy vs unhealthy thinking)
- Thinking trap categorization
- Theme tagging (school, family, peer, digital, self)

**5 Seed Missions:**
1. **Night Before Finals** — School pressure / catastrophizing
2. **Family Dinner Tension** — Family conflict / all-or-nothing thinking
3. **Social Media Spiral** — Peer comparison / mind reading
4. **Phone at Midnight** — Digital overload / catastrophizing
5. **The Mistake** — Self-worth / labeling

### 2. Database Seeding (`packages/database/seed.ts`)

Populates PostgreSQL with:
- 8 thinking trap categories (TrapCategory enum)
- 5 published missions with full metadata
- Mission decision options with trap linkages

**Run with:**
```bash
cd packages/database
pnpm seed
```

### 3. Teen API Routes (`apps/parent-portal/app/api/teen/`)

**Endpoints:**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/teen/missions` | List all published missions |
| GET | `/api/teen/missions/[slug]` | Get a single mission with full metadata |
| POST | `/api/teen/missions/[slug]/attempt` | Start a new mission attempt |
| POST | `/api/teen/missions/[slug]/complete` | Record choice and complete attempt |

**Authentication:** Bearer token (mock auth for Phase 1)

**Response format:**
```json
{
  "status": "success",
  "data": { /* payload */ }
}
```

### 4. Mock Auth Middleware (`apps/parent-portal/app/_lib/teenAuth.ts`)

Development-mode auth for Phase 1.

**Mock tokens:**
- `mock-token-teen-1` → teenId: `"teen-001"`
- `mock-token-teen-2` → teenId: `"teen-002"`
- `mock-token-teen-3` → teenId: `"teen-003"`
- Or any string starting with `teen-` (auto-accepted in dev)

**Usage:**
```ts
import { getAuthContext } from "@/_lib/teenAuth";

const authHeader = request.headers.get("Authorization");
const { teenId } = getAuthContext(authHeader); // throws if invalid
```

In Phase 2, replace with real User/TeenProfile session validation.

### 5. Updated Mobile App

**Files changed:**
- `apps/teen-mobile/src/features/missions/api/missions.ts` — New real API client
- `apps/teen-mobile/src/features/missions/screens/MissionHubScreen.tsx` — New flow with loading state
- `apps/teen-mobile/src/features/missions/types.ts` — Extended thinking trap types

**New API client functions:**
```ts
// Fetch all missions
const missions = await fetchMissions();

// Load a single mission by slug
const mission = await fetchMissionBySlug("night-before-finals");

// Two-step choice flow
const attempt = await startMissionAttempt("night-before-finals");
await completeMissionAttempt("night-before-finals", {
  missionAttemptId: attempt.missionAttemptId,
  decisionOptionId: decision.id,
  thinkingTrapId: "CATASTROPHIZING",
});
```

**Environment variables** (for mobile):
```bash
# .env or .env.local in teen-mobile/
EXPO_PUBLIC_API_URL=http://localhost:3000        # or production API
EXPO_PUBLIC_MOCK_AUTH_TOKEN=mock-token-teen-1    # or real token
```

---

## Setup & Running Phase 1

### Prerequisites
- PostgreSQL database running
- `DATABASE_URL` environment variable set in root `.env`
- Node 18+ with pnpm

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Run Prisma Migrations
```bash
pnpm prisma:migrate
```

### 3. Seed Missions & Thinking Traps
```bash
cd packages/database
pnpm seed
cd ../..
```

### 4. Start Web API Server
```bash
pnpm dev:web
# Runs on http://localhost:3000
```

### 5. Start Mobile App
```bash
pnpm dev:mobile
# Starts Expo app
```

Then in Expo:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Or scan QR with Expo Go app

### 6. Test the Flow

**Test endpoint directly (curl):**
```bash
# List missions
curl -H "Authorization: Bearer mock-token-teen-1" \
  http://localhost:3000/api/teen/missions

# Get single mission
curl -H "Authorization: Bearer mock-token-teen-1" \
  http://localhost:3000/api/teen/missions/night-before-finals

# Start attempt
curl -X POST \
  -H "Authorization: Bearer mock-token-teen-1" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/teen/missions/night-before-finals/attempt

# Complete mission
curl -X POST \
  -H "Authorization: Bearer mock-token-teen-1" \
  -H "Content-Type: application/json" \
  -d '{
    "missionAttemptId": "<ATTEMPT_ID_FROM_ABOVE>",
    "decisionOptionId": "<DECISION_ID>",
    "thinkingTrapId": "CATASTROPHIZING"
  }' \
  http://localhost:3000/api/teen/missions/night-before-finals/complete
```

---

## What Gets Stored in Database

### MissionAttempt
```sql
id: UUID
teenId: string (mock: "teen-001", etc.)
missionId: UUID (foreign key to Mission)
status: "STARTED" | "COMPLETED" | "ABANDONED"
startedAt: timestamp
completedAt: timestamp (nullable)
```

### MissionChoice
```sql
id: UUID
missionAttemptId: UUID (foreign key)
decisionOptionId: UUID (which choice was made)
thinkingTrapId: UUID (foreign key to ThinkingTrap)
capturedAt: timestamp
```

### Example Query
```sql
-- Get all attempts by a teen
SELECT m.title, ma.startedAt, ma.completedAt, tt.label
FROM "MissionAttempt" ma
JOIN "Mission" m ON ma."missionId" = m.id
LEFT JOIN "MissionChoice" mc ON ma.id = mc."missionAttemptId"
LEFT JOIN "ThinkingTrap" tt ON mc."thinkingTrapId" = tt.id
WHERE ma."teenId" = 'teen-001'
ORDER BY ma."startedAt" DESC;
```

---

## Key Design Decisions for Phase 1

### 1. Two-Step Choice Flow
- `startMissionAttempt()` creates the attempt record
- `completeMissionAttempt()` records the choice and updates status

**Why:** Separates concern of "did the teen start?" from "what did they choose?"

### 2. No Real Auth Yet
Using mock Bearer tokens means:
- ✅ Easy to test without user creation
- ✅ Fast iteration on API design
- ⚠️ Any Bearer token starting with "teen-" is accepted
- 📋 Replace in Phase 2 with real User/TeenProfile validation

### 3. Decision Options by Sort Order
```ts
decisions: [
  { id: "opt-1", label: "...", trapId: "ACCURATE_THINKING" },      // sortOrder: 0
  { id: "opt-2", label: "...", trapId: "CATASTROPHIZING" }        // sortOrder: 1
]
```

**Why:** Ensures consistent binary pair order across displays.

### 4. Sensory Prompt in Mission
Each mission has a sensory grounding prompt (e.g., "Feel your feet on the ground") to help the teen regulate before choosing.

### 5. No Real-Time Updates Yet
Mobile app polls `/api/teen/missions` on load. In Phase 2, add:
- Mission recommendation engine (based on daily signals)
- Push notifications for new missions
- Live pack reflections feed

---

## Adding More Missions

**Step 1:** Add to `missionFactory.ts`
```ts
"new-mission-slug": createMission({
  slug: "new-mission-slug",
  title: "New Mission Title",
  narrativeIntro: "...",
  sensoryPrompt: "...",
  estimatedMinutes: 3,
  theme: "school",
  chapterLabel: "Choice Fork 06",
  decisions: [
    {
      label: "Healthy choice",
      narrativeOutcome: "...",
      thinkingTrapId: "ACCURATE_THINKING",
    },
    {
      label: "Unhealthy choice",
      narrativeOutcome: "...",
      thinkingTrapId: "CATASTROPHIZING",
    },
  ],
}),
```

**Step 2:** Re-run seed
```bash
cd packages/database && pnpm seed
```

---

## Gotchas & Debugging

### "Missing Authorization header"
Make sure to send:
```
Authorization: Bearer mock-token-teen-1
```

### "Unknown token"
In dev mode, any token starting with "teen-" is auto-accepted. Otherwise, use a mock token from `teenAuth.ts`.

### Mission not found
- Check slug matches exactly (case-sensitive)
- Verify seed ran: `SELECT COUNT(*) FROM "Mission";` in psql

### API returns 500
Check logs:
- Web server: `pnpm dev:web` output
- Database: verify PostgreSQL is running
- Prisma: run `pnpm prisma:migrate` to sync schema

### Mobile app can't connect
- Ensure `EXPO_PUBLIC_API_URL` points to the right server
- If testing on device: use computer's IP address instead of `localhost`
- Check CORS: web server should allow mobile domain

---

## Next Steps (Phase 2)

1. **Real auth** — Link to User/TeenProfile sessions
2. **Daily signals** — Create daily check-in screen
3. **Recommendation engine** — Score teen state and suggest missions
4. **Toolbox** — Self-regulation tools outside of missions
5. **Safety interrupts** — Escalation for high-risk signals
6. **Pack integration** — Teen feed of peer reflections

---

## Files Changed in Phase 1

```
✅ packages/shared/src/missions/
   └── missionFactory.ts (NEW)

✅ packages/database/
   ├── seed.ts (NEW)
   ├── index.ts (NEW)
   └── package.json (UPDATED: seed script + tsx)

✅ apps/parent-portal/
   ├── app/_lib/
   │  └── teenAuth.ts (NEW)
   └── app/api/teen/ (NEW)
       ├── missions/route.ts
       ├── missions/[slug]/route.ts
       ├── missions/[slug]/attempt/route.ts
       └── missions/[slug]/complete/route.ts

✅ apps/teen-mobile/
   └── src/features/missions/
       ├── api/missions.ts (UPDATED: real API client)
       ├── screens/MissionHubScreen.tsx (UPDATED: new flow)
       └── types.ts (UPDATED: extended types)
```

---

## Success Criteria ✅

- [ ] Seed runs without errors
- [ ] GET /api/teen/missions returns 5 missions
- [ ] GET /api/teen/missions/night-before-finals returns full mission
- [ ] POST to /attempt returns missionAttemptId
- [ ] POST to /complete records choice in DB
- [ ] Mobile app loads mission from real API
- [ ] Mobile app submits choice and receives attempt ID
- [ ] Database shows MissionAttempt + MissionChoice records

---

**Ready to test?** Run:
```bash
pnpm install
pnpm prisma:migrate
cd packages/database && pnpm seed && cd ../..
pnpm dev:web  # in one terminal
pnpm dev:mobile  # in another
```

Then open the mobile app and choose a path! 🚀
