# 🌬️ Breathing Mechanism - The Air Team Adventure

An interactive React animated demo about the breathing mechanism and the role of the diaphragm. Perfect for educational purposes!

## 📋 Features

✨ **8 Educational Scenes:**
- Scene 1: Introduction - The Air Team
- Scene 2: The Nose - The Gate
- Scene 3: The Trachea - The Main Road
- Scene 4: The Lungs - The Air Palace
- Scene 5: The Diaphragm - The Magic Elevator
- Scene 6: Inhalation - Bringing In Air
- Scene 7: Exhalation - Sending Out Air
- Scene 8: The Breathing Cycle - Never Stops!

🎮 **Interactive Controls:**
- ▶ Play/Pause - Auto-advance every 5 seconds
- ⏮ Previous - Navigate to previous scene
- ⏭ Next - Navigate to next scene
- 🔁 Restart - Start from the beginning
- 📑 Scenes - Jump to any scene via thumbnail navigation

🎨 **Visual Features:**
- Animated SVG illustrations for each scene
- Smooth fade and slide transitions
- Dynamic progress bar showing playback progress
- Scene counter (e.g., "Scene 3 of 8")
- Pulsing animations on active organs
- Child-friendly color theme (sky blue, soft pink, coral, white)
- Playful fonts (Baloo & Nunito from Google Fonts)
- Mobile responsive design

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd breathing-mechanism-demo
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at `http://localhost:3000`

## 🛠️ Build for Production

To create an optimized production build:
```bash
npm run build
```

The build folder will contain the optimized files ready for deployment.

## 📁 Project Structure

```
breathing-mechanism-demo/
├── public/
│   └── index.html           # Main HTML file
├── src/
│   ├── App.jsx              # Main React component with all scenes
│   ├── index.js             # React entry point
│   └── styles.css           # All styling and animations
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🎯 How It Works

**Auto-Play Mode:**
- Scenes automatically advance every 5 seconds when playing
- Click "Pause" to stop auto-advance
- Click "Play" to resume

**Manual Navigation:**
- Use Previous/Next buttons to navigate scenes manually
- Click on scene thumbnails to jump to a specific scene
- Scene counter shows current position (e.g., "Scene 5 of 8")

**Visual Feedback:**
- Progress bar fills as you progress through scenes
- Animated SVG illustrations with organ movements
- Smooth transitions between scenes

## 🎨 Customization

### Colors
Modify color values in `src/styles.css`:
- Sky blue: `#87CEEB`
- Soft pink: `#FFB6C1`
- Coral: `#FF9999`
- Gold (Diaphragm): `#FFD700`

### Scene Duration
Edit the timeout value in `src/App.jsx` (currently 5000ms):
```javascript
const timer = setTimeout(() => {
  setCurrentScene((prev) => (prev + 1) % scenes.length);
}, 5000); // Change this value
```

### Fonts
Google Fonts are loaded in `public/index.html`. Change fonts in the link tag to use different typography.

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

Breakpoints:
- Desktop: 1000px and above
- Tablet: 768px to 1000px
- Mobile: Below 768px
- Small Mobile: Below 480px

## 🎓 Educational Content

Each scene includes:
- **Title** - Clear, descriptive scene name
- **Subtitle** - Scene numbering
- **Description** - Age-appropriate explanation
- **Animated Illustration** - Visual representation with animations
- **Characters Info** - Team member callout (for Scene 1)

## 💡 Tagline
**"Breathe Well, Live Well!"**

## 📄 License

This educational material is free to use for learning purposes.

## 🤝 Contributing

Feel free to customize and extend this demo for your educational needs!

---

**Created with ❤️ for learning and education**
