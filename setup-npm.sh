#!/bin/bash

# EmpathiQ Setup Script - Works with npm only
# No pnpm required!

set -e

echo "🚀 EmpathiQ Setup (npm version)"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1
echo -e "${YELLOW}Step 1:${NC} Killing any existing processes on ports 3000, 19000-19002..."
lsof -ti:3000,19000,19001,19002 | xargs kill -9 2>/dev/null || echo "✓ None running"
sleep 2

# Step 2
echo ""
echo -e "${YELLOW}Step 2:${NC} Installing dependencies..."
npm install --legacy-peer-deps
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Step 3
echo ""
echo -e "${YELLOW}Step 3:${NC} Running Prisma migrations..."
npm run prisma:migrate || npx prisma migrate dev
echo -e "${GREEN}✓ Migrations complete${NC}"

# Step 4
echo ""
echo -e "${YELLOW}Step 4:${NC} Seeding database with 15 missions..."
node seed-standalone.js
echo -e "${GREEN}✓ Seed complete${NC}"

# Step 5
echo ""
echo "================================"
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📝 Next: Run in separate terminals:"
echo ""
echo -e "${YELLOW}Terminal 1:${NC}"
echo "  npm run dev:web"
echo "  → http://localhost:3000"
echo ""
echo -e "${YELLOW}Terminal 2:${NC}"
echo "  npm run dev:mobile"
echo "  → Press 'i' (iOS) or 'a' (Android) or scan QR"
echo ""
echo "================================"
echo ""
