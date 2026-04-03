# EmpathiQ Setup: Works with npm only (No pnpm required!)

This guide uses only **npm** and **Node.js** — no pnpm installation needed.

---

## ⚡ Quick Start (5 minutes)

### Option A: Automated Setup (Recommended)

```bash
cd ~/Documents/empathiQ

# Run the setup script
bash setup-npm.sh

# This will:
# 1. Kill any existing processes
# 2. Install all dependencies with npm
# 3. Run Prisma migrations
# 4. Seed 15 missions into database
# 5. Show you what to do next
```

### Option B: Manual Setup (Step-by-step)

```bash
cd ~/Documents/empathiQ

# 1. Kill any existing processes
lsof -ti:3000,19000,19001,19002 | xargs kill -9 2>/dev/null || true
sleep 2

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Run migrations
npm run prisma:migrate

# 4. Seed the database
node seed-standalone.js

# 5. Verify seed succeeded (should show 15 missions)
node -e "require('dotenv').config(); const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.mission.count().then(c => console.log('Missions:', c)).finally(() => p.\$disconnect());"
```

---

## 🚀 Start the Servers

After setup is complete:

### Terminal 1: Web API Server
```bash
cd ~/Documents/empathiQ
npm run dev:web
```

Expected output:
```
▲ Next.js 15.x
- Local:        http://localhost:3000
- Environments: .env.local

✓ Ready in 2.5s
```

### Terminal 2: Mobile App
```bash
cd ~/Documents/empathiQ
npm run dev:mobile
```

Expected output:
```
Expo
│
├─ Press 'i' to open iOS Simulator
├─ Press 'a' to open Android Emulator
├─ Or scan QR code with Expo Go app
│
✓ Tunnel ready
```

Press `i` or `a` to launch the mobile app.

---

## 📱 Testing the Flow

### What You Should See

1. **Mobile App Loads**
   - "Loading..." briefly
   - Mission displays: "The Night Before Finals"

2. **Mission Screen Shows**
   - Title & scenario text
   - Two choice buttons (Path 1 & Path 2)
   - Sensory prompt at top

3. **Tap a Path**
   - "Saving..." briefly
   - Consequence text displays
   - Moves to reflection screen

4. **Write Reflection** (optional)
   - Text input: "What did this choice feel like?"
   - "Share with Pack" button
   - Tap to submit

### Expected Timing

- Mission load: ~2-3 seconds (first time)
- Choice save: ~1-2 seconds
- Reflection submit: ~1-2 seconds

---

## 🧪 Test Different Missions

The app currently hardcodes to "night-before-finals". To test other missions:

**Edit:** `apps/teen-mobile/src/features/missions/screens/MissionHubScreen.tsx`

**Find this line:**
```ts
const loadedMission = await fetchMissionBySlug("night-before-finals");
```

**Try any of these slugs:**
```ts
// School missions
"grade-on-test"
"presentation-fear"
"college-decision"

// Peer missions
"social-media-comparison"
"crush-worry"
"friend-text-unanswered"
"peer-achievement"
"different-from-peers"

// Family missions
"family-dinner-tension"
"sibling-boundary-crossed"

// Self missions
"mistake-at-work"
"caffeine-before-bed"
"mirror-moment"

// Digital mission
"phone-late-night"
```

**Save the file** → Mobile app **hot-reloads** with new mission ✨

---

## ✅ Verify Everything Works

### Test Web API Directly

```bash
# List all 15 missions
curl -H "Authorization: Bearer mock-token-teen-1" \
  http://localhost:3000/api/teen/missions

# Should return 15 missions with metadata
```

### Check Database

```bash
# Open database terminal
psql $DATABASE_URL

# Check missions
SELECT slug, title, theme FROM "Mission" ORDER BY slug;
# Should show 15 rows

# Check your attempts
SELECT m.slug, COUNT(ma.id) as attempts
FROM "Mission" m
LEFT JOIN "MissionAttempt" ma ON m.id = ma."missionId"
GROUP BY m.slug;

# Exit
\q
```

---

## 🚨 Troubleshooting

### "npm: command not found"
You need Node.js installed. Download from: https://nodejs.org/

```bash
node --version    # Should be 16+
npm --version     # Should be 8+
```

### "Cannot find module '@prisma/client'"
```bash
npm install
npm run prisma:generate
node seed-standalone.js
```

### "DATABASE_URL is not set"
```bash
# Set it temporarily
export DATABASE_URL="postgresql://user:pass@localhost:5432/empathiq"
node seed-standalone.js
```

### Mobile shows "Loading..." forever
1. Check web server is running on port 3000
2. Check console for errors: `npm run dev:mobile` output
3. Verify `EXPO_PUBLIC_API_URL` is set to `http://localhost:3000`

### Seed script fails
```bash
# Make sure migrations ran first
npm run prisma:migrate

# Then seed
node seed-standalone.js
```

### Port 3000 already in use
```bash
# Kill it
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev:web
```

---

## 📋 What `seed-standalone.js` Does

This script:
1. ✅ Creates 8 thinking trap categories
2. ✅ Creates 15 mission stories
3. ✅ Links decision options to thinking traps
4. ✅ Sets all missions to PUBLISHED status

**No external dependencies** — just Node.js + @prisma/client

---

## 🎯 Testing Checklist

- [ ] `npm install` completes
- [ ] `npm run prisma:migrate` succeeds
- [ ] `node seed-standalone.js` shows ✅
- [ ] Web server starts on port 3000
- [ ] Mobile app connects and loads mission
- [ ] Can tap a path and see consequence
- [ ] Database has 15 missions (verify in psql)
- [ ] Database has MissionAttempt records

---

## 📂 Key Files

If setup fails, check these:

```
✓ seed-standalone.js        (Seed script - no pnpm needed)
✓ setup-npm.sh              (Automated setup)
✓ package-npm.json          (Alternative package.json)
✓ apps/parent-portal/       (Web server)
✓ apps/teen-mobile/         (Mobile app)
✓ packages/database/        (Prisma schema)
```

---

## 🚀 Next Steps After Testing

Once all 15 missions work:

1. **Add mission picker** — Let users select missions instead of hardcoding
2. **Build daily check-in** — Start Phase 2 (intake + recommendation)
3. **Implement recommendation engine** — Suggest missions by theme
4. **Connect pack feed** — Show peer reflections

---

## 💡 Why This Works Without pnpm

- `seed-standalone.js` is pure Node.js
- It directly imports Prisma client from `node_modules`
- No workspace commands needed
- Each app (web, mobile) has its own `npm start`/`npm run dev`

---

**Ready?** Run:

```bash
bash setup-npm.sh
```

Then follow the instructions! 🎉
