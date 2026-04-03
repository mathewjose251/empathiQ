#!/bin/bash
# EmpathiQ Phase 1: Fresh Restart & Test Script
# Run this from your project root directory

set -e

echo "🚀 EmpathiQ Fresh Start"
echo "======================"
echo ""

# Step 1: Kill existing processes
echo "📋 Step 1: Killing any existing processes..."
lsof -ti:3000,19000,19001,19002 | xargs kill -9 2>/dev/null || echo "✓ No processes running"
sleep 2

# Step 2: Install dependencies
echo ""
echo "📋 Step 2: Installing dependencies..."
pnpm install --frozen-lockfile

# Step 3: Run Prisma migrations
echo ""
echo "📋 Step 3: Running database migrations..."
pnpm prisma:migrate

# Step 4: Seed database with 15 missions
echo ""
echo "📋 Step 4: Seeding 15 missions into database..."
cd packages/database
pnpm seed
cd ../..

# Step 5: Build web app
echo ""
echo "📋 Step 5: Building web app..."
pnpm build

# Step 6: Summary
echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next steps (run in separate terminals):"
echo ""
echo "Terminal 1 - Web API Server:"
echo "  pnpm dev:web"
echo "  → Runs on http://localhost:3000"
echo ""
echo "Terminal 2 - Mobile App:"
echo "  pnpm dev:mobile"
echo "  → Press 'i' for iOS, 'a' for Android, or scan QR code"
echo ""
echo "Then open the mobile app and test the mission flow! 🎮"
echo ""
