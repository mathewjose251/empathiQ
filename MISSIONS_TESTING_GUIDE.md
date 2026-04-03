# Missions Testing Quick Start

## ⚡ 5-Minute Setup

```bash
# 1. Seed the 15 missions
cd packages/database && pnpm seed && cd ../..

# 2. Start web API
pnpm dev:web
# → Runs on http://localhost:3000

# 3. Start mobile app (new terminal)
pnpm dev:mobile
# → Expo ready, press 'i' for iOS or 'a' for Android
```

---

## 🧪 Test Flow

### Option A: Test in Mobile App (Easiest)

1. Start app (see above)
2. Wait for mission to load
3. Read scenario + sensory prompt
4. Tap "Path 1" or "Path 2"
5. See consequence text
6. Tap "Share with Pack" to reflect

**Expected:** No errors, mission loads, choice is recorded

### Option B: Test Endpoints with cURL

```bash
# 1. List all 15 missions
curl -H "Authorization: Bearer mock-token-teen-1" \
  http://localhost:3000/api/teen/missions
# → Should return 15 missions with metadata

# 2. Get a specific mission
curl -H "Authorization: Bearer mock-token-teen-1" \
  http://localhost:3000/api/teen/missions/social-media-comparison
# → Should return the mission with both decision options

# 3. Start a mission attempt
ATTEMPT=$(curl -s -X POST \
  -H "Authorization: Bearer mock-token-teen-1" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/teen/missions/social-media-comparison/attempt | jq -r '.data.missionAttemptId')
echo "Attempt ID: $ATTEMPT"

# 4. Complete the mission with a choice
curl -X POST \
  -H "Authorization: Bearer mock-token-teen-1" \
  -H "Content-Type: application/json" \
  -d "{
    \"missionAttemptId\": \"$ATTEMPT\",
    \"decisionOptionId\": \"<get-from-mission-response>\",
    \"thinkingTrapId\": \"EMOTIONAL_REASONING\"
  }" \
  http://localhost:3000/api/teen/missions/social-media-comparison/complete
# → Should return missionChoiceId + completedAt timestamp
```

---

## 🔍 Testing All 15 Missions

### Mission Slugs for Quick Testing

Copy these to test different scenarios:

```bash
# School missions
night-before-finals
grade-on-test
presentation-fear
college-decision
peer-achievement (duplicate slug, refer to context)

# Peer missions
social-media-comparison
crush-worry
friend-text-unanswered
different-from-peers

# Family missions
family-dinner-tension
sibling-boundary-crossed

# Self missions
mistake-at-work
caffeine-before-bed
mirror-moment

# Digital mission
phone-late-night
```

### Automated Test Script

Save as `test-missions.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000"
AUTH="Bearer mock-token-teen-1"

MISSIONS=(
  "night-before-finals"
  "family-dinner-tension"
  "social-media-comparison"
  "phone-late-night"
  "mistake-at-work"
  "caffeine-before-bed"
  "mirror-moment"
  "crush-worry"
  "grade-on-test"
  "presentation-fear"
  "friend-text-unanswered"
  "college-decision"
  "peer-achievement"
  "sibling-boundary-crossed"
  "different-from-peers"
)

echo "🧪 Testing all 15 missions..."

for slug in "${MISSIONS[@]}"; do
  echo ""
  echo "Testing: $slug"

  # Fetch mission
  response=$(curl -s -H "Authorization: $AUTH" \
    "$API_URL/api/teen/missions/$slug")

  status=$(echo $response | jq -r '.status')
  if [ "$status" = "success" ]; then
    echo "  ✅ GET /missions/$slug → OK"

    # Get mission ID for attempt
    mission_id=$(echo $response | jq -r '.data.id')
    decision_id=$(echo $response | jq -r '.data.decisions[0].id')
    trap_id=$(echo $response | jq -r '.data.decisions[0].thinkingTrapId')

    # Create attempt
    attempt=$(curl -s -X POST \
      -H "Authorization: $AUTH" \
      -H "Content-Type: application/json" \
      "$API_URL/api/teen/missions/$slug/attempt")

    attempt_id=$(echo $attempt | jq -r '.data.missionAttemptId')
    echo "  ✅ POST /missions/$slug/attempt → $attempt_id"

    # Complete attempt
    complete=$(curl -s -X POST \
      -H "Authorization: $AUTH" \
      -H "Content-Type: application/json" \
      -d "{\"missionAttemptId\": \"$attempt_id\", \"decisionOptionId\": \"$decision_id\", \"thinkingTrapId\": \"$trap_id\"}" \
      "$API_URL/api/teen/missions/$slug/complete")

    choice_id=$(echo $complete | jq -r '.data.missionChoiceId')
    echo "  ✅ POST /missions/$slug/complete → $choice_id"
  else
    echo "  ❌ Failed: $(echo $response | jq -r '.message')"
  fi
done

echo ""
echo "✅ Test complete!"
```

