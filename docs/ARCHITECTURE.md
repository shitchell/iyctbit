# ARCHITECTURE.md

---

## 📜 Project Structure

| Folder | Purpose |
|:---|:---|
| `/html/` | Main entry point and basic HTML |
| `/css/` | Styling (currently minimal) |
| `/js/engine/` | Game orchestration and runtime logic |
| `/js/content/` | Knowledge models (tech, ideas, questions, choices) |
| `/js/data/` | Eras, cultural coherence mappings |
| `/docs/` | Documentation, codex memory, architecture guides |

---

## 🧠 Main Components

| Component | Responsibility |
|:---|:---|
| `GameEngine` | Master control for the game loop |
| `Settings` | Player-configurable settings |
| `GameState` | Runtime session data |
| `GameHistory` | Past games played |
| `KnowledgeTransmission` | Interface for any knowledge element |
| `Technology` | Physical invention knowledge |
| `KnowledgeIdea` | Social, political, or medical knowledge |
| `Question` | Poses a situation to the player |
| `Choice` | Player option tied to a KnowledgeTransmission |
| `AnsweredQuestion` | Records player's answer, coherence, impact |

---

## 🔥 Key Concepts

- **Environmental Coherence**: How correct something is objectively.
- **Cultural Coherence**: How believable/adoptable something is in its era + region.
- **Impact Score**: How much change a knowledge element can produce.

---

## 🚀 Gameplay Loop

1. Configure Settings
2. Select Era
3. Answer Core Questions
4. Dive into Rabbit Holes
5. Calculate Score (truth and/or adoption)
6. Show Endgame Stats
7. Optionally: Save and review past runs

---


