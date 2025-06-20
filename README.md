# Text Lookup Electron App

A modern Electron application that captures selected text from your screen and gets AI explanations using Ollama with llama3.2.

## ✨ Features

- **Global Keyboard Shortcuts**: Use `⌘+Ctrl+J`, `⌘+Ctrl+K`, or `⌘+Ctrl+L` to capture selected text
- **Selected Text Capture**: Automatically copies and analyzes your selected text
- **Local AI Integration**: Connects to Ollama running locally with llama3.2
- **Modern UI**: Beautiful, responsive interface with real-time status updates
- **Tray App**: Runs in the background with a system tray icon
- **Clipboard Preservation**: Restores your original clipboard content after processing

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or later)
- **Ollama** with llama3.2 model

### Installation & Startup

**Option 1: Simple npm command**

```bash
cd text-lookup-electron
npm install
npm start
```

**Option 2: Double-click startup (macOS)**

- Double-click `start-app.command` in Finder
- The script will handle all setup automatically

## 🎯 How to Use

1. **Start the app** - It will appear in your system tray
2. **Select any text** on your screen (in any application)
3. **Press `⌘+Ctrl+J`** (or `⌘+Ctrl+K` / `⌘+Ctrl+L`) to capture and analyze
4. **View the AI response** in the popup window

## ⌨️ Keyboard Shortcuts

| Action                | Shortcut        |
| --------------------- | --------------- |
| Capture selected text | `⌘+Ctrl+J`      |
| Alternative capture   | `⌘+Ctrl+K`      |
| Third option          | `⌘+Ctrl+L`      |
| Show/hide window      | Click tray icon |
| Close window          | `Esc`           |

## 🔧 Configuration

### Changing the AI Model

Edit `main.js` and change the model name:

```javascript
body: JSON.stringify({
  model: "llama3.2", // Change to your preferred model
  prompt: `...`,
  stream: false,
});
```

### Customizing the Prompt

Modify the prompt in `main.js`:

```javascript
prompt: `Please provide a helpful explanation or information about this text: "${text}". Keep your response concise, clear, and informative.`;
```

## 🛠️ Development

### Project Structure

```
text-lookup-electron/
├── main.js              # Main Electron process
├── index.html           # App interface
├── package.json         # Dependencies and scripts
├── start-app.command    # Single startup script
├── assets/              # App icons
└── README.md           # This file
```

### Available Scripts

- `npm start` - Start the app in development mode
- `npm run dev` - Start with development flags
- `npm run build` - Build the app for distribution
- `npm run dist` - Create distributable packages

### Building for Distribution

```bash
npm run dist
```

This will create a `.dmg` file in the `dist` folder.

## 🔍 Troubleshooting

### App Not Capturing Text

1. **Check permissions:**

   - System Preferences > Security & Privacy > Privacy > Accessibility
   - The app needs accessibility permissions to simulate copy operations

2. **Verify Ollama is running:**

   ```bash
   ollama list
   curl http://localhost:11434/api/tags
   ```

3. **Check the app status** - The UI will show if Ollama is connected

### Text Selection Issues

- Make sure text is actually selected (highlighted) before using the shortcut
- Try selecting text in different applications
- Check that accessibility permissions are granted

### Ollama Connection Issues

1. **Start Ollama:**

   ```bash
   ollama serve
   ```

2. **Install llama3.2:**

   ```bash
   ollama pull llama3.2
   ```

3. **Test the API:**
   ```bash
   curl http://localhost:11434/api/tags
   ```

## 🎨 Customization

### Styling

The app uses CSS for styling. You can modify `index.html` to change:

- Colors and gradients
- Layout and spacing
- Typography
- Animations

### Functionality

Key areas to customize in `main.js`:

- Global shortcuts
- Text capture behavior
- Ollama API configuration
- Window behavior

## 📦 Dependencies

- **Electron** - Desktop app framework
- **child_process** - For simulating copy operations
- **clipboard** - Clipboard management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use and modify as needed.

## 🆘 Support

If you encounter issues:

1. Check the troubleshooting section
2. Verify all prerequisites are met
3. Ensure Ollama is running with llama3.2
4. Check system permissions

---

**Note:** This app requires accessibility permissions to function properly. These permissions are necessary for simulating copy operations to capture your selected text.
