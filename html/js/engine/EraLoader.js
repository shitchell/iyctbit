/**
 * EraLoader.js - Historical era data loading module
 * 
 * Responsible for loading era data from JSON files and transforming
 * raw data into usable game objects with proper methods.
 * 
 * Acts as a factory for Question and Choice objects, creating them
 * dynamically from the loaded JSON data with appropriate interface methods.
 */

import { Logger } from './Logger.js';
import { ErrorHandler } from './ErrorHandler.js';

/**
 * EraLoader - Static utility class for loading historical era data
 * 
 * Provides functionality to load era definitions from JSON files and
 * transform them into game-ready objects with appropriate methods.
 */
export class EraLoader {
    /**
     * Loads era data from a JSON file and creates game objects
     * 
     * @param {string} filename - Name of the era JSON file to load
     * @returns {Object|null} Era object with methods or null if loading failed
     */
    static async loadEra(filename) {
        const path = `../js/data/eras/${filename}`;
        Logger.info(`Loading era from file: ${filename}`);
        
        try {
            // Load the era JSON file
            const response = await fetch(path);
            
            // Check for HTTP errors
            if (!response.ok) {
                throw ErrorHandler.createError(
                    `HTTP error when loading era: ${response.status}`,
                    ErrorHandler.ERROR_CODES.RESOURCE_LOAD_FAILED,
                    { status: response.status, statusText: response.statusText }
                );
            }
            
            // Parse the JSON data
            const data = await response.json();
            
            // Validate required fields are present
            if (!data.name || !data.year || !data.questions || !Array.isArray(data.questions)) {
                throw ErrorHandler.createError(
                    'Malformed era data: missing required fields',
                    ErrorHandler.ERROR_CODES.MISSING_DATA,
                    { filename, fields: Object.keys(data) }
                );
            }
            
            Logger.debug(`Loaded era "${data.name}" (${data.year}) with ${data.questions.length} questions`);
            
            // Return an Era-like object with the required methods
            return {
                name: data.name,
                year: data.year,
                tagline: data.tagline,
                overview: data.overview,
                
                /**
                 * Creates and returns a random question from the era data
                 * 
                 * This method acts as a factory for Question objects, creating
                 * them dynamically with the necessary methods based on the JSON data.
                 * 
                 * @returns {Object} A Question-like object with getText() and choices array
                 */
                getRandomQuestion() {
                    // Ensure there are questions available
                    if (data.questions.length === 0) {
                        throw ErrorHandler.createError(
                            'No questions available in era data',
                            ErrorHandler.ERROR_CODES.MISSING_DATA,
                            { era: data.name }
                        );
                    }
                    
                    // Select a random question
                    const index = Math.floor(Math.random() * data.questions.length);
                    const raw = data.questions[index];
                    
                    // Validate the question has required fields
                    if (!raw.text || !raw.choices || !Array.isArray(raw.choices)) {
                        throw ErrorHandler.createError(
                            'Malformed question data in era',
                            ErrorHandler.ERROR_CODES.INVALID_QUESTION,
                            { questionIndex: index }
                        );
                    }
                    
                    Logger.debug(`Selected random question: "${raw.text}"`);
                    
                    // Create a mock target object (could be a real KnowledgeTransmission in the future)
                    const target = { getText: () => raw.text };
                    
                    // Transform raw choice data into Choice-like objects with required methods
                    const choices = raw.choices.map(c => ({
                        // Choice interface methods
                        getText: () => c.customText,
                        getCoherence: () => (c.answerObject.environmentalCoherence * c.answerObject.culturalCoherence),
                        
                        // Answer object with KnowledgeTransmission-like interface
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
                    
                    // Return a Question-like object with the required methods
                    return {
                        getText: () => raw.text,
                        choices: choices,
                        shuffleChoices: () => {
                            Logger.debug("Shuffling question choices");
                            // Fisher-Yates shuffle algorithm
                            for (let i = choices.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [choices[i], choices[j]] = [choices[j], choices[i]];
                            }
                        }
                    };
                }
            };
        } catch (error) {
            // Handle and log any errors during loading
            const errorId = ErrorHandler.handleError(error, 'loadEra', { filename });
            Logger.error(`Failed to load era data: ${error.message}`, { errorId });
            console.error("Failed to load era data:", error);
            return null;
        }
    }
}

