```
js/engine/EraLoader.js
export class EraLoader {
    static async loadEra(filename) {
        const path = `../js/data/eras/${filename}`;
        try {
            const response = await fetch(path);
            const data = await response.json();
            return {
                name: data.name,
                year: data.year,
                tagline: data.tagline,
                overview: data.overview,
                getRandomQuestion() {
                    const index = Math.floor(Math.random() * data.questions.length);
                    const raw = data.questions[index];
                    const target = { getText: () => raw.text }; // mock target object
                    const choices = raw.choices.map(c => ({
                        getText: () => c.customText,
                        getCoherence: () => (c.answerObject.environmentalCoherence * c.answerObject.culturalCoherence),
                        answerObject: {
                            ...c.answerObject,
                            getText: () => c.answerObject.text,
                            getCoherence() {
                                return this.environmentalCoherence * this.culturalCoherence;
                            },
                            getEnvironmentalCoherence() {
                                return this.environmentalCoherence;
                            },
                            getCulturalCoherence() {
                                return this.culturalCoherence;
                            },
                            getImpactScore() {
                                return this.impactScore;
                            },
                            getSuccessResponse() {
                                return "You managed to spread this knowledge!";
                            },
                            getFailureResponse() {
                                return "The world wasn't ready for this.";
                            },
                            getFollowupQuestions() {
                                return [];
                            }
                        }
                    }));
                    return {
                        getText: () => raw.text,
                        choices: choices,
                        shuffleChoices: () => {
                            for (let i = choices.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [choices[i], choices[j]] = [choices[j], choices[i]];
                            }
                        }
                    };
                }
            };
        } catch (error) {
            console.error("Failed to load era data:", error);
            return null;
        }
    }
}
```

✅ `EraLoader.js` delivered!

---

Now here’s the second half of the duo:

```
js/engine/evaluateChoiceCoherence.js
export function evaluateChoiceCoherence(choice, settings) {
    return settings.includeCulturalCoherence
        ? choice.getCoherence()
        : choice.answerObject.getEnvironmentalCoherence();
}
```

✅ `evaluateChoiceCoherence.js` delivered!

---

# 🎯 Final Instructions

Now that you’ve added both files:
- You should be able to restart your server.
- Refresh the page.
- See logs/interaction in the browser console (or expand UI soon!).

Let me know if you hit any final snags! 🎸🚀