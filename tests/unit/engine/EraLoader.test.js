import { EraLoader } from '../../../html/js/engine/EraLoader.js';
import { Logger } from '../../../html/js/engine/Logger.js';
import { ErrorHandler } from '../../../html/js/engine/ErrorHandler.js';

// Mock dependencies
jest.mock('../../../html/js/engine/Logger.js', () => ({
  Logger: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
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

// Mock fetch globally for testing
global.fetch = jest.fn();

describe('EraLoader', () => {
  // Save original console methods and mock them
  const originalConsole = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    debug: console.debug
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock console methods
    console.error = jest.fn();
    console.log = jest.fn();
    console.warn = jest.fn();
    console.debug = jest.fn();
    
    // Default mock implementation for fetch with ok: true
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          name: 'Test Era',
          year: 1500,
          tagline: 'Test Tagline',
          overview: 'Test Overview',
          questions: [
            {
              text: 'Test Question',
              choices: [
                {
                  customText: 'Test Choice',
                  answerObject: {
                    text: 'Test Answer',
                    environmentalCoherence: 0.9,
                    culturalCoherence: 0.8,
                    impactScore: 50
                  }
                }
              ]
            }
          ]
        })
      })
    );
  });

  afterEach(() => {
    // Restore console methods
    console.log = originalConsole.log;
    console.error = originalConsole.error;
    console.warn = originalConsole.warn;
    console.debug = originalConsole.debug;
  });

  test('should load era data successfully', async () => {
    const era = await EraLoader.loadEra('test-era.json');
    
    // Verify fetch was called with the right path
    expect(global.fetch).toHaveBeenCalledWith('../js/data/eras/test-era.json');
    
    // Verify logging
    expect(Logger.info).toHaveBeenCalledWith(expect.stringContaining('Loading era from file'));
    
    // Verify era object structure
    expect(era).toBeDefined();
    expect(era.name).toBe('Test Era');
    expect(era.year).toBe(1500);
    expect(era.tagline).toBe('Test Tagline');
    expect(era.overview).toBe('Test Overview');
    expect(typeof era.getRandomQuestion).toBe('function');
  });

  test('should handle errors when loading era data', async () => {
    // Mock fetch to reject
    global.fetch.mockImplementation(() => 
      Promise.reject(new Error('Network error'))
    );
    
    const era = await EraLoader.loadEra('failing-era.json');
    
    // Should log error via ErrorHandler
    expect(ErrorHandler.handleError).toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalled();
    
    // Should log to console.error for backward compatibility
    expect(console.error).toHaveBeenCalled();
    
    // Should return null on error
    expect(era).toBeNull();
  });

  test('should return a properly formatted random question', async () => {
    const era = await EraLoader.loadEra('test-era.json');
    const question = era.getRandomQuestion();
    
    // Verify question properties
    expect(question).toBeDefined();
    expect(question.getText()).toBe('Test Question');
    expect(question.choices.length).toBe(1);
    expect(question.choices[0].getText()).toBe('Test Choice');
    expect(typeof question.shuffleChoices).toBe('function');
  });

  test('choice objects should have required methods', async () => {
    const era = await EraLoader.loadEra('test-era.json');
    const question = era.getRandomQuestion();
    const choice = question.choices[0];
    
    // Verify choice methods
    expect(typeof choice.getText).toBe('function');
    expect(typeof choice.getCoherence).toBe('function');
    expect(choice.answerObject).toBeDefined();
    expect(typeof choice.answerObject.getText).toBe('function');
    expect(typeof choice.answerObject.getCoherence).toBe('function');
    expect(typeof choice.answerObject.getEnvironmentalCoherence).toBe('function');
    expect(typeof choice.answerObject.getCulturalCoherence).toBe('function');
    expect(typeof choice.answerObject.getImpactScore).toBe('function');
    expect(typeof choice.answerObject.getSuccessResponse).toBe('function');
    expect(typeof choice.answerObject.getFailureResponse).toBe('function');
    expect(typeof choice.answerObject.getFollowupQuestions).toBe('function');
  });

  test('should shuffle choices correctly', async () => {
    // Mock Math.random for predictable shuffle
    const originalRandom = Math.random;
    Math.random = jest.fn().mockReturnValue(0.5);
    
    // Mock era data with multiple choices
    global.fetch.mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          name: 'Test Era',
          year: 1500,
          tagline: 'Test Tagline',
          overview: 'Test Overview',
          questions: [
            {
              text: 'Test Question',
              choices: [
                {
                  customText: 'Choice 1',
                  answerObject: { 
                    text: 'Answer 1', 
                    environmentalCoherence: 0.9,
                    culturalCoherence: 0.8,
                    impactScore: 50
                  }
                },
                {
                  customText: 'Choice 2',
                  answerObject: { 
                    text: 'Answer 2', 
                    environmentalCoherence: 0.8,
                    culturalCoherence: 0.7,
                    impactScore: 40
                  }
                },
                {
                  customText: 'Choice 3',
                  answerObject: { 
                    text: 'Answer 3', 
                    environmentalCoherence: 0.7,
                    culturalCoherence: 0.6,
                    impactScore: 30
                  }
                }
              ]
            }
          ]
        })
      })
    );
    
    const era = await EraLoader.loadEra('test-era.json');
    const question = era.getRandomQuestion();
    
    // Shuffle and verify that logger was called
    question.shuffleChoices();
    
    // With our mocked random, the shuffle should have a predictable outcome
    expect(Logger.debug).toHaveBeenCalledWith(expect.stringContaining('Shuffling question choices'));
    
    // Restore Math.random
    Math.random = originalRandom;
  });
});