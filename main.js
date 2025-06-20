const {
  app,
  BrowserWindow,
  globalShortcut,
  Tray,
  Menu,
  nativeImage,
  clipboard,
} = require("electron");
const path = require("path");

let mainWindow;
let tray;
let isCapturing = false;

// Ollama API functions
async function queryOllama(text) {
  try {
    console.log("Sending query to Ollama...");
    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: `Please provide a helpful explanation or information about this text: "${text}". Keep your response concise, clear, and informative.`,
        stream: false,
      }),
      timeout: 30000, // 30 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Ollama response received");
    return data.response;
  } catch (error) {
    console.error("❌ Error querying Ollama:", error);
    return `Error: ${error.message}. Make sure Ollama is running with llama3.2 model.`;
  }
}

// Capture text from clipboard with user instructions
async function captureTextFromClipboard() {
  if (isCapturing) {
    console.log("Already capturing, skipping...");
    return;
  }

  isCapturing = true;
  console.log("Capturing text from clipboard...");

  try {
    // Get text from clipboard
    const clipboardText = clipboard.readText();

    console.log(
      "Clipboard text:",
      clipboardText ? "Text found" : "No text found"
    );

    if (clipboardText && clipboardText.trim().length > 0) {
      // Query Ollama
      console.log("Querying Ollama...");
      const aiResponse = await queryOllama(clipboardText.trim());

      // Send to renderer process
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("text-captured", {
          text: clipboardText.trim(),
          response: aiResponse,
        });
        mainWindow.show();
      }
    } else {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("text-captured", {
          text: "",
          response:
            "📋 No text in clipboard!\n\nTo use this app:\n1. Select text on your screen\n2. Copy it (Cmd+C)\n3. Use the shortcut again\n\nThis will analyze your copied text with AI.",
        });
        mainWindow.show();
      }
    }
  } catch (error) {
    console.error("Error capturing text:", error);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("text-captured", {
        text: "",
        response: `Error: ${error.message}. Please try again.`,
      });
      mainWindow.show();
    }
  } finally {
    isCapturing = false;
    console.log("Text capture completed");
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 500,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    show: false,
    title: "Text Lookup",
    icon: path.join(__dirname, "assets", "icon.png"),
  });

  mainWindow.loadFile("index.html");

  // Hide window on close, don't quit app
  mainWindow.on("close", (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  // Check if Ollama is running
  checkOllamaStatus();
}

function createTray() {
  const iconPath = path.join(__dirname, "assets", "icon.png");
  const icon = nativeImage.createFromPath(iconPath);

  tray = new Tray(icon);
  tray.setToolTip("Text Lookup");

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show Window",
      click: () => {
        mainWindow.show();
      },
    },
    {
      label: "Capture Text (Global Shortcut)",
      click: () => {
        captureTextFromClipboard();
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.isQuiting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  tray.on("click", () => {
    mainWindow.show();
  });
}

async function checkOllamaStatus() {
  try {
    const response = await fetch("http://127.0.0.1:11434/api/tags", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 5000,
    });
    if (response.ok) {
      console.log("✅ Ollama is running and responding");
    } else {
      console.log("⚠️ Ollama is not responding properly");
    }
  } catch (error) {
    console.log("⚠️ Ollama connection check failed:", error.message);
    // Don't treat this as a fatal error - Ollama might still work
  }
}

function registerGlobalShortcuts() {
  // Register Cmd+Ctrl+J as primary shortcut (less commonly used)
  const ret = globalShortcut.register("CommandOrControl+Control+J", () => {
    console.log("Primary shortcut triggered");
    captureTextFromClipboard();
  });

  if (!ret) {
    console.log("Primary global shortcut registration failed");
  }

  // Alternative shortcut: Cmd+Ctrl+K
  const ret2 = globalShortcut.register("CommandOrControl+Control+K", () => {
    console.log("Alternative shortcut 1 triggered");
    captureTextFromClipboard();
  });

  if (!ret2) {
    console.log("Alternative global shortcut registration failed");
  }

  // Third option: Cmd+Ctrl+L
  const ret3 = globalShortcut.register("CommandOrControl+Control+L", () => {
    console.log("Alternative shortcut 2 triggered");
    captureTextFromClipboard();
  });

  if (!ret3) {
    console.log("Third global shortcut registration failed");
  }
}

app.whenReady().then(() => {
  createWindow();
  createTray();
  registerGlobalShortcuts();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
