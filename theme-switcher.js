// Theme Switcher for Text Lookup App
// Add this script to easily switch between color schemes

const themes = ["theme-cosmic-night"];

let currentThemeIndex = 0;

// Function to switch to next theme
function nextTheme() {
  const body = document.body;

  // Remove current theme
  body.classList.remove(themes[currentThemeIndex]);

  // Move to next theme
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;

  // Apply new theme
  body.classList.add(themes[currentThemeIndex]);

  console.log(`Switched to theme: ${themes[currentThemeIndex]}`);

  // Save preference
  localStorage.setItem("preferred-theme", themes[currentThemeIndex]);
}

// Function to switch to specific theme
function setTheme(themeName) {
  const body = document.body;

  // Remove all themes
  themes.forEach((theme) => body.classList.remove(theme));

  // Add specified theme
  body.classList.add(themeName);

  // Update current index
  currentThemeIndex = themes.indexOf(themeName);

  console.log(`Set theme to: ${themeName}`);

  // Save preference
  localStorage.setItem("preferred-theme", themeName);
}

// Function to get current theme
function getCurrentTheme() {
  return themes[currentThemeIndex];
}

// Function to list all available themes
function listThemes() {
  console.log("Available themes:");
  themes.forEach((theme, index) => {
    console.log(`${index + 1}. ${theme.replace("theme-", "")}`);
  });
}

// Load saved theme preference on page load
function loadSavedTheme() {
  const savedTheme = localStorage.getItem("preferred-theme");
  if (savedTheme && themes.includes(savedTheme)) {
    setTheme(savedTheme);
  }
}

// Add keyboard shortcuts for theme switching
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + T to cycle through themes
  if ((e.ctrlKey || e.metaKey) && e.key === "t") {
    e.preventDefault();
    nextTheme();
  }

  // Ctrl/Cmd + Shift + T to list themes
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
    e.preventDefault();
    listThemes();
  }
});

// Initialize theme system
document.addEventListener("DOMContentLoaded", () => {
  loadSavedTheme();

  // Add theme switcher to console
  console.log("Theme Switcher loaded!");
  console.log("Use Ctrl/Cmd + T to cycle themes");
  console.log("Use Ctrl/Cmd + Shift + T to list themes");
  console.log('Or call nextTheme(), setTheme("theme-name"), or listThemes()');
});

// Export functions for use in console
window.themeSwitcher = {
  nextTheme,
  setTheme,
  getCurrentTheme,
  listThemes,
  themes,
};
