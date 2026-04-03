# Local Testing Guide: Phase 1 with 15 Missions

Run these steps **on your local machine** where you have `pnpm` installed.

---

## 🚀 Quick Start (5 minutes)

### Step 1: Go to Project Directory
```bash
cd ~/Documents/empathiQ  # or wherever your project is
```

### Step 2: Kill Any Running Processes
```bash
# On Mac/Linux:
lsof -ti:3000,19000,19001,19002 | xargs kill -9

# On Windows (PowerShell):
Get-Process -Name "node" | Stop-Process -Force
```

### Step 3: Install Dependencies
```bash
pnpm install
```

### Step 4: Run Database Migrations
```bash
pnpm prisma:migrate
```

### Step 5: Seed All 15 Missions
```bash
cd packages/database
pnpm seed
cd ../..
```

Expected output:
```
✓ Seeded thinking traps
✓ Seeded 15 missions
✅ Seed complete!
```

### Step 6: Start Web Server (Terminal 1)
```bash
pnpm dev:web
```

Wait for:
```
▲ Next.js 15.x
- Local:        http://localhost:3000
```

### Step 7: Start Mobile App (Terminal 2)
```bash
pnpm dev:mobile
```

Wait for Expo to show:
```
Expo Go
│
└─ Press 'i' to open iOS
└─ Press 'a' to open Android
└─ Or scan QR code
```

### Step 8: Launch Mobile App
- **iOS Simulator:** Press `i`
- **Android Emulator:** Press `a`
- **Physical Device:** Scan QR code with Expo Go app

---

## ✅ Expected Behavior

### On Mobile App Load
```
[Loading...] ← 2-3 seconds while fetching mission from API
↓
[Mission displays]
Title: "The Night Before Finals"
Prompt: "Your phone lights up with messages about..."
Sensory: "Feel your feet on the floor..."
↓
[Two choice buttons]
Path 1: "Take a breath and remind yourself..."
Path 2: "Assume this test will ruin everything..."
```

### When You Tap Path 1 (Healthy Choice)
```
[Saving...] ← 1-2 seconds while recording choice
↓
[Consequence displays]
"You create a little space between the panic and the facts..."
↓
[Reflection Screen]
"Share one honest thought with your Pack"
[Text input field]
[Share with Pack button]
```

### When You Tap "Share with Pack"
```
[Posting...] ← 1-2 seconds
↓
Alert: "Shared anonymously"
"Your Pack can now read your reflection."
↓
[Reset to mission screen for next mission]
```

---

## 🧪 Test Different Missions

The mobile app currently hardcodes to "night-before-finals". To test other missions, edit:

**File:** `apps/teen-mobile/src/features/missions/screens/MissionHubScreen.tsx`

**Find line:**
```ts
const loadedMission = await fetchMissionBySlug("night-before-finals");
```

**Replace with any of these slugs:**
```ts
// School missions
const loadedMission = await fetchMissionBySlug("grade-on-test");
const loadedMission = await fetchMissionBySlug("presentation-fear");
const loadedMission = await fetchMissionBySlug("college-decision");

// Peer missions
const loadedMission = await fetchMissionBySlug("social-media-comparison");
const loadedMission = await fetchMissionBySlug("crush-worry");
const loadedMission = await fetchMissionBySlug("friend-text-unanswered");

// Family missions
const loadedMission = await fetchMissionBySlug("family-dinner-tension");
const loadedMission = await fetchMissionBySlug("sibling-boundary-crossed");

// Self missions
const loadedMission = await fetchMissionBySlug("mistake-at-work");
const loadedMission = await fetchMissionBySlug("caffeine-before-bed");
const loadedMission = await fetchMissionBySlug("mirror-moment");

// Digital mission
const loadedMission = await fetchMissionBySlug("phone-late-night");
```

Then **save the file** and the mobile app will **hot-reload** with the new mission.

---

## 📊 Verify in Database

While app is running, open a separate terminal and check the database:

