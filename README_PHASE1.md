# EmpathiQ Phase 1: Complete Setup & Testing Guide

**Status:** ✅ Ready to Deploy
**Missions:** 15 scenarios for teens
**Tech:** React Native (mobile) + Next.js (web) + PostgreSQL (DB)

---

## 📦 What You Get

### 15 Teen Missions
- **School (5):** Finals anxiety, grades, presentations, perfectionism, career
- **Peer (5):** Crushes, friends, comparison, belonging, FOMO
- **Family (2):** Dinner conflict, boundaries
- **Self (3):** Mistakes, sleep, body image
- **Digital (1):** Phone habits

### 8 Thinking Traps
- ACCURATE_THINKING (healthy)
- CATASTROPHIZING, ALL_OR_NOTHING, MIND_READING
- OVERGENERALIZATION, LABELING, EMOTIONAL_REASONING, SHOULD_STATEMENTS

### Full Tech Stack
- **Mobile:** React Native + Expo
- **Web:** Next.js API routes
- **Database:** PostgreSQL + Prisma
- **Auth:** Mock Bearer tokens (dev mode)

---

## 🚀 Setup (Pick One)

### Option 1: Automated (Easiest) ⭐

```bash
cd ~/Documents/empathiQ
bash setup-npm.sh
```

Takes ~2-3 minutes. Runs everything for you.

### Option 2: Manual (Step-by-Step)

```bash
cd ~/Documents/empathiQ

# Kill old processes
lsof -ti:3000,19000,19001,19002 | xargs kill -9 2>/dev/null || true

# Install dependencies
npm install --legacy-peer-deps

# Run migrations
npm run prisma:migrate

# Seed 15 missions
node seed-standalone.js
```

### Option 3: Custom (Use pnpm)

If you have pnpm installed locally:

```bash
pnpm install
pnpm prisma:migrate
cd packages/database && pnpm seed && cd ../..
```

---

## ▶️ Run the Servers

After setup, start in **two separate terminals**:

### Terminal 1: Web API
```bash
cd ~/Documents/empathiQ
npm run dev:web
```
→ Opens on `http://localhost:3000`

### Terminal 2: Mobile App
```bash
cd ~/Documents/empathiQ
npm run dev:mobile
```
→ Press `i` (iOS) or `a` (Android) or scan QR code

---

## ✨ What Happens When You Launch

```
📱 Mobile App Loads
   ↓ (fetches mission from API)
🎬 Mission Displays: "The Night Before Finals"
   - Narrative: "Your phone lights up about tomorrow's exam..."
   - Sensory: "Feel your feet on the floor..."
   ↓
👆 Two Choice Buttons
   Path 1: "Take a breath and remind yourself one test ≠ your future"
   Path 2: "Assume this test will ruin everything"
   ↓
💾 You Tap Path 1
   (saves to database in ~1-2 seconds)
   ↓
📝 Consequence Text Shows
   "You create a little space between the panic and the facts..."
   ↓
📄 Reflection Screen
   "Share one honest thought with your Pack"
   ↓
✅ Submit Reflection
   (records to database)
   → Ready for next mission
```

---

## 🧪 Test Different Missions

### Easy: Edit One Line

**File:** `apps/teen-mobile/src/features/missions/screens/MissionHubScreen.tsx`

**Line ~60:**
```ts
const loadedMission = await fetchMissionBySlug("night-before-finals");
```

**Change to:**
```ts
const loadedMission = await fetchMissionBySlug("social-media-comparison");
```

**Save** → App hot-reloads with new mission 🔥

---

## 📊 All 15 Mission Slugs

```
School Missions
───────────────
night-before-finals
grade-on-test
presentation-fear
college-decision
peer-achievement

Peer Missions
─────────────
social-media-comparison
crush-worry
friend-text-unanswered
different-from-peers

Family Missions
───────────────
family-dinner-tension
sibling-boundary-crossed

Self Missions
─────────────
mistake-at-work
caffeine-before-bed
mirror-moment

Digital Mission
───────────────
phone-late-night
```

---

## ✅ Verify Setup Worked

### Test Web API

```bash
curl -H "Authorization: Bearer mock-token-teen-1" \
  http://localhost:3000/api/teen/missions
```

Should return 15 missions with full metadata.

### Check Database

```bash
# Open psql
psql $DATABASE_URL

# Count missions
SELECT COUNT(*) FROM "Mission";
# Should show: 15

# See mission titles
SELECT slug, title, theme FROM "Mission" ORDER BY title;

# Check your attempts
SELECT m.title, COUNT(ma.id) as attempts
FROM "Mission" m
LEFT JOIN "MissionAttempt" ma ON m.id = ma."missionId"
GROUP BY m.title
ORDER BY attempts DESC;

# Exit
\q
```

---

