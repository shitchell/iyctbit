import { EraLoader } from './EraLoader.js';
import { GameState } from './GameState.js';
import { GameHistory } from './GameHistory.js';
import { evaluateChoiceCoherence } from './evaluateChoiceCoherence.js';
import { Logger } from './Logger.js';
import { ErrorHandler } from './ErrorHandler.js';

export class GameEngine {
    constructor(settings) {
        this.settings = settings;
        this.history = new GameHistory();
        this.currentEra = null;
        this.state = null;
        Logger.info('Game engine initialized with settings', settings);
    }

    async startNewGame() {
        Logger.info("Starting a new game session...");
        console.log("Starting a new game session...");
        
        try {
            this.state = new GameState();
            this.currentEra = await EraLoader.loadEra('1500AD.json'); // hardcoded for now
            
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
            
            this.askCoreQuestions();
        } catch (error) {
            ErrorHandler.handleError(error, 'startNewGame', { settings: this.settings });
            console.error("Failed to start game: " + error.message);
        }
    }

    askCoreQuestions() {
        Logger.info(`Asking ${this.settings.numCoreQuestions} core questions`);
        
        try {
            for (let i = 0; i < this.settings.numCoreQuestions; i++) {
                const question = this.currentEra.getRandomQuestion();
                Logger.debug(`Generated question ${i+1}/${this.settings.numCoreQuestions}`, { 
                    questionText: question.getText() 
                });
                this.askQuestion(question, 0);
            }
            this.endGame();
        } catch (error) {
            ErrorHandler.handleError(error, 'askCoreQuestions');
            console.error("Error in core questions: " + error.message);
        }
    }

    askQuestion(question, depth) {
        try {
            Logger.debug(`Asking question at depth ${depth}`, { 
                question: question.getText() 
            });
            
            console.log(`\n${question.getText()}`);
            question.shuffleChoices();
            question.choices.forEach((choice, idx) => {
                console.log(`${idx + 1}: ${choice.getText()}`);
            });

            const userInput = prompt("Enter the number of your choice:");
            const selectedIndex = parseInt(userInput, 10) - 1;
            
            // Validate user input
            if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= question.choices.length) {
                throw ErrorHandler.createError(
                    `Invalid choice selection: ${userInput}`,
                    ErrorHandler.ERROR_CODES.INVALID_CHOICE,
                    { userInput, validRange: [1, question.choices.length] }
                );
            }
            
            const selectedChoice = question.choices[selectedIndex];
            Logger.debug(`User selected choice ${selectedIndex + 1}`, { 
                choiceText: selectedChoice.getText() 
            });

            const coherenceScore = evaluateChoiceCoherence(selectedChoice, this.settings);
            this.state.recordAnsweredQuestion(question, selectedChoice, coherenceScore, depth);
            Logger.debug(`Recorded answer with coherence ${coherenceScore}`);

            const allowBranch = this.shouldContinueRabbitHole(coherenceScore);
            
            if (allowBranch) {
                const followups = selectedChoice.answerObject.getFollowupQuestions();
                if (followups.length > 0) {
                    Logger.info(`Entering rabbit hole at depth ${depth + 1} with ${followups.length} questions`);
                    console.log("Diving deeper into the rabbit hole...");
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

    shouldContinueRabbitHole(coherenceScore) {
        const requiredCoherence = this.settings.baseCoherenceFloor +
            (this.settings.coherenceRamp * this.state.rhDepth);
        Logger.debug(`Coherence check: ${coherenceScore} >= ${requiredCoherence}`);
        return coherenceScore >= requiredCoherence;
    }

    endGame() {
        try {
            Logger.info("Game ended, calculating final results");
            
            const finalScore = this.state.calculateFinalScore(this.settings);
            const bestImpact = this.state.getBestImpact();
            const worstMistake = this.state.getWorstMistake();
            
            Logger.info("Game results", { 
                score: finalScore, 
                bestImpact, 
                worstMistake 
            });
            
            console.log("\n=== GAME OVER ===");
            console.log(`Final Score: ${finalScore}`);
            console.log(`Best Impact: ${bestImpact}`);
            console.log(`Worst Mistake: ${worstMistake}`);
            
            this.history.saveGame(this.state);
            Logger.debug("Game saved to history");
        } catch (error) {
            ErrorHandler.handleError(error, 'endGame');
            console.error("Error ending game: " + error.message);
        }
    }
}
