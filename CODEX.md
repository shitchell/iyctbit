# `codex.md` - Project Operating Manual

## Project Name
**IfYouCouldTravelBackInTime**

---

## Project Purpose
A humor-driven, process-oriented, historically influenced quiz game.  
Tests a player's ability to **bootstrap technological processes**, **solve engineering challenges**, and **survive recursive knowledge dependencies** - *rather than* memorizing trivia.

---

## Core Concept
- Player picks a **historical era** (e.g., 1500AD).
- Player answers **core questions** (big tech challenges like \"build a battery\").
- Each core question branches into **rabbit holes** (sub-questions) based on real tech dependencies.
- Wrong answers can be **silly** (obviously wrong) or **plausible** (realistic-sounding but wrong).
- The goal is to **build technology** before getting lost in bad assumptions.
  
---

## Current Components

| Component | Description |
|:---|:---|
| `index.html` | Main web page, links to `style.css` and `main.js`. |
| `style.css` | Basic styling for display and layout. |
| `main.js` | Quiz engine: era loading, core/rabbit hole logic, scoring, branching. |
| `/crafting/crafting.json` | Crafting graph: how technologies are built, with real and fake (herring) recipes. |
| `/eras/1500AD.json` | Era file: starting core questions for 1500AD. |
| `README.md` | Quick setup guide. |
| `README-TECHNICAL.md` | Full technical project documentation. |

---

## Important Settings

Defined in `main.js`:

| Setting | Purpose |
|:---|:---|
| `numCoreQuestions` | How many core questions to ask during a game session. |
| `exitMidRabbitHole` | Whether to end the game mid-rabbit-hole if the core question count is reached. |

---

## Game Flow

1. **Start Game**
    - Load era JSON (e.g., `eras/1500AD.json`).
    - Display a core question.
2. **Answer Core Question**
    - Correct: Gain points and get crafting targets.
    - Wrong: Game over.
3. **Crafting Stage (Rabbit Hole)**
    - For each crafting target:
      - If tech available by year, no further action needed.
      - If not available, quiz player on how to craft it.
      - Wrong answers are filtered based on depth (`plausibility` threshold increases with rabbit hole depth).
4. **End Game**
    - If building succeeds, or if forced exit after reaching `numCoreQuestions`.
    - Score reflects depth, plausibility difficulty, and number of correct answers.

---

## Scoring System

| Event | Points |
|:---|:---|
| Correct core question | +1 |
| Correct rabbit hole (first level) | +2 |
| Correct rabbit hole (deeper levels) | +2 x depth |
| Bonus for high-plausibility bait evasion | +1 (if surviving >0.7 plausibility wrongs) |
| Wrong silly early answer | -1 |

---

## Key Design Principles

- **Multiple Correct Paths**: Players can select different crafting strategies (e.g., copper battery or graphite battery).
- **Dynamic Difficulty**: Plausibility floor for wrong answers increases with rabbit hole depth.
- **Humor and Realism**: Early silly wrong answers, late serious plausible mistakes.
- **Minimal Hardcoding**: All questions and recipes sourced from JSON, expandable.
- **Modularity**: New eras, techs, and wrong answers are easy to add.

---

## Future Work (Optional Improvements)

| Feature | Priority | Notes |
|:---|:---|:---|
| Mobile responsive branching | High | Right now rabbit holes are sequential, could branch visually on wide screens. |
| Era selection screen | Medium | Currently only 1500AD loaded. |
| Procedural era randomization | Medium | Random eras, alt-history tech trees. |
| Combo bonus scoring | Medium | Rewards for deep correct streaks without mistakes. |
| Public hosting | Low | GitHub Pages, Netlify, Vercel. |
| Multiplayer challenge mode | Wildcard | Two players race to bootstrap different techs.

---

## Development Philosophies

- **Prioritize the Player's Feeling**: Always encourage curiosity, flexibility, humility - not rote memorization.
- **Lightweight First**: Fancy features (animation, sound, visual trees) can come after core mechanics work solidly.
- **Transparent Systems**: Let players see their own dependency trees if possible (future visualization feature).
- **Scalable JSONs**: Add new eras and technologies by simply extending `eras/*.json` and `crafting/*.json`.

---

# Final Notes

If resuming work:

- Start from `main.js` to modify logic.
- Expand eras under `/eras/`.
- Expand technology crafting chains under `/crafting/`.
- Adjust plausibility settings dynamically in `calculatePlausibilityFloor(depth)`.
- Adjust UI appearance in `style.css` (very basic right now).
  
No server backend needed - all files are static.

---

# ? Reminder

This project is a fusion of:
- Humor
- Engineering thinking
- Civilization-building simulation
- Humble curiosity

Keep that spirit alive when extending it!
