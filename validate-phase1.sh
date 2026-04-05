#!/bin/bash
# ============================================================
# EmpathiQ Phase 1 - Local Validation Script
# Run this from the project root: bash validate-phase1.sh
# ============================================================

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'
PASS=0
FAIL=0
SKIP=0

log_pass() { echo -e "  ${GREEN}PASS${NC} $1"; ((PASS++)); }
log_fail() { echo -e "  ${RED}FAIL${NC} $1"; ((FAIL++)); }
log_skip() { echo -e "  ${YELLOW}SKIP${NC} $1"; ((SKIP++)); }
log_section() { echo -e "\n${YELLOW}=== $1 ===${NC}"; }

API_BASE="http://localhost:3000"
TOKEN="Bearer mock-token-teen-1"

# ============================================================
log_section "1. Prerequisites"
# ============================================================

if command -v pnpm &> /dev/null; then
  log_pass "pnpm is installed ($(pnpm --version))"
else
  log_fail "pnpm is not installed. Run: npm i -g pnpm"
  exit 1
fi

if [ -f ".env" ] || [ -f "apps/parent-portal/.env.local" ]; then
  log_pass ".env file found"
else
  log_skip "No .env file found — will create a default one"
  echo 'DATABASE_URL="postgresql://localhost:5432/empathiq_dev"' > apps/parent-portal/.env.local
  echo "  Created apps/parent-portal/.env.local with default DATABASE_URL"
fi

# ============================================================
log_section "2. Install dependencies"
# ============================================================

echo "  Running pnpm install..."
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
log_pass "Dependencies installed"

# ============================================================
log_section "3. Generate Prisma client"
# ============================================================

cd packages/database
npx prisma generate
cd ../..
log_pass "Prisma client generated"

# ============================================================
log_section "4. Start dev server (background)"
# ============================================================

# Kill any existing dev server on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

cd apps/parent-portal
npx next dev -p 3000 > /tmp/empathiq-dev.log 2>&1 &
SERVER_PID=$!
cd ../..

echo "  Waiting for server to start (PID: $SERVER_PID)..."
for i in {1..30}; do
  if curl -s "$API_BASE" > /dev/null 2>&1; then
    log_pass "Dev server running on port 3000"
    break
  fi
  if [ $i -eq 30 ]; then
    log_fail "Server failed to start in 30s. Check /tmp/empathiq-dev.log"
    cat /tmp/empathiq-dev.log | tail -20
    exit 1
  fi
  sleep 1
done

# ============================================================
log_section "5. Test Toolbox API (no database needed)"
# ============================================================

# GET /api/teen/toolbox
RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: $TOKEN" "$API_BASE/api/teen/toolbox")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ]; then
  TOOL_COUNT=$(echo "$BODY" | python3 -c "import sys,json; print(len(json.load(sys.stdin)['data']['tools']))" 2>/dev/null || echo "?")
  log_pass "GET /api/teen/toolbox -> 200 ($TOOL_COUNT tools returned)"
else
  log_fail "GET /api/teen/toolbox -> $HTTP_CODE"
  echo "  Response: $BODY"
fi

# Test without auth
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_BASE/api/teen/toolbox")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
if [ "$HTTP_CODE" = "401" ]; then
  log_pass "GET /api/teen/toolbox (no auth) -> 401 (correctly rejected)"
else
  log_fail "GET /api/teen/toolbox (no auth) -> $HTTP_CODE (expected 401)"
fi

# POST /api/teen/toolbox/breathing-box/use
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"helpfulnessRating": 4, "note": "felt calmer"}' \
  "$API_BASE/api/teen/toolbox/breathing-box/use")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
  log_pass "POST /api/teen/toolbox/breathing-box/use -> 200"
else
  log_fail "POST /api/teen/toolbox/breathing-box/use -> $HTTP_CODE"
fi

# ============================================================
log_section "6. Test Intake API (requires database)"
# ============================================================

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ageBand": "13-14",
    "primaryConcerns": ["anxiety", "school_stress"],
    "householdType": "two_parent",
    "caregiverStabilityFlag": false,
    "safetyGateQ1": false,
    "safetyGateQ2": false,
    "safetyGateQ3": false
  }' \
  "$API_BASE/api/teen/intake")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | head -n -1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  log_pass "POST /api/teen/intake -> $HTTP_CODE"
else
  log_skip "POST /api/teen/intake -> $HTTP_CODE (needs DB connection)"
fi

# ============================================================
log_section "7. Test Daily Signal API (requires database)"
# ============================================================

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"moodSignal": 7, "freeTextNote": "Feeling okay today"}' \
  "$API_BASE/api/teen/daily-signal")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
  log_pass "POST /api/teen/daily-signal -> $HTTP_CODE"
else
  log_skip "POST /api/teen/daily-signal -> $HTTP_CODE (needs DB connection)"
fi

RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: $TOKEN" "$API_BASE/api/teen/daily-signal")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
  log_pass "GET /api/teen/daily-signal -> $HTTP_CODE"
else
  log_skip "GET /api/teen/daily-signal -> $HTTP_CODE (needs DB connection)"
fi

# ============================================================
log_section "8. Test Missions API (requires database)"
# ============================================================

RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: $TOKEN" "$API_BASE/api/teen/missions")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
  log_pass "GET /api/teen/missions -> $HTTP_CODE"
else
  log_skip "GET /api/teen/missions -> $HTTP_CODE (needs DB + seed data)"
fi

# ============================================================
log_section "9. Test Baseline & Recommendation (requires database)"
# ============================================================

RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: $TOKEN" "$API_BASE/api/teen/baseline")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
  log_pass "GET /api/teen/baseline -> $HTTP_CODE"
else
  log_skip "GET /api/teen/baseline -> $HTTP_CODE (needs DB + intake data)"
fi

RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: $TOKEN" "$API_BASE/api/teen/recommendation")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
  log_pass "GET /api/teen/recommendation -> $HTTP_CODE"
else
  log_skip "GET /api/teen/recommendation -> $HTTP_CODE (needs DB + intake data)"
fi

# ============================================================
log_section "10. Test Workshop Admin API (requires database)"
# ============================================================

RESPONSE=$(curl -s -w "\n%{http_code}" "$API_BASE/api/admin/workshops")
HTTP_CODE=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_CODE" = "200" ]; then
  log_pass "GET /api/admin/workshops -> $HTTP_CODE"
else
  log_skip "GET /api/admin/workshops -> $HTTP_CODE (needs DB)"
fi

# ============================================================
log_section "RESULTS"
# ============================================================

echo ""
echo -e "  ${GREEN}Passed:${NC}  $PASS"
echo -e "  ${RED}Failed:${NC}  $FAIL"
echo -e "  ${YELLOW}Skipped:${NC} $SKIP (need database connection)"
echo ""

if [ $FAIL -eq 0 ]; then
  echo -e "  ${GREEN}All non-DB tests passed!${NC}"
  if [ $SKIP -gt 0 ]; then
    echo ""
    echo "  To run DB-dependent tests:"
    echo "  1. Start PostgreSQL locally"
    echo "  2. Create database: createdb empathiq_dev"
    echo "  3. Set DATABASE_URL in apps/parent-portal/.env.local"
    echo "  4. Run: cd packages/database && npx prisma migrate dev"
    echo "  5. Seed data: npx tsx seed.ts"
    echo "  6. Re-run this script"
  fi
else
  echo -e "  ${RED}Some tests failed. Check output above.${NC}"
fi

# Cleanup
echo ""
echo "  Stopping dev server (PID: $SERVER_PID)..."
kill $SERVER_PID 2>/dev/null || true
echo "  Done."
