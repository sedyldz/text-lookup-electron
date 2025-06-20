# How to Use Your Text Lookup App

## 🚀 Quick Start Guide

### Step 1: Start the App

```bash
cd /Users/heysed/Dev/text-lookup-electron
npm start
```

### Step 2: Look for the App

- **🔍 Icon**: Should appear in your menu bar (top-right of screen)
- **Main Window**: Should open with a beautiful gradient interface

### Step 3: Use the Shortcut

1. **Open any webpage or document** with text
2. **Press `⌘+⇧+T`** (Command + Shift + T)
3. **Watch the magic happen!**

## ⌨️ Keyboard Shortcuts

| Action       | Shortcut                       |
| ------------ | ------------------------------ |
| Capture text | `⌘+⇧+T` (Command + Shift + T)  |
| Alternative  | `⌘+⌥+T` (Command + Option + T) |
| Show window  | Click tray icon                |
| Close window | `Esc`                          |

## 🎯 What Happens When You Press `⌘+⇧+T`

1. **📸 Screen Capture**: Takes a screenshot of your entire screen
2. **🔍 Text Recognition**: Uses OCR to extract all visible text
3. **🤖 AI Processing**: Sends text to Ollama with llama3.2
4. **📱 Results**: Shows AI explanation in a popup window

## 🔧 Troubleshooting

### App Not Starting

```bash
cd /Users/heysed/Dev/text-lookup-electron
rm -rf node_modules package-lock.json
npm install
npm start
```

### Shortcut Not Working

- Check if the app is running (look for 🔍 icon)
- Try the alternative shortcut: `⌘+⌥+T`
- Check system permissions for accessibility

### No Text Captured

- Make sure there's visible text on screen
- Try a different webpage or document
- Check screen recording permissions

## 🎉 That's It!

Your app should now be working! Try pressing `⌘+⇧+T` on any text to get AI explanations from llama3.2.
