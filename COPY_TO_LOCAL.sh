#!/bin/bash

# This script copies the updated files from Cowork workspace to your local Mac directory
# Run this from your Mac terminal to get the latest fixes

LOCAL_DIR="$HOME/Documents/empathiQ"

echo "📋 Copying fixed files to your local empathiQ directory..."
echo "Source: /sessions/eloquent-funny-johnson/mnt/empathiQ"
echo "Destination: $LOCAL_DIR"
echo ""

# Copy packStore.ts (with the TypeScript fix)
cp /sessions/eloquent-funny-johnson/mnt/empathiQ/apps/parent-portal/app/_lib/packStore.ts \
   "$LOCAL_DIR/apps/parent-portal/app/_lib/packStore.ts" && \
   echo "✅ Copied packStore.ts (TypeScript fix)"

# Copy TeenSurveyForm.tsx (with "None of these" + thank you message)
cp /sessions/eloquent-funny-johnson/mnt/empathiQ/apps/parent-portal/app/_components/TeenSurveyForm.tsx \
   "$LOCAL_DIR/apps/parent-portal/app/_components/TeenSurveyForm.tsx" && \
   echo "✅ Copied TeenSurveyForm.tsx"

# Copy ParentSurveyForm.tsx (with "None of these" + thank you message)
cp /sessions/eloquent-funny-johnson/mnt/empathiQ/apps/parent-portal/app/_components/ParentSurveyForm.tsx \
   "$LOCAL_DIR/apps/parent-portal/app/_components/ParentSurveyForm.tsx" && \
   echo "✅ Copied ParentSurveyForm.tsx"

# Copy TweenSurveyForm.tsx (with "None of these" + thank you message)
cp /sessions/eloquent-funny-johnson/mnt/empathiQ/apps/parent-portal/app/_components/TweenSurveyForm.tsx \
   "$LOCAL_DIR/apps/parent-portal/app/_components/TweenSurveyForm.tsx" && \
   echo "✅ Copied TweenSurveyForm.tsx"

echo ""
echo "✨ All files copied successfully!"
echo ""
echo "📤 Next steps:"
echo "1. cd ~/Documents/empathiQ"
echo "2. git status  (should show 4 modified files)"
echo "3. git add ."
echo "4. git commit -m 'Fix TypeScript error and update surveys with thank you messages'"
echo "5. git push origin main"
