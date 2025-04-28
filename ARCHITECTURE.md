# ARCHITECTURE.md

> **IfYouCouldTravelBackInTime**  
> A project structure and flow overview

---

## ?? Modules and Responsibilities

| Module | Responsibility |
|:---|:---|
| `index.html` | Loads core HTML structure; links CSS and JS; provides game canvas. |
| `style.css` | Handles visual styling of questions, choices, layout, and score displays. |
| `main.js` | Main game engine. Handles loading JSONs, player input, crafting resolution, rabbit hole branching, scoring, and end-game conditions. |
| `/eras/*.json` | Defines available eras, core questions, and their correct/wrong options. |
| `/crafting/*.json` | Defines technologies, how to build them, alternative crafting paths, and \"herring\" wrong answers with plausibility scores. |
| `README.md` | Basic setup and usage instructions. |
| `README-TECHNICAL.md` | Detailed project design philosophy, logic, and intended future expansions. |
| `codex.md` | Codex AI-specific operational context and project philosophy. |

---

## ?? Key Structures

| Structure | Description |
|:---|:---|
| **Era JSON (`eras/*.json`)** | Contains a `questions` object. Each question has `text`, a list of `choices`, and metadata like `correct`, `crafting_targets`, and `plausibility`. |
| **Crafting JSON (`crafting/*.json`)** | Each tech object includes a `year`, `components` (valid crafting recipes), and `herrings` (fake crafting recipes) with plausibility scores. |
| **Game State (inside `main.js`)** | Tracks score, rabbit hole depth, current unsolved components, current target technology, and number of core questions answered. |

---

## ?? Data Flow Overview

1. **Game Start**
    - Load selected era (`eras/1500AD.json`) and crafting data (`crafting/crafting.json`).
2. **Core Question Phase**
    - Display one core question with multiple choices.
    - Upon correct answer, extract crafting targets.
3. **Crafting Phase (Rabbit Hole Traversal)**
    - For each component needed:
        - If the component is available (era � invention year), skip.
        - Otherwise, generate sub-question with real recipes and filtered wrong herrings.
4. **Rabbit Hole Depth Management**
    - Rabbit hole depth counter increases after each successful crafting step.
    - Minimum plausibility for wrong answers increases with depth.
5. **Scoring**
    - Points awarded based on:
        - Correctness
        - Rabbit hole depth
        - Plausibility difficulty survived
6. **End Game**
    - On reaching `numCoreQuestions` or failure during crafting.

---

## ?? Common Patterns and Conventions

| Pattern | Notes |
|:---|:---|
| **JSON-driven extensibility** | All eras, questions, and technologies are externalized into JSON files for ease of expansion. |
| **Plausibility-graded wrong answers** | Wrong answers are filtered based on rabbit hole depth to increase challenge naturally. |
| **Minimal hardcoding** | Core logic reads from data files; very few hardcoded strings or paths. |
| **Shuffled options** | Every question randomizes answer order to prevent position-based guessing. |
| **Separation of presentation and logic** | Styling is handled via CSS; gameplay logic is contained entirely in `main.js`. |

---

## ?? Planned/Future Module Extensions (Optional)

| Planned Module | Purpose |
|:---|:---|
| `eraSelector.js` | Handle multi-era selection on game start. |
| `branchVisualizer.js` | Display rabbit hole trees horizontally on desktop screens. |
| `scoreTracker.js` | Enhance scoring system with combos, bonus visualizations. |
| `mobileFriendly.js` | Handle automatic branch-to-linear transitions on mobile screens. |
