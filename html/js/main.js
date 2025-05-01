/**
 * main.js - Entry point for "If You Could Go Back In Time"
 * 
 * This file serves as the application's entry point, responsible for:
 * 1. Initializing core services (error handling, logging)
 * 2. Configuring game settings
 * 3. Creating and starting the game engine
 * 
 * The architecture follows a modular approach where the main file
 * only handles bootstrapping and delegates actual game logic to specialized modules.
 */

// Import core engine components
import { GameEngine } from './engine/GameEngine.js';
import { Settings } from './engine/Settings.js';
import { EraLoader } from './engine/EraLoader.js';
import { Logger } from './engine/Logger.js';
import { ErrorHandler } from './engine/ErrorHandler.js';

// Initialize global error handling to catch unhandled exceptions
ErrorHandler.initialize();

/**
 * Configure logging based on URL parameters
 * Allows dynamic log level adjustment through URL:
 * ?logLevel=DEBUG|INFO|WARN|ERROR|NONE
 */
const urlParams = new URLSearchParams(window.location.search);
const logLevel = urlParams.get('logLevel') || 'INFO';
Logger.setLevel(Logger.LOG_LEVELS[logLevel] || Logger.LOG_LEVELS.INFO);

Logger.info('Initializing game with default settings');

/**
 * Configure default game settings
 * 
 * numCoreQuestions: Number of primary questions to ask
 * exitMidRabbitHole: Whether to terminate rabbit holes when core questions are complete
 * includeCulturalCoherence: Whether to consider cultural factors or just scientific accuracy
 * baseCoherenceFloor: Minimum coherence score required for early rabbit hole questions
 * coherenceRamp: How much coherence requirement increases per depth level
 */
const defaultSettings = new Settings({
    numCoreQuestions: 3,
    exitMidRabbitHole: true,
    includeCulturalCoherence: false,
    baseCoherenceFloor: 0.5,
    coherenceRamp: 0.05
});

/**
 * Game initialization and error handling
 * 
 * Creates the GameEngine instance with configured settings
 * and starts a new game session with error protection
 */
try {
    Logger.info('Creating game engine and starting new game');
    const game = new GameEngine(defaultSettings);
    game.startNewGame();
} catch (error) {
    ErrorHandler.handleError(error, 'main.js bootstrap');
    console.error('Failed to start game:', error.message);
}
