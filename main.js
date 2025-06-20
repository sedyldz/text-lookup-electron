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
const { exec } = require("child_process");

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

// Capture text from clipboard (reliable method)
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
        console.log("Showing window for clipboard text...");
        mainWindow.show();
        mainWindow.focus();
        mainWindow.moveTop();
        console.log("Window should now be visible and focused");
      }
    } else {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("text-captured", {
          text: "",
          response:
            "📋 No text in clipboard!\n\nTo use this app:\n1. Select text on your screen\n2. Copy it (Cmd+C)\n3. Use the shortcut (Cmd+Ctrl+J)\n\nThis will analyze your copied text with AI.",
        });
        console.log("Showing window for no clipboard text...");
        mainWindow.show();
        mainWindow.focus();
        mainWindow.moveTop();
        console.log("Window should now be visible and focused");
      }
    }
  } catch (error) {
    console.error("Error capturing text:", error);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("text-captured", {
        text: "",
        response: `Error: ${error.message}. Please try again.`,
      });
      console.log("Showing window for clipboard error...");
      mainWindow.show();
      mainWindow.focus();
      mainWindow.moveTop();
      console.log("Window should now be visible and focused");
    }
  } finally {
    isCapturing = false;
    console.log("Text capture completed");
  }
}

// Check if we have accessibility permissions
async function checkAccessibilityPermissions() {
  return new Promise((resolve) => {
    exec(
      'osascript -e \'tell application "System Events" to keystroke "a" using command down\'',
      (error) => {
        if (error) {
          console.log("Accessibility permissions may not be granted");
          resolve(false);
        } else {
          console.log("Accessibility permissions appear to be working");
          resolve(true);
        }
      }
    );
  });
}