## 🔧 Troubleshooting

### "port 3000 already in use"
```bash
lsof -ti:3000 | xargs kill -9
npm run dev:web
```

### "Cannot find @prisma/client"
```bash
npm install
npm run prisma:generate
node seed-standalone.js
```

### "DATABASE_URL not set"
```bash
export DATABASE_URL="postgresql://user:password@localhost:5432/empathiq"
node seed-standalone.js
```

### Mobile shows infinite loading
1. Check web server: `http://localhost:3000/api/teen/missions`
2. Check mobile console for network errors
3. Verify `EXPO_PUBLIC_API_URL=http://localhost:3000`

### Seed script fails
```bash
npm run prisma:migrate  # Run migrations first
node seed-standalone.js  # Then seed
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `SETUP_WITH_NPM.md` | Detailed npm setup guide |
| `MISSIONS_LIBRARY.md` | All 15 missions with descriptions |
| `MISSIONS_VISUAL_MAP.md` | Visual overview & distribution |
| `MISSIONS_TESTING_GUIDE.md` | How to test each mission |
| `LOCAL_TESTING_STEPS.md` | Step-by-step testing guide |
| `seed-standalone.js` | Standalone seed (works without pnpm) |
| `setup-npm.sh` | Automated setup script |

---

## 🎯 Success Looks Like

✅ Web server running on `http://localhost:3000`
✅ Mobile app loads mission without errors
✅ Can tap a path and see consequence
✅ Reflection screen appears
✅ Can submit reflection
✅ Database shows MissionAttempt + MissionChoice records
✅ All 15 missions load when you change the slug

---

## 🚀 After Testing Works

1. **Commit to GitHub**
   ```bash
   git add -A
   git commit -m "Phase 1: Add 15 missions, standalone seed, npm setup"
   git push origin main
   ```

2. **Next Phase**
   - Start Phase 2: Daily signal check-in
   - Build mission recommendation engine
   - Add intake form for baseline assessment

---

## 📞 Quick Reference

| Command | What It Does |
|---------|-------------|
| `bash setup-npm.sh` | Complete automated setup |
| `npm install` | Install all dependencies |
| `npm run prisma:migrate` | Run database migrations |
| `node seed-standalone.js` | Seed 15 missions |
| `npm run dev:web` | Start web API on :3000 |
| `npm run dev:mobile` | Start mobile app (Expo) |
| `npm run prisma:generate` | Generate Prisma client |

---

## 🎓 Architecture

```
┌─────────────────────────────────────────────────┐
│           Mobile App (React Native)             │
│  - Loads mission from API                       │
│  - Two-choice interaction                       │
│  - Reflects anonymously to pack                 │
└────────────────┬────────────────────────────────┘
                 │ (HTTP)
┌────────────────▼────────────────────────────────┐
│         Web API (Next.js)                       │
│  - GET /api/teen/missions                       │
│  - GET /api/teen/missions/[slug]                │
│  - POST /api/teen/missions/[slug]/attempt       │
│  - POST /api/teen/missions/[slug]/complete      │
└────────────────┬────────────────────────────────┘
                 │ (Prisma ORM)
┌────────────────▼────────────────────────────────┐
│        PostgreSQL Database                      │
│  - Mission (15 records)                         │
│  - MissionDecisionOption (30 records)           │
│  - ThinkingTrap (8 records)                     │
│  - MissionAttempt (your choices)                │
│  - MissionChoice (thinking trap tags)           │
└─────────────────────────────────────────────────┘
```

---

## ✨ Key Files

**API Routes:**
- `apps/parent-portal/app/api/teen/missions/route.ts`
- `apps/parent-portal/app/api/teen/missions/[slug]/route.ts`
- `apps/parent-portal/app/api/teen/missions/[slug]/attempt/route.ts`
- `apps/parent-portal/app/api/teen/missions/[slug]/complete/route.ts`

**Mobile App:**
- `apps/teen-mobile/src/features/missions/screens/MissionHubScreen.tsx`
- `apps/teen-mobile/src/features/missions/api/missions.ts`

**Database:**
- `packages/database/seed.ts` (pnpm version)
- `seed-standalone.js` (npm version)
- `packages/shared/src/missions/missionFactory.ts`

**Auth:**
- `apps/parent-portal/app/_lib/teenAuth.ts`

---

## 🎉 You're Ready!

```bash
# One command to start:
bash setup-npm.sh

# Then in two terminals:
npm run dev:web
npm run dev:mobile
```

Test by tapping through all 15 missions! 🚀

Need help? Check the docs listed above or reach out.

---

**Created:** April 3, 2026
**Status:** ✅ Phase 1 Complete
**Missions:** 15 scenarios ready to test
**Tech:** npm + Node.js + PostgreSQL (works without pnpm!)