Run with:
```bash
chmod +x test-missions.sh
./test-missions.sh
```

---

## 📊 Verify Data in Database

After testing, check the database:

```sql
-- Count missions
SELECT COUNT(*) as total_missions FROM "Mission";
-- Should show: 15

-- Count attempts by mission slug
SELECT m.slug, COUNT(ma.id) as attempts
FROM "Mission" m
LEFT JOIN "MissionAttempt" ma ON m.id = ma."missionId"
GROUP BY m.slug
ORDER BY attempts DESC;

-- See a sample attempt with choice
SELECT
  m.title,
  ma.id as attempt_id,
  ma.status,
  mc.id as choice_id,
  tt.code as thinking_trap,
  ma."startedAt",
  ma."completedAt"
FROM "MissionAttempt" ma
JOIN "Mission" m ON ma."missionId" = m.id
LEFT JOIN "MissionChoice" mc ON ma.id = mc."missionAttemptId"
LEFT JOIN "ThinkingTrap" tt ON mc."thinkingTrapId" = tt.id
LIMIT 10;
```

---

## 🚨 Troubleshooting

### API Returns "Mission not found"
- Check slug spelling (case-sensitive)
- Run `SELECT slug FROM "Mission";` in psql
- Verify seed ran: `pnpm --filter @empathiq/database seed`

### Mobile App Shows Loading Then Error
- Check `EXPO_PUBLIC_API_URL` is set (should be `http://localhost:3000` for local testing)
- Verify web server is running on port 3000
- Check mobile logs: look for network errors in Expo console

### "Missing Authorization header"
- Add header: `-H "Authorization: Bearer mock-token-teen-1"`

### Seed Script Fails
- Verify PostgreSQL is running
- Check `DATABASE_URL` is set in root `.env`
- Run migrations first: `pnpm prisma:migrate`

---

## 🎯 What to Look For

### ✅ Healthy Signs

```
API responses have status: "success"
↓
Mobile app loads mission without errors
↓
User taps a path
↓
MissionAttempt is created in database
↓
MissionChoice links attempt → decision → thinking trap
↓
Consequence text displays
↓
Reflection screen shows "Share with Pack" CTA
```

### ❌ Red Flags

```
API returns 500 error → Check server logs
Mobile shows "Loading..." forever → Check network in Expo
No records in MissionAttempt table → API call didn't complete
Decision options missing on mobile → API response format issue
```

---

## 📈 Performance Baseline

For reference, expected response times:

```
GET /api/teen/missions          ~50-100ms  (list 15)
GET /api/teen/missions/[slug]   ~20-50ms   (single mission)
POST /missions/[slug]/attempt   ~50-100ms  (create DB record)
POST /missions/[slug]/complete  ~100-150ms (create 2 DB records)
```

If significantly slower:
- Check database is local (not cloud)
- Check indexes on Mission, MissionAttempt, MissionChoice tables
- Profile with `EXPLAIN ANALYZE` in psql

---

## 📱 Testing Different Scenarios

### Scenario 1: School Stress Path
```
night-before-finals → Choose "Catastrophizing" path
↓
See consequence: "Pressure grows fast..."
↓
Then test grade-on-test → Choose "Overgeneralization" path
```

### Scenario 2: Peer Anxiety Path
```
social-media-comparison → Choose "Emotional Reasoning" path
↓
crush-worry → Choose "Catastrophizing" path
↓
friend-text-unanswered → Choose "Mind Reading" path
```

### Scenario 3: Recovery Path
```
mistake-at-work → Choose "Accurate Thinking" path
↓
mirror-moment → Choose "Accurate Thinking" path
↓
Verify database shows healthy pattern
```

---

## ✅ Final Checklist

- [ ] 15 missions seeded (`pnpm seed`)
- [ ] Web server running (`pnpm dev:web`)
- [ ] Mobile app connects (`pnpm dev:mobile`)
- [ ] Can load mission (no errors)
- [ ] Can make choice (consequence displays)
- [ ] Database records created (check psql)
- [ ] All 15 slugs respond with 200 OK
- [ ] Thinking traps are tagged correctly
- [ ] Sensory prompts display on mobile

---

**Ready?** Start with:
```bash
pnpm install && pnpm prisma:migrate && cd packages/database && pnpm seed && cd ../.. && pnpm dev:web
```

Then in another terminal:
```bash
pnpm dev:mobile
```

Tap a path and watch the data flow! 🚀