// Capture selected text by simulating copy operation
async function captureSelectedText() {
  if (isCapturing) {
    console.log("Already capturing, skipping...");
    return;
  }

  isCapturing = true;
  console.log("Capturing selected text...");

  try {
    // Check permissions first
    const hasPermissions = await checkAccessibilityPermissions();

    // Clear clipboard first to avoid pollution
    clipboard.clear();
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Store current clipboard content (should be empty now)
    const originalClipboard = clipboard.readText();
    console.log(
      "Original clipboard content:",
      originalClipboard ? `"${originalClipboard.substring(0, 50)}..."` : "empty"
    );

    const platform = process.platform;

    if (platform === "darwin" && hasPermissions) {
      // macOS: Simple copy approach that was working before
      console.log("Copying selected text...");

      // First, let's see what the active application is
      const getActiveAppScript = `
        tell application "System Events"
          set activeApp to name of first application process whose frontmost is true
          return activeApp
        end tell
      `;

      const activeAppName = await new Promise((resolve) => {
        exec(`osascript -e '${getActiveAppScript}'`, (error, stdout) => {
          if (error) {
            console.error("Failed to get active app:", error.message);
            resolve("unknown");
          } else {
            console.log("Active application:", stdout.trim());
            resolve(stdout.trim());
          }
        });
      });

      // Simple copy command that was working before
      const copyScript = `
        tell application "System Events"
          set activeApp to name of first application process whose frontmost is true
          tell process activeApp
            delay 0.1
            keystroke "c" using command down
          end tell
        end tell
      `;

      await new Promise((resolve) => {
        exec(`osascript -e '${copyScript}'`, (error) => {
          if (error) {
            console.error("Copy command failed:", error.message);
          } else {
            console.log("Copy command sent successfully");
          }
          resolve();
        });
      });

      // Wait for copy to complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Get the copied text
      let selectedText = clipboard.readText();
      console.log(
        "Clipboard content after copy:",
        selectedText ? `"${selectedText.substring(0, 50)}..."` : "empty"
      );

      // If first method didn't work, try with activation
      if (
        !selectedText ||
        selectedText.trim().length === 0 ||
        selectedText === originalClipboard
      ) {
        console.log("First method didn't work, trying with activation...");

        const copyScriptWithActivation = `
          tell application "System Events"
            set activeApp to name of first application process whose frontmost is true
            tell application activeApp to activate
            delay 0.3
            tell process activeApp
              keystroke "c" using command down
            end tell
          end tell
        `;

        await new Promise((resolve) => {
          exec(`osascript -e '${copyScriptWithActivation}'`, (error) => {
            if (error) {
              console.error(
                "Copy command with activation failed:",
                error.message
              );
            } else {
              console.log("Copy command with activation sent successfully");
            }
            resolve();
          });
        });

        await new Promise((resolve) => setTimeout(resolve, 400));
        selectedText = clipboard.readText();
        console.log(
          "Clipboard content after copy with activation:",
          selectedText ? `"${selectedText.substring(0, 50)}..."` : "empty"
        );
      }

      // Check if we got new text
      if (
        selectedText &&
        selectedText.trim().length > 0 &&
        selectedText !== originalClipboard
      ) {
        console.log("Text captured successfully, processing with AI...");
        // Query Ollama
        console.log("Querying Ollama...");
        const aiResponse = await queryOllama(selectedText.trim());

        // Send to renderer process
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("text-captured", {
            text: selectedText.trim(),
            response: aiResponse,
          });
          console.log("Showing window for successful text capture...");
          mainWindow.show();
          mainWindow.setAlwaysOnTop(true);
          mainWindow.focus();
          mainWindow.moveTop();

          // More aggressive focus for stubborn apps like Cursor
          setTimeout(() => {
            mainWindow.focus();
            mainWindow.moveTop();
          }, 100);

          setTimeout(() => {
            mainWindow.focus();
            mainWindow.moveTop();
            // Reset alwaysOnTop after a delay so it doesn't stay on top forever
            setTimeout(() => {
              mainWindow.setAlwaysOnTop(false);
            }, 2000);
          }, 300);

          console.log("Window should now be visible and focused");
        }
      } else {
        console.log("No text captured, showing instructions...");
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("text-captured", {
            text: "",
            response: `📋 No text captured from ${activeAppName}!\n\nTo use this app:\n1. Select text on your screen (highlight it)\n2. Copy it manually (Cmd+C)\n3. Use the shortcut (Cmd+Ctrl+J)\n\nThis will analyze your copied text with AI.\n\nNote: Make sure text is actually selected (highlighted) before using the shortcut.`,
          });
          console.log("Showing window for no text captured...");
          mainWindow.show();
          mainWindow.focus();
          mainWindow.moveTop();
          console.log("Window should now be visible and focused");
        }
      }

      // Restore original clipboard content
      if (originalClipboard) {
        clipboard.writeText(originalClipboard);
        console.log("Original clipboard content restored");
      }
    } else {
      // Fallback to manual copy method
      console.log("Using manual copy method...");
      await captureTextFromClipboard();
    }
  } catch (error) {
    console.error("Error capturing selected text:", error);
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("text-captured", {
        text: "",
        response: `Error: ${error.message}. Please try again.\n\nTry copying text manually (Cmd+C) first, then use the shortcut.`,
      });
      console.log("Showing window for error...");
      mainWindow.show();
      mainWindow.focus();
      mainWindow.moveTop();
      console.log("Window should now be visible and focused");
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
    alwaysOnTop: true,
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
        mainWindow.focus();
        mainWindow.moveTop();
      },
    },
    {
      label: "Capture Selected Text (Auto Copy)",
      click: () => {
        captureSelectedText();
      },
    },
    {
      label: "Capture Clipboard Text (Manual)",
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
    mainWindow.focus();
    mainWindow.moveTop();
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
  console.log("Registering global shortcuts...");

  // Register Cmd+Ctrl+J as primary shortcut (less commonly used)
  const ret = globalShortcut.register("CommandOrControl+Control+J", () => {
    console.log("Primary shortcut triggered");
    captureSelectedText();
  });

  if (!ret) {
    console.log("❌ Primary global shortcut registration failed");
  } else {
    console.log("✅ Primary global shortcut registered: Cmd+Ctrl+J");
  }

  // Alternative shortcut: Cmd+Ctrl+K
  const ret2 = globalShortcut.register("CommandOrControl+Control+K", () => {
    console.log("Alternative shortcut 1 triggered");
    captureSelectedText();
  });

  if (!ret2) {
    console.log("❌ Alternative global shortcut registration failed");
  } else {
    console.log("✅ Alternative global shortcut registered: Cmd+Ctrl+K");
  }

  // Third option: Cmd+Ctrl+L
  const ret3 = globalShortcut.register("CommandOrControl+Control+L", () => {
    console.log("Alternative shortcut 2 triggered");
    captureSelectedText();
  });

  if (!ret3) {
    console.log("❌ Third global shortcut registration failed");
  } else {
    console.log("✅ Third global shortcut registered: Cmd+Ctrl+L");
  }

  console.log("Global shortcuts registration completed");
}

app.whenReady().then(() => {
  console.log("🚀 App is ready, initializing...");
  createWindow();
  console.log("✅ Window created");
  createTray();
  console.log("✅ Tray created");
  registerGlobalShortcuts();
  console.log("✅ App initialization completed");
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
