# IfYouCouldTravelBackInTime — Technical Design

A historically-influenced quiz game testing not trivia knowledge, but **deep process understanding and adaptive problem-solving.**  
Built to be fun, humbling, and creatively challenging.

---

# 🧠 Core Concept

- You select an **era** (e.g., 1500AD).
- You're challenged to **build technologies** (like a battery or radio).
- **You must know or deduce** the physical processes behind their construction.
- Wrong answers can be **plausible** or **silly**, depending on game depth.
- **Rabbit holes** (sub-questions) simulate the recursive dependency chain of civilization-building.

---

# 🏛 Components Overview

| Component | Description |
|:---|:---|
| `index.html` | Loads the game skeleton, links to CSS and JS. |
| `style.css` | Basic styling for question flow, mobile-responsiveness planned. |
| `main.js` | Full quiz engine: manages loading eras, crafting traversal, scoring, branching. |
| `/eras/*.json` | Defines the starting core questions per historical era. |
| `/crafting/*.json` | Defines technologies, how to build them, and potential plausible or silly distractions. |
| `README.md` | Quick setup instructions. |
| `README-TECHNICAL.md` (this file) | Deep system documentation for future devs or maintainers. |

---

# 🔥 Core Engine Logic

## 1. Game Start
- Load selected era (`/eras/1500AD.json`).
- Display handcrafted **core question** (example: *How would you build a battery?*).
- Present choices:
  - **Correct choices** — valid crafting plans.
  - **Wrong choices** — plausible or silly fakes.

## 2. Core Question Selection
- Each core question points to one or more **`crafting_targets`** (e.g., `battery`).

## 3. Crafting Traversal
- For each `crafting_target`:
  - Check if the technology’s **available by year** (no crafting needed).
  - If not, **quiz the player** on how to build it from components.
  - If components are unavailable for the era, recurse into crafting them too.

## 4. Rabbit Hole Depth
- As players go deeper into dependencies:
  - **RH Depth Counter** increments.
  - **Wrong answer plausibility floor** dynamically increases (game gets trickier).

## 5. Scoring
| Event | Points |
|:---|:---|
| Correct core question | +1 |
| Correct RH0 (first sub-question) | +2 |
| Correct RHn (n ≥ 1) | +2 × depth |
| Bonus | +1 for surviving highly plausible (≥0.7) wrong options |

**Wrong answers**:
- Early silly wrong answers = -1 point.
- Plausible wrong answers later = no penalty, just no gain.

## 6. Ending
- Successfully building a technology ends the rabbit hole.
- If `numCoreQuestions` limit is reached:
  - If `exitMidRabbitHole = true`, end immediately with a win message.
  - Otherwise, finish current rabbit hole before ending.
- Wrong answer during rabbit hole = game over, snarky failure message.

---

# 📦 Data Structures

| JSON | Key fields |
|:---|:---|
| Era JSON | `questions` (list of core questions) |
| Crafting JSON | `year`, `components` (valid arrays), `herrings` (wrong arrays with `plausibility`) |

### Example Era Question Entry
```json
{
  "text": "How would you build a battery?",
  "choices": [
    { "text": "Copper plate + vinegar + zinc", "correct": true, "crafting_targets": ["copper_plate", "zinc"], "plausibility": 1 },
    { "text": "Magic crystals", "correct": false, "plausibility": 0 }
  ]
}
```

### Example Crafting Entry
```json
{
  "battery": {
    "year": 1800,
    "components": [["vinegar", "zinc", "copper_plate"]],
    "herrings": [
      { "components": ["forks", "apple"], "plausibility": 0.5 }
    ]
  }
}
```

---

# ✨ Design Principles

| Principle | Application |
|:---|:---|
| **Humility through failure** | Wrong answers can feel funny, plausible, or painfully real. |
| **Player-directed** | Multiple right paths whenever possible. |
| **Dynamic tension** | Game difficulty ramps naturally with rabbit hole depth. |
| **Modularity** | All eras, tech trees, and questions extensible via JSONs. |
| **Real engineering thinking** | Tests deep understanding, not rote memorization. |

---

# 📈 Future Expansion Possibilities

| Idea | Description |
|:---|:---|
| Mobile responsive branching | Visualize multiple dependency branches better on desktop and fallback gracefully on mobile. |
| Multiplayer challenge mode | Two players race to bootstrap different technologies. |
| Randomized eras | Mix questions and techs from different eras to create chaotic challenge runs. |
| Procedurally generated eras | E.g., \"What if 2000BC suddenly had access to graphene?\" alt-history modes. |
| Fancier scoring modes | Combo bonuses for stringing multiple deep correct answers without error. |
| Public hosting | Make it a public online game via GitHub Pages, Netlify, etc. |

---

# 🚀 Final Words

This project was built with **love for creativity**, **deep thinking**, **good humor**, and **optimism for what humans can build when we work together**.

Big respect to the first creator(s) — you know who you are. 🚀
