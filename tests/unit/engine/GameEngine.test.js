import { GameEngine } from '../../../html/js/engine/GameEngine.js';
import { Settings } from '../../../html/js/engine/Settings.js';
import { GameState } from '../../../html/js/engine/GameState.js';
import { GameHistory } from '../../../html/js/engine/GameHistory.js';
import { EraLoader } from '../../../html/js/engine/EraLoader.js';
import { evaluateChoiceCoherence } from '../../../html/js/engine/evaluateChoiceCoherence.js';
import { Logger } from '../../../html/js/engine/Logger.js';
import { ErrorHandler } from '../../../html/js/engine/ErrorHandler.js';

// Mock dependencies
jest.mock('../../../html/js/engine/GameState.js');
jest.mock('../../../html/js/engine/GameHistory.js');
jest.mock('../../../html/js/engine/EraLoader.js');
jest.mock('../../../html/js/engine/evaluateChoiceCoherence.js');
jest.mock('../../../html/js/engine/Logger.js', () => ({
  Logger: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    LOG_LEVELS: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 },
    currentLevel: 1
  }
}));
jest.mock('../../../html/js/engine/ErrorHandler.js', () => ({
  ErrorHandler: {
    handleError: jest.fn(() => 'error-id-123'),
    createError: jest.fn((msg, code, data) => {
      const error = new Error(msg);
      error.code = code;
      error.data = data;
      return error;
    }),
    ERROR_CODES: {
      INVALID_ERA: 'E001',
      INVALID_CHOICE: 'E002',
      RESOURCE_LOAD_FAILED: 'E003',
      INVALID_QUESTION: 'E004',
      MISSING_DATA: 'E005',
      UNSUPPORTED_OPERATION: 'E006'
    }
  }
}));

