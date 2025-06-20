#!/bin/bash

echo "🚀 Starting Text Lookup App..."

# Always navigate to the correct directory
cd /Users/heysed/Dev/text-lookup-electron

# Check if we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the correct directory"
    exit 1
fi

echo "✅ Found package.json in correct directory"
echo "🎯 Starting Electron app..."

# Start the app
npm start 