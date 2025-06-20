#!/bin/bash

# Text Lookup Electron App Startup Script

echo "🚀 Starting Text Lookup Electron App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
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

# Start the app
echo "🎯 Launching Text Lookup..."
npm start 