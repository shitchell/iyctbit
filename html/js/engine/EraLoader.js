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