describe('GameEngine', () => {
  let gameEngine;
  let mockSettings;
  let mockState;
  
  // Setup mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.prompt
    global.prompt = jest.fn().mockReturnValue('1');
    
    // Mock console methods
    global.console.log = jest.fn();
    global.console.error = jest.fn();
    
    // Create mock settings
    mockSettings = new Settings({
      numCoreQuestions: 2,
      exitMidRabbitHole: true,
      includeCulturalCoherence: false,
      baseCoherenceFloor: 0.5,
      coherenceRamp: 0.05
    });
    
    // Create mock state with rhDepth property
    mockState = {
      recordAnsweredQuestion: jest.fn(),
      calculateFinalScore: jest.fn().mockReturnValue(100),
      getBestImpact: jest.fn().mockReturnValue('Best Impact'),
      getWorstMistake: jest.fn().mockReturnValue('Worst Mistake'),
      rhDepth: 0
    };
    
    // Mock GameState implementation
    GameState.mockImplementation(() => mockState);
    
    // Mock GameHistory implementation
    GameHistory.mockImplementation(() => ({
      saveGame: jest.fn()
    }));
    
    // Mock EraLoader
    EraLoader.loadEra = jest.fn().mockResolvedValue({
      name: 'Test Era',
      year: 1500,
      getRandomQuestion: jest.fn().mockReturnValue({
        getText: () => 'Test Question',
        shuffleChoices: jest.fn(),
        choices: [
          {
            getText: () => 'Choice 1',
            answerObject: {
              getFollowupQuestions: jest.fn().mockReturnValue([]),
              getEnvironmentalCoherence: jest.fn().mockReturnValue(0.9)
            }
          }
        ]
      })
    });
    
    // Mock evaluateChoiceCoherence
    evaluateChoiceCoherence.mockReturnValue(0.8);
    
    // Create GameEngine instance
    gameEngine = new GameEngine(mockSettings);
    
    // Set state explicitly for tests that need it
    gameEngine.state = mockState;
  });

  test('should initialize with correct properties', () => {
    expect(gameEngine.settings).toBe(mockSettings);
    expect(GameHistory).toHaveBeenCalled();
    expect(gameEngine.currentEra).toBeNull();
    expect(Logger.info).toHaveBeenCalledWith('Game engine initialized with settings', mockSettings);
  });

  test('should start a new game', async () => {
    await gameEngine.startNewGame();
    
    expect(GameState).toHaveBeenCalled();
    expect(EraLoader.loadEra).toHaveBeenCalledWith('1500AD.json');
    expect(gameEngine.currentEra).not.toBeNull();
    expect(gameEngine.state).not.toBeNull();
    expect(Logger.info).toHaveBeenCalledWith("Starting a new game session...");
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Starting a new game'));
  });

  test('should ask core questions', async () => {
    // Setup game state first
    gameEngine.state = mockState;
    gameEngine.currentEra = {
      name: 'Test Era',
      year: 1500,
      getRandomQuestion: jest.fn().mockReturnValue({
        getText: () => 'Test Question',
        shuffleChoices: jest.fn(),
        choices: [
          {
            getText: () => 'Choice 1',
            answerObject: {
              getFollowupQuestions: jest.fn().mockReturnValue([]),
              getEnvironmentalCoherence: jest.fn().mockReturnValue(0.9)
            }
          }
        ]
      })
    };
    
    // Call the method directly rather than through startNewGame
    gameEngine.askCoreQuestions();
    
    // Should ask numCoreQuestions questions (2 in this case)
    expect(gameEngine.currentEra.getRandomQuestion).toHaveBeenCalledTimes(2);
    // Should log each question
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Test Question'));
    // Should log to Logger
    expect(Logger.info).toHaveBeenCalledWith(expect.stringContaining('Asking 2 core questions'));
  });

  test('should ask a question and process user choice', () => {
    // Mock question
    const mockQuestion = {
      getText: () => 'Test Question',
      shuffleChoices: jest.fn(),
      choices: [
        {
          getText: () => 'Choice 1',
          answerObject: {
            getFollowupQuestions: jest.fn().mockReturnValue([]),
            getEnvironmentalCoherence: jest.fn().mockReturnValue(0.9)
          }
        }
      ]
    };
    
    // Call method directly
    gameEngine.askQuestion(mockQuestion, 0);
    
    // Check method was called with correct parameters
    expect(mockQuestion.shuffleChoices).toHaveBeenCalled();
    expect(global.prompt).toHaveBeenCalled();
    expect(evaluateChoiceCoherence).toHaveBeenCalled();
    expect(gameEngine.state.recordAnsweredQuestion).toHaveBeenCalled();
    expect(Logger.debug).toHaveBeenCalledWith(expect.stringContaining('Asking question'), expect.any(Object));
  });

  test('should determine if rabbit hole should continue', () => {
    // With default settings and rhDepth = 0, threshold is 0.5
    gameEngine.state = { rhDepth: 0 };
    
    expect(gameEngine.shouldContinueRabbitHole(0.6)).toBe(true);
    expect(gameEngine.shouldContinueRabbitHole(0.4)).toBe(false);
    
    // With rhDepth = 2, threshold becomes 0.5 + (0.05 * 2) = 0.6
    gameEngine.state = { rhDepth: 2 };
    
    expect(gameEngine.shouldContinueRabbitHole(0.7)).toBe(true);
    expect(gameEngine.shouldContinueRabbitHole(0.5)).toBe(false);
    
    // Verify logger was called
    expect(Logger.debug).toHaveBeenCalledWith(expect.stringContaining('Coherence check'));
  });

  test('should follow rabbit hole questions if allowed', () => {
    // Mock followup questions
    const mockFollowupQuestion = {
      getText: () => 'Followup Question',
      shuffleChoices: jest.fn(),
      choices: []
    };
    
    const mockQuestion = {
      getText: () => 'Test Question',
      shuffleChoices: jest.fn(),
      choices: [
        {
          getText: () => 'Choice 1',
          answerObject: {
            getFollowupQuestions: jest.fn().mockReturnValue([mockFollowupQuestion]),
            getEnvironmentalCoherence: jest.fn().mockReturnValue(0.9)
          }
        }
      ]
    };
    
    // Set up game state
    gameEngine.state = mockState;
    
    // Override evaluateChoiceCoherence to allow rabbit hole
    evaluateChoiceCoherence.mockReturnValue(0.9);
    
    // Call method directly
    gameEngine.askQuestion(mockQuestion, 0);
    
    // Should check for followup questions
    expect(mockQuestion.choices[0].answerObject.getFollowupQuestions).toHaveBeenCalled();
    // Should have logged diving deeper message
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Diving deeper'));
    // Should log to Logger
    expect(Logger.info).toHaveBeenCalledWith(expect.stringContaining('Entering rabbit hole'));
  });

  test('should end the game and display results', () => {
    // Setup state explicitly
    gameEngine.state = mockState;
    
    gameEngine.endGame();
    
    expect(gameEngine.state.calculateFinalScore).toHaveBeenCalledWith(mockSettings);
    expect(gameEngine.state.getBestImpact).toHaveBeenCalled();
    expect(gameEngine.state.getWorstMistake).toHaveBeenCalled();
    expect(gameEngine.history.saveGame).toHaveBeenCalledWith(gameEngine.state);
    
    // Should log game over and results
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('GAME OVER'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Final Score: 100'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Best Impact: Best Impact'));
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Worst Mistake: Worst Mistake'));
    
    // Should log to Logger
    expect(Logger.info).toHaveBeenCalledWith("Game ended, calculating final results");
    expect(Logger.info).toHaveBeenCalledWith("Game results", expect.any(Object));
  });
  
  test('should handle invalid user input when asking questions', () => {
    // Setup invalid input
    global.prompt.mockReturnValue('invalid');
    
    // Mock question
    const mockQuestion = {
      getText: () => 'Test Question',
      shuffleChoices: jest.fn(),
      choices: [
        {
          getText: () => 'Choice 1',
          answerObject: {
            getFollowupQuestions: jest.fn().mockReturnValue([]),
            getEnvironmentalCoherence: jest.fn().mockReturnValue(0.9)
          }
        }
      ]
    };
    
    // Prevent infinite recursion from retry logic by having a valid input on second try
    let callCount = 0;
    global.prompt.mockImplementation(() => {
      callCount++;
      return callCount === 1 ? 'invalid' : '1';
    });
    
    // Call method
    gameEngine.askQuestion(mockQuestion, 0);
    
    // Should log error
    expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error asking question'));
    expect(ErrorHandler.handleError).toHaveBeenCalled();
  });
});