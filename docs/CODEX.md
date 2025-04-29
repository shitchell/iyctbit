# CODEX.md

## 📜 Project Codex - AI Working Memory

---

## 🧠 Concept

"If You Could Go Back In Time" is a philosophical-simulation game.

- Players attempt to transmit useful knowledge into the past.
- They are scored on environmental correctness, cultural adoption likelihood, and potential historical impact.
- Players navigate branching "Rabbit Holes" if they can demonstrate sufficient coherence.

---

## 🏗️ Architecture Summary

| Component | Responsibility |
|:---|:---|
| GameEngine | Controls gameplay |
| Settings | Holds player configuration |
| Era | Defines tech/social status of a time period |
| Question | Poses a player challenge |
| Choice | Offers selectable answers |
| KnowledgeTransmission | Base class for transferable knowledge |
| Technology | Craftable inventions |
| KnowledgeIdea | Teachable concepts (e.g., vaccines, democracy) |
| GameState | Tracks progress |
| GameHistory | Records past playthroughs |

---

## 🔥 Key Game Mechanics

- **Environmental Coherence**: Objective truthfulness.
- **Cultural Coherence**: Subjective adoptability.
- **Impact Score**: Magnitude of influence if adopted.

- **Settings Toggle**: Can enable/disable cultural coherence consideration.
- **Rabbit Hole Progression**: Based on coherence thresholds.
- **Adaptive Wrong Answers**: More plausible as depth increases.

---

## 🛠 Important Configuration Options

| Option | Meaning |
|:---|:---|
| numCoreQuestions | Number of starting core challenges |
| exitMidRabbitHole | Whether to cut rabbit holes early |
| includeCulturalCoherence | If cultural context is evaluated |
| baseCoherenceFloor | Initial acceptance difficulty |
| coherenceRamp | Increased difficulty with depth |

---

## 🚀 File Structure

| Folder | Content |
|:---|:---|
| `/html/` | Entry page |
| `/css/` | (Empty, future styles) |
| `/js/engine/` | Game runtime logic |
| `/js/content/` | Knowledge and choices |
| `/js/data/` | Historical era definitions, cultural mappings |
| `/docs/` | Technical documentation |

---

## ✨ Future-Proofing Notes

- Region-specific cultural modeling scaffolded
- Era JSON format ready for extension
- Procedural generation of questions possible

---

# 📣 Instructions for AI

- Maintain modularity
- Expand carefully respecting existing class hierarchy
- Assume culturalCoherence scaffold exists even if initially disabled
- Prefer clean interfaces over type coercion
- Prioritize logical elegance and extensibility