```bash
# Open psql
psql $DATABASE_URL

# Check missions were seeded
SELECT slug, title, theme FROM "Mission" ORDER BY slug;
# Should show: 15 rows

# Check your attempts
SELECT m.slug, ma.id, ma.status, ma."completedAt"
FROM "MissionAttempt" ma
JOIN "Mission" m ON ma."missionId" = m.id
ORDER BY ma."createdAt" DESC
LIMIT 10;

# Check your choices
SELECT m.slug, mc.id as choice_id, tt.code
FROM "MissionChoice" mc
JOIN "MissionAttempt" ma ON mc."missionAttemptId" = ma.id
JOIN "Mission" m ON ma."missionId" = m.id
JOIN "ThinkingTrap" tt ON mc."thinkingTrapId" = tt.id
ORDER BY mc."capturedAt" DESC
LIMIT 10;
```

---

## 🔍 Troubleshooting

### API Returns "Mission not found"
```bash
# Check database has missions
cd packages/database && pnpm seed && cd ../..

# Verify in psql
SELECT COUNT(*) FROM "Mission";  # Should be 15
```

### Mobile Shows Infinite Loading
1. Check web server is running: `http://localhost:3000/api/teen/missions`
2. Check `EXPO_PUBLIC_API_URL` — should be `http://localhost:3000`
3. Check mobile logs in Expo for network errors

### "Bearer token required"
- This is expected if you hit the API without auth header
- Mobile app automatically sends Bearer token

### Database connection error
```bash
# Verify DATABASE_URL is set
echo $DATABASE_URL

# If empty, set it:
export DATABASE_URL="postgresql://user:password@localhost:5432/empathiq"

# Then retry seed
cd packages/database && pnpm seed
```

---

## 📈 Test Scenarios

### Scenario 1: Full Healthy Path
```
1. Load "night-before-finals"
2. Choose Path 1 (Accurate Thinking)
3. See consequence: "You create space..."
4. Write reflection: "I'll take deep breaths"
5. Tap "Share with Pack"
6. Check database: MissionChoice tagged with ACCURATE_THINKING
```

### Scenario 2: Full Unhealthy Path
```
1. Load "social-media-comparison"
2. Choose Path 2 (Emotional Reasoning)
3. See consequence: "The spiral deepens..."
4. Write reflection: "I feel so left out"
5. Tap "Share with Pack"
6. Check database: MissionChoice tagged with EMOTIONAL_REASONING
```

### Scenario 3: Quick Mission Cycle
```
1. Load 3 different missions (edit slug each time)
2. Make different choices for each
3. Query database: SELECT DISTINCT "thinkingTrapId" FROM "MissionChoice"
4. Should see different traps for each mission
```

---

## ✅ Success Checklist

- [ ] `pnpm seed` completes without errors
- [ ] Web server starts on `http://localhost:3000`
- [ ] Mobile app connects and loads mission
- [ ] Mission displays without errors
- [ ] Can tap a path and see consequence
- [ ] Reflection screen appears
- [ ] Can submit reflection
- [ ] Database shows MissionAttempt + MissionChoice records
- [ ] All 15 missions load correctly (by editing slug)
- [ ] Thinking traps are tagged correctly in DB

---

## 📋 Key Files to Monitor

If something breaks, check these files:

1. **API Routes:** `apps/parent-portal/app/api/teen/missions/*/route.ts`
   - If API returns errors, check server logs here

2. **Mobile App:** `apps/teen-mobile/src/features/missions/screens/MissionHubScreen.tsx`
   - If mobile shows errors, check network calls and state management

3. **Database:** `packages/database/seed.ts`
   - If seed fails, check Prisma schema and migrations

4. **Mission Definitions:** `packages/shared/src/missions/missionFactory.ts`
   - If missions are missing, verify they're in this file

---

## 🎯 Next After Testing

Once you've verified all 15 missions work:

1. **Add mission selector UI** — Let users pick which mission
2. **Implement daily check-in** — Start Phase 2 intake
3. **Build recommendation engine** — Suggest missions by theme
4. **Connect to pack feed** — Show peer reflections

---

**Ready to test?** Run:
```bash
pnpm install && pnpm prisma:migrate && cd packages/database && pnpm seed && cd ../.. && pnpm dev:web
```

Then in another terminal:
```bash
pnpm dev:mobile
```

Let me know what you see! 🚀
