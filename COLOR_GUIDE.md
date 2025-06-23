# Color System & Theme Guide

## 🎨 Centralized Color Management

All colors in the Text Lookup app are now managed through CSS custom properties (variables) located in the `:root` selector in `index.html`. This makes it easy to experiment with different color schemes!

The font is also now managed globally.

- **Heading Font**: `Press Start 2P`
- **Body Font**: `Jersey 10`
- **Fallback Font**: `monospace`

## 🌈 Available Themes

### 1. **Earth & Sunrise** (Default)

- Warm cream backgrounds with orange accents
- Perfect for a cozy, natural feel

### 2. **Ocean Depths**

- Cool blues and teals
- Great for a calm, professional look

### 3. **Forest Mist**

- Greens and earth tones
- Natural and refreshing

### 4. **Cosmic Night**

- Dark theme with purple accents
- Perfect for night-time use

### 5. **Candy Pastel**

- Soft pinks and purples
- Sweet and playful

### 6. **Desert Sand**

- Warm browns and golds
- Earthy and warm

## 🔧 How to Switch Themes

### Method 1: Keyboard Shortcuts

- **Ctrl/Cmd + T**: Cycle through themes
- **Ctrl/Cmd + Shift + T**: List all available themes

### Method 2: Browser Console

```javascript
// Switch to next theme
nextTheme();

// Switch to specific theme
setTheme("theme-ocean-depths");

// List all themes
listThemes();

// Get current theme
getCurrentTheme();
```

### Method 3: Manual HTML Edit

Change the class on the `<body>` tag:

```html
<body class="theme-ocean-depths"></body>
```

## 🎯 CSS Variables Structure

The color system is organized into logical groups:

### Background Colors

- `--color-bg-primary`: Main background
- `--color-bg-secondary`: Content areas
- `--color-bg-status`: Status indicators
- `--color-bg-error`: Error states

### Text Colors

- `--color-text-primary`: Main text
- `--color-text-secondary`: Secondary text
- `--color-text-button`: Button text
- `--color-text-error`: Error text

### Accent Colors

- `--color-primary`: Main accent
- `--color-secondary`: Secondary accent
- `--color-success`: Success states
- `--color-error`: Error states
- `--color-sunrise`: Decorative elements
- `--color-earth`: Warm elements

### Border Colors

- `--color-border-primary`: Main borders
- `--color-border-secondary`: Secondary borders
- `--color-border-focus`: Focus states

### Shadow Colors

- `--color-shadow-primary`: Main shadows
- `--color-shadow-secondary`: Text shadows

### Icon Colors

- `--color-icon-primary`: Primary icons
- `--color-icon-secondary`: Secondary icons
- `--color-icon-success`: Success icons
- `--color-icon-error`: Error icons
- `--color-icon-sunrise`: Decorative icons
- `--color-icon-heart`: Special icons

## 🎨 Creating Custom Themes

To create your own theme:

1. **Copy an existing theme** from `color-schemes.css`
2. **Rename the class** (e.g., `theme-my-custom`)
3. **Modify the color values** to your liking
4. **Add the class** to the themes array in `theme-switcher.js`
5. **Apply the theme** using `setTheme('theme-my-custom')`

Example custom theme:

```css
.theme-my-custom {
  --color-bg-primary: #your-color;
  --color-primary: #your-accent;
  /* ... other variables */
}
```

## 🔍 Quick Color Testing

To quickly test a single color change:

1. Open browser console (F12)
2. Run: `document.documentElement.style.setProperty('--color-primary', '#ff0000')`
3. This will change the primary color to red instantly

## 💾 Theme Persistence

Your theme choice is automatically saved and will persist between app sessions using localStorage.

## 🎯 Tips for Color Selection

- **Contrast**: Ensure text remains readable on backgrounds
- **Harmony**: Use complementary or analogous colors
- **Accessibility**: Consider color-blind users
- **Consistency**: Keep similar elements using the same color variables
- **Testing**: Always test your themes in different lighting conditions

## 🚀 Advanced Customization

For advanced users, you can also:

- Create dynamic themes that change based on time of day
- Add CSS animations for smooth theme transitions
- Create seasonal themes that change automatically
- Add user preference controls to the UI

Happy theming! 🎨✨
