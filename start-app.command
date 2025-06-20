#!/bin/bash

# Text Lookup Electron App - Single Startup Script
# Double-click this file to start the app

echo "🚀 Starting Text Lookup App..."

# Navigate to the correct directory
cd /Users/heysed/Dev/text-lookup-electron

# Check if we're in the right place
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please check the directory."
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

echo "✅ Found package.json in correct directory"

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        echo "Press any key to exit..."
        read -n 1
        exit 1
    fi
fi

# Check if Electron is available
if [ ! -f "node_modules/.bin/electron" ]; then
    echo "📦 Installing Electron..."
    npm install
fi

# Check if Ollama is running
echo "🔍 Checking Ollama status..."
if curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "✅ Ollama is running"
else
    echo "⚠️  Ollama is not running. Please start it with: ollama serve"
    echo "   The app will still work but won't be able to query the AI."
fi

echo "🎯 Starting Electron app..."

# Start the app
npm start

# Keep the terminal window open
echo "Press any key to exit..."
read -n 1 