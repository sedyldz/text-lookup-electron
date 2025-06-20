#!/bin/bash

# Desktop shortcut for Text Lookup App
# Double-click this file to start the app

echo "🚀 Starting Text Lookup App..."

# Navigate to the correct directory
cd /Users/heysed/Dev/text-lookup-electron

# Check if we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the correct directory"
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

echo "✅ Found package.json in correct directory"
echo "🎯 Starting Electron app..."

# Start the app
npm start

# Keep the terminal window open
echo "Press any key to exit..."
read -n 1 