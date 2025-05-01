import { Logger } from './Logger.js';
import { ErrorHandler } from './ErrorHandler.js';

export class EraLoader {
    static async loadEra(filename) {
        const path = `../js/data/eras/${filename}`;
        Logger.info(`Loading era from file: ${filename}`);
        
        try {
            const response = await fetch(path);
            
            if (!response.ok) {
                throw ErrorHandler.createError(
                    `HTTP error when loading era: ${response.status}`,
                    ErrorHandler.ERROR_CODES.RESOURCE_LOAD_FAILED,
                    { status: response.status, statusText: response.statusText }
                );
            }
            
            const data = await response.json();
            
            if (!data.name || !data.year || !data.questions || !Array.isArray(data.questions)) {
                throw ErrorHandler.createError(
                    'Malformed era data: missing required fields',
                    ErrorHandler.ERROR_CODES.MISSING_DATA,
                    { filename, fields: Object.keys(data) }
                );
            }
            
            Logger.debug(`Loaded era "${data.name}" (${data.year}) with ${data.questions.length} questions`);
            
            return {
                name: data.name,
                year: data.year,
                tagline: data.tagline,
                overview: data.overview,
                getRandomQuestion() {
                    if (data.questions.length === 0) {
                        throw ErrorHandler.createError(
                            'No questions available in era data',
                            ErrorHandler.ERROR_CODES.MISSING_DATA,
                            { era: data.name }
                        );
                    }
                    
                    const index = Math.floor(Math.random() * data.questions.length);
                    const raw = data.questions[index];
                    
                    if (!raw.text || !raw.choices || !Array.isArray(raw.choices)) {
                        throw ErrorHandler.createError(
                            'Malformed question data in era',
                            ErrorHandler.ERROR_CODES.INVALID_QUESTION,
                            { questionIndex: index }
                        );
                    }
                    
                    Logger.debug(`Selected random question: "${raw.text}"`);
                    
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
                    
                    Logger.debug(`Created ${choices.length} choices for question`);
                    
                    return {
                        getText: () => raw.text,
                        choices: choices,
                        shuffleChoices: () => {
                            Logger.debug("Shuffling question choices");
                            for (let i = choices.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [choices[i], choices[j]] = [choices[j], choices[i]];
                            }
                        }
                    };
                }
            };
        } catch (error) {
            const errorId = ErrorHandler.handleError(error, 'loadEra', { filename });
            Logger.error(`Failed to load era data: ${error.message}`, { errorId });
            console.error("Failed to load era data:", error);
            return null;
        }
    }
}

