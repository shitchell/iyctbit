import { GameEngine } from './engine/GameEngine.js';
import { Settings } from './engine/Settings.js';
import { EraLoader } from './engine/EraLoader.js';
import { Logger } from './engine/Logger.js';
import { ErrorHandler } from './engine/ErrorHandler.js';

// Initialize error handling
ErrorHandler.initialize();

// Set up logging level based on URL parameters or default to INFO
const urlParams = new URLSearchParams(window.location.search);
const logLevel = urlParams.get('logLevel') || 'INFO';
Logger.setLevel(Logger.LOG_LEVELS[logLevel] || Logger.LOG_LEVELS.INFO);

Logger.info('Initializing game with default settings');

// Basic manual bootstrapping
const defaultSettings = new Settings({
    numCoreQuestions: 3,
    exitMidRabbitHole: true,
    includeCulturalCoherence: false,
    baseCoherenceFloor: 0.5,
    coherenceRamp: 0.05
});

try {
    Logger.info('Creating game engine and starting new game');
    const game = new GameEngine(defaultSettings);
    game.startNewGame();
} catch (error) {
    ErrorHandler.handleError(error, 'main.js bootstrap');
    console.error('Failed to start game:', error.message);
}
