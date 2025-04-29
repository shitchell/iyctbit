import { GameEngine } from './engine/GameEngine.js';
import { Settings } from './engine/Settings.js';
import { EraLoader } from './engine/EraLoader.js';

// Basic manual bootstrapping
const defaultSettings = new Settings({
    numCoreQuestions: 3,
    exitMidRabbitHole: true,
    includeCulturalCoherence: false,
    baseCoherenceFloor: 0.5,
    coherenceRamp: 0.05
});

const game = new GameEngine(defaultSettings);
game.startNewGame();
