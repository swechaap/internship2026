# AI-Powered Light Reflection and Shadow Simulator

An interactive educational physics simulator that helps students understand light reflection, the Law of Reflection, normal lines, shadow formation, and the behavior of plane, convex, and concave mirrors.

---

## Project Overview

This web-based simulation provides a real-time, visually rich environment for exploring optics. It combines:

- **Canvas-based physics rendering** for accurate ray tracing
- **AI-powered explanations** via the Anthropic Claude API
- **Interactive controls** for angle, intensity, surface type, and position
- **Quiz Mode** with 10 curriculum-aligned physics questions
- **Learning Mode** with comprehensive reference content

---

## Folder Structure

```
light-reflection-simulator/
├── frontend/
│   ├── public/
│   │   ├── images/            # Static images / diagrams
│   │   └── icons/             # App icons / favicons
│   └── src/
│       ├── css/
│       │   ├── style.css          # Main styles, theme, layout, components
│       │   └── simulation.css     # Canvas panel and AI box styles
│       ├── js/
│       │   ├── main.js            # App entry point, UI event handling
│       │   ├── simulator.js       # Canvas rendering engine
│       │   ├── physics.js         # Physics engine (Law of Reflection)
│       │   ├── shadow.js          # Shadow rendering module
│       │   └── ai-explainer.js    # AI explanation engine
│       ├── assets/                # Additional assets
│       └── index.html             # Main HTML entry point
│
├── backend/
│   ├── server.js              # Express server
│   ├── routes/
│   │   ├── explain.js         # AI explanation route
│   │   └── health.js          # Health check route
│   ├── controllers/
│   │   └── explainController.js  # Anthropic API proxy logic
│   └── package.json           # Backend dependencies
│
├── documentation/
│   └── documentation.md       # Full project documentation
│
└── README.md                  # This file
```

---

## 🚀 Installation & Running

### Option 1: Open directly in browser (no server needed)

```bash
# Simply open the HTML file in any modern browser:
open frontend/src/index.html

# Or with VS Code Live Server extension:
# Right-click index.html → "Open with Live Server"
```

### Option 2: Run with Node.js backend (enables server-side AI proxy)

**Prerequisites:** Node.js v18+

```bash
# 1. Navigate to backend folder
cd backend

# 2. Install dependencies
npm install

# 3. (Optional) Set Anthropic API key for AI explanations
export ANTHROPIC_API_KEY=your_api_key_here

# 4. Start the server
npm start

# 5. Open browser at:
# http://localhost:3000
```

### Option 3: Development mode with auto-reload

```bash
cd backend
npm run dev
```

---

## 🧪 Features Guide

### Simulation Panel

- **Select surface** (Plane / Convex / Concave) — changes the mirror geometry
- **Light Position** buttons — move the light source left/center/right
- **Incident Angle Slider** — drag to change θᵢ from 0° to 90°
- **Intensity Slider** — adjust light brightness (affects shadow depth)
- **Show Shadow** toggle — hide/show shadow visualization
- **Show Normal** toggle — hide/show the normal line (dashed green)
- **Animate Rays** toggle — enable/disable ray travel animation

### AI Explain Button

Click **"AI Explain This"** to get a context-aware explanation of:

- What reflection type is occurring
- Why the normal line determines the reflected ray direction
- Shadow characteristics for the current surface
- A real-world example

### Quiz Mode

10 curriculum-based questions. Click **Quiz** in the header nav. Select answers and click "Check Answers" for instant grading with explanations.

### Learn Mode

Comprehensive reference guide covering:

- Law of Reflection
- Three surface types with diagrams
- Shadow formation physics
- Key formulas (θᵢ = θᵣ, f = R/2, Mirror Equation)
- Real-world applications

---

## 🔬 Physics Concepts Covered

| Concept           | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| Law of Reflection | θᵢ = θᵣ (angle of incidence = angle of reflection)                         |
| Normal Line       | Perpendicular to the surface at the point of incidence                     |
| Plane Surface     | Regular/Specular reflection, uniform normals                               |
| Convex Surface    | Diverging reflection, outward-tilting normals                              |
| Concave Surface   | Converging reflection, inward-tilting normals, focal point                 |
| Shadow Formation  | Varies by surface type: sharp (plane), diffuse (convex), complex (concave) |
| Focal Length      | f = R/2 for concave mirrors                                                |

---

## 🛠 Technology Stack

| Layer     | Technology                                      |
| --------- | ----------------------------------------------- |
| Frontend  | HTML5, CSS3, Vanilla JavaScript                 |
| Rendering | Canvas API (2D)                                 |
| AI Tutor  | Anthropic Claude API (claude-sonnet-4-20250514) |
| Backend   | Node.js + Express.js                            |
| Fonts     | Orbitron, Exo 2, Space Mono (Google Fonts)      |

---

## 🔮 Future Improvements

1. **3D Mode** — Three.js integration for 3D ray visualization
2. **Wave Simulation** — Visualize light as a wave, show interference
3. **Refraction Module** — Add Snell's Law and transparent surfaces
4. **Student Progress Tracking** — Save quiz scores and track improvement
5. **Multi-language Support** — Localize for regional science curricula
6. **AR Mode** — Use device camera as surface, overlay ray visualization
7. **Teacher Dashboard** — Class management, assign simulations
8. **Export Feature** — Save simulation screenshots with labeled annotations
9. **Color Spectrum** — Simulate wavelength-dependent reflection
10. **VR Support** — WebXR integration for immersive learning

---

## 📄 License

MIT License — Free for educational use.

---

_Built as an academic project demonstrating the intersection of physics education and AI-assisted learning._
