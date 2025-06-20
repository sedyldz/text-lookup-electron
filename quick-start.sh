#!/bin/bash

# Quick start script for Text Lookup Electron App
# This script navigates to the correct directory and starts the app

echo "🚀 Starting Text Lookup Electron App..."

# Navigate to the correct directory
cd /Users/heysed/Dev/text-lookup-electron

# Check if we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please check the directory."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the app
echo "🎯 Launching Text Lookup..."
npm start 