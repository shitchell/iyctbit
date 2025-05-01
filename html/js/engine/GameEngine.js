/**
 * GameEngine.js - Primary game controller for "If You Could Go Back In Time"
 * 
 * This module implements the core game loop and logic. Key responsibilities:
 * - Managing game state and history
 * - Loading era data
 * - Presenting questions and processing answers
 * - Controlling rabbit hole progression based on coherence scores
 * - Calculating and presenting final results
 * 
 * Note: Currently mixes UI concerns (console.log/prompt) with game logic.
 * Future refactoring should extract UI into a separate layer.
 */

import { EraLoader } from './EraLoader.js';
import { GameState } from './GameState.js';
import { GameHistory } from './GameHistory.js';
import { evaluateChoiceCoherence } from './evaluateChoiceCoherence.js';
import { Logger } from './Logger.js';
import { ErrorHandler } from './ErrorHandler.js';

/**
 * GameEngine - Primary controller class for game mechanics
 * 
 * Acts as the central orchestrator that manages game state, processes
 * player choices, and determines game progression.
 */
export class GameEngine {
    /**
     * Creates a new game engine with the specified settings
     * 
     * @param {Settings} settings - Configuration object with game parameters
     */
    constructor(settings) {
        this.settings = settings;
        this.history = new GameHistory();
        this.currentEra = null;
        this.state = null;
        Logger.info('Game engine initialized with settings', settings);
    }

    /**
     * Starts a new game session
     * 
     * Creates a new GameState, loads era data, and begins asking questions.
     * Currently hardcoded to the 1500AD era, but designed for future expansion.
     */
    async startNewGame() {
        Logger.info("Starting a new game session...");
        console.log("Starting a new game session...");
        
        try {
            // Initialize new game state
            this.state = new GameState();
            
            // Load era data (hardcoded to 1500AD for now)
            this.currentEra = await EraLoader.loadEra('1500AD.json');
            
            // Verify era loaded successfully
            if (!this.currentEra) {
                throw ErrorHandler.createError(
                    'Failed to load era data',
                    ErrorHandler.ERROR_CODES.RESOURCE_LOAD_FAILED,
                    { eraFile: '1500AD.json' }
                );
            }
            
            Logger.info("Era loaded successfully", { 
                name: this.currentEra.name, 
                year: this.currentEra.year 
            });
            
            // Begin the game with core questions
            this.askCoreQuestions();
        } catch (error) {
            ErrorHandler.handleError(error, 'startNewGame', { settings: this.settings });
            console.error("Failed to start game: " + error.message);
        }
    }

    /**
     * Presents core questions to the player
     * 
     * Generates the specified number of initial questions from the era data,
     * presents them to the player, and handles the progression to endgame.
     */
    askCoreQuestions() {
        Logger.info(`Asking ${this.settings.numCoreQuestions} core questions`);
        
        try {
            // Ask the configured number of core questions
            for (let i = 0; i < this.settings.numCoreQuestions; i++) {
                const question = this.currentEra.getRandomQuestion();
                Logger.debug(`Generated question ${i+1}/${this.settings.numCoreQuestions}`, { 
                    questionText: question.getText() 
                });
                
                // Process each question at depth 0 (core level)
                this.askQuestion(question, 0);
            }
            
            // After all core questions, end the game
            this.endGame();
        } catch (error) {
            ErrorHandler.handleError(error, 'askCoreQuestions');
            console.error("Error in core questions: " + error.message);
        }
    }

    /**
     * Presents a single question and processes the player's answer
     * 
     * Handles the full question cycle:
     * 1. Displays the question and choices
     * 2. Gets and validates player input
     * 3. Evaluates the coherence of the selected choice
     * 4. Records the answer
     * 5. Determines if rabbit hole progression is allowed
     * 6. Recursively follows up with deeper questions if appropriate
     * 
     * @param {Question} question - The question to present
     * @param {number} depth - Current depth in the rabbit hole (0 = core question)
     */
    askQuestion(question, depth) {
        try {
            Logger.debug(`Asking question at depth ${depth}`, { 
                question: question.getText() 
            });
            
            // Display question and choices (UI concern)
            console.log(`\n${question.getText()}`);
            question.shuffleChoices();
            question.choices.forEach((choice, idx) => {
                console.log(`${idx + 1}: ${choice.getText()}`);
            });

            // Get player input (UI concern)
            const userInput = prompt("Enter the number of your choice:");
            const selectedIndex = parseInt(userInput, 10) - 1;
            
            // Input validation
            if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= question.choices.length) {
                throw ErrorHandler.createError(
                    `Invalid choice selection: ${userInput}`,
                    ErrorHandler.ERROR_CODES.INVALID_CHOICE,
                    { userInput, validRange: [1, question.choices.length] }
                );
            }
            
            // Process the selected choice
            const selectedChoice = question.choices[selectedIndex];
            Logger.debug(`User selected choice ${selectedIndex + 1}`, { 
                choiceText: selectedChoice.getText() 
            });

            // Evaluate choice coherence (factual + cultural if enabled)
            const coherenceScore = evaluateChoiceCoherence(selectedChoice, this.settings);
            this.state.recordAnsweredQuestion(question, selectedChoice, coherenceScore, depth);
            Logger.debug(`Recorded answer with coherence ${coherenceScore}`);

            // Determine if rabbit hole progression is allowed based on coherence
            const allowBranch = this.shouldContinueRabbitHole(coherenceScore);
            
            // Handle rabbit hole progression if applicable
            if (allowBranch) {
                const followups = selectedChoice.answerObject.getFollowupQuestions();
                if (followups.length > 0) {
                    Logger.info(`Entering rabbit hole at depth ${depth + 1} with ${followups.length} questions`);
                    console.log("Diving deeper into the rabbit hole...");
                    
                    // Recursively ask each followup question at increased depth
                    followups.forEach(nextQuestion => this.askQuestion(nextQuestion, depth + 1));
                }
            } else {
                Logger.debug(`Rabbit hole exploration stopped at depth ${depth} with coherence ${coherenceScore}`);
            }
        } catch (error) {
            ErrorHandler.handleError(error, 'askQuestion', { 
                question: question.getText(), 
                depth 
            });
            console.error("Error asking question: " + error.message);
            
            // Retry with a valid input if it was just an input validation error
            if (error.code === ErrorHandler.ERROR_CODES.INVALID_CHOICE) {
                console.log("Please enter a valid choice number.");
                this.askQuestion(question, depth);
            }
        }
    }

    /**
     * Determines if the player can continue down a rabbit hole
     * 
     * Uses a dynamic threshold based on settings and current depth
     * to determine if a choice's coherence allows further progression.
     * 
     * @param {number} coherenceScore - The coherence score of the current choice
     * @returns {boolean} True if the player can continue the rabbit hole
     */
    shouldContinueRabbitHole(coherenceScore) {
        // Calculate required coherence threshold based on current depth
        const requiredCoherence = this.settings.baseCoherenceFloor +
            (this.settings.coherenceRamp * this.state.rhDepth);
        
        Logger.debug(`Coherence check: ${coherenceScore} >= ${requiredCoherence}`);
        
        // Allow progression if score meets or exceeds threshold
        return coherenceScore >= requiredCoherence;
    }

    /**
     * Concludes the game and presents final results
     * 
     * Calculates and displays the final score, best impact,
     * and worst mistake from the game session.
     */
    endGame() {
        try {
            Logger.info("Game ended, calculating final results");
            
            // Calculate final results
            const finalScore = this.state.calculateFinalScore(this.settings);
            const bestImpact = this.state.getBestImpact();
            const worstMistake = this.state.getWorstMistake();
            
            Logger.info("Game results", { 
                score: finalScore, 
                bestImpact, 
                worstMistake 
            });
            
            // Display final results (UI concern)
            console.log("\n=== GAME OVER ===");
            console.log(`Final Score: ${finalScore}`);
            console.log(`Best Impact: ${bestImpact}`);
            console.log(`Worst Mistake: ${worstMistake}`);
            
            // Save game to history for potential future review
            this.history.saveGame(this.state);
            Logger.debug("Game saved to history");
        } catch (error) {
            ErrorHandler.handleError(error, 'endGame');
            console.error("Error ending game: " + error.message);
        }
    }
}
