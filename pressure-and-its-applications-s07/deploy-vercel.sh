#!/usr/bin/env bash
set -e

echo "🚀 PressureVerse Vercel Deployment"
echo "Installing project dependencies..."
npm install

echo "Building production files..."
npm run build

echo "Deploying to Vercel production..."
npx vercel --prod

echo "✅ Deployment command finished. Copy the Vercel URL shown above."
