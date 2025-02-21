#!/bin/bash

# Define the files that contain secrets
SECRET_FILES=("backend/skillbridge.json" "backend/.env")

echo "🔍 Removing sensitive files from Git history..."

# Remove the files from Git tracking but keep them locally
for file in "${SECRET_FILES[@]}"; do
  if [ -f "$file" ]; then
    git rm --cached "$file"
  else
    echo "⚠️ Warning: $file not found, skipping..."
  fi
done

# Add the files to .gitignore to prevent future commits
echo "🛑 Adding files to .gitignore..."
for file in "${SECRET_FILES[@]}"; do
  echo "$file" >> .gitignore
done

# Commit the removal
git add .gitignore
git commit -m "Removed sensitive files from Git history and added to .gitignore"

# Remove secrets from all past commits
echo "🧹 Cleaning up Git history..."
git filter-branch --force --index-filter   "git rm --cached --ignore-unmatch ${SECRET_FILES[*]}"   --prune-empty --tag-name-filter cat -- --all

# Force push the cleaned history
echo "🚀 Pushing clean history..."
git push origin main --force

echo "✅ Done! Your repository is now free from secrets."
