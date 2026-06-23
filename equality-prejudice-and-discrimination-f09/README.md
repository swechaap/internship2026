<div align="center">

# 🏏 The 12th Man

### An Interactive Simulation on Equality, Prejudice & Discrimination

</div>

---

##  Overview

**The 12th Man** is a browser-based interactive simulation built around a cricket team selection story. It walks users through how **prejudice** and **discrimination** creep into decision-making — and what it takes to restore **equality**.

> *"Prejudice creates unfair assumptions. Discrimination creates unequal opportunities. Equality ensures everyone is judged by their abilities and efforts."*

---

##  Story Architechture

The simulation is structured across **5 scenes**, each representing a key concept:

| # | Scene | Core Concept | What Happens |
|---|-------|--------------|--------------|
| 1 | **Equality** | Fair Start | Every player enters trials expecting to be judged on ability |
| 2 | **Prejudice** | Bias Enters | Personal assumptions begin to influence the selection discussion |
| 3 | **Discrimination** | Unfair Exclusion | A strong performer is left out of the squad despite good trial results |
| 4 | **Consequences** | The Cost of Bias | The team struggles — the excluded player's skills were exactly what was needed |
| 5 | **Equality Restored** | Reform | Selections are moved to a performance-only process |

---

##  Learning Objectives

By the end of this simulation, users will be able to:

- Distinguish between **prejudice** (unfair assumption) and **discrimination** (unfair action)
- Understand how bias harms both **individuals** and **teams**
- Recognise what **genuine equality of opportunity** looks like
- Reflect on their own decision-making through interactive choices

---

##  Project Structure

```
the-12th-man/
│
├── index.html                  # Landing page
├── README.md                   # Project documentation
├── storyboard.jpeg             # Original storyboard reference
│
├── scenes/
│   ├── scene1-equality.html
│   ├── scene2-prejudice.html
│   ├── scene3-discrimination.html
│   ├── scene4-consequences.html
│   └── scene5-restored.html
│
├── assets/
│   └── images/                 # Character and scene illustrations
│
├── js/
│   ├── simulation.js           # Core simulation logic
│   ├── choices.js              # Decision tree and branching
│   └── scoring.js              # Fairness score tracker
│
└── css/
    ├── main.css                # Global styles
    └── scenes.css              # Scene-specific layout
```

---

##  Built With

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

| Layer | Technology | Purpose |
|-------|------------|---------|
| Structure | HTML5 | Scene pages, dialogue layout, UI elements |
| Styling | CSS3 | Animations, transitions, responsive design |
| Logic | JavaScript (ES6+) | Branching decisions, scoring, scene navigation |
| Hosting | GitHub Pages | Free static site deployment |

---

##  Getting Started

### Prerequisites
- Any modern browser — Chrome, Firefox, Edge, Safari
- No frameworks, no installs — pure HTML, CSS & JS

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/your-username/the-12th-man.git

# 2. Move into the project folder
cd the-12th-man

# 3. Open directly in your browser
open index.html
```

---

##  How It Works

1. **Pick a role** — Play as the Head Selector, the New Player, or observe as the Coach
2. **Work through each scene** — Read dialogue and make decisions at key branching points
3. **Watch the impact** — Your choices affect team performance and a live **Fairness Score**
4. **Debrief at the end** — A summary maps your decisions to real-world concepts of equality and discrimination

---

##  Roadmap

- [x] Storyboard finalised
- [x] README and project structure defined
- [ ] Scene layouts (HTML & CSS)
- [ ] Character dialogue scripted
- [ ] Decision branching logic (JS)
- [ ] Fairness Score system
- [ ] Mobile responsiveness
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] GitHub Pages deployment
- [ ] Facilitator / teacher guide

---

##  Contributing

1. Fork the repository
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add: your description"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
Work in progress..
</div>
