# Little Explorer World

An interactive web-based mini-game collection built for toddlers and young children. It features simple controls, voice prompts, and fun animations to help kids learn core skills through play[cite: 1, 4].

---

## Key Features

* **Voice Instructions**: Audio guidance via the Web Speech API reads prompts out loud for non-readers.
* **Playful Animations**: Opening, tap, and transition effects are animated using the GSAP library.
* **Kid-Friendly UI**: Large buttons, high-contrast colors, and simple navigation designed for touchscreens.
* **Pure Web Tech**: Built using standard HTML, CSS, JavaScript, and Web Audio API

---

## 🎮 Mini-Games

1. **Flip Cards** – Memory card matching game.
2. **Find Colors** – Color recognition and selection practice.
3. **Find Numbers** – Early number recognition practice.
4. **Visual Math** – Visual object counting practice (1 to 20).
5. **Shape Sorter** – Shape matching and spatial awareness game.
6. **Animal Sounds** – Animal recognition and audio matching activity.
7. **Emotion Match** – Identifying feelings and facial expressions.
8. **Story Time** – Short interactive story session.
9. **Word Builder** – Letter and word building practice.
10. **Pattern Pop** – Sequence recognition and balloon popping game.

---

## Project Directory Structure

```text
├── index.html                  # Main menu and hub page
├── css/
│   └── hub.css                 # Main menu styles & grid layout
├── js/
│   └── hub.js                  # Main menu logic & entry animations
├── shared/
│   └── audio-helper.js         # Sound effects & Text-to-Speech (TTS) module
└── games/
    ├── 01-flip-cards/          # Card matching game files
    ├── 02-find-colors/         # Color finding game files
    └── ... (03 to 10 subdirectories)
