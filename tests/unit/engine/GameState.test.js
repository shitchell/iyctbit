import { GameState } from '../../../html/js/engine/GameState.js';
import { AnsweredQuestion } from '../../../html/js/content/AnsweredQuestion.js';

// Mock AnsweredQuestion since we're only testing GameState
jest.mock('../../../html/js/content/AnsweredQuestion.js');

describe('GameState', () => {
  let gameState;
  
  beforeEach(() => {
    // Clear mocks
    jest.clearAllMocks();
    
    // Create new state for each test
    gameState = new GameState();
    
    // Mock AnsweredQuestion implementation
    AnsweredQuestion.mockImplementation((question, selectedChoice, isCorrect, depth) => {
      return {
        question,
        selectedChoice,
        isCorrect,
        depth,
        getPoints: jest.fn().mockReturnValue(10),
        getImpact: jest.fn().mockReturnValue(selectedChoice.answerObject.getImpactScore())
      };
    });
  });

  test('should initialize with default values', () => {
    expect(gameState.score).toBe(0);
    expect(gameState.rhDepth).toBe(0);
    expect(gameState.unsolvedComponents).toEqual([]);
    expect(gameState.currentTarget).toBeNull();
    expect(gameState.answeredQuestions).toEqual([]);
  });

  test('should record answered questions', () => {
    const mockQuestion = {
      getText: () => 'Test question?'
    };
    
    const mockChoice = {
      answerObject: {
        getEnvironmentalCoherence: () => 0.9,
        getImpactScore: () => 50
      }
    };
    
    gameState.recordAnsweredQuestion(mockQuestion, mockChoice, 0.8, 1);
    
    expect(gameState.answeredQuestions.length).toBe(1);
    expect(AnsweredQuestion).toHaveBeenCalledWith(
      mockQuestion,
      mockChoice,
      true, // isCorrect
      1 // depth
    );
    
    // Should increment rhDepth for correct answer
    expect(gameState.rhDepth).toBe(2);
  });

  test('should not increment rhDepth for incorrect answers', () => {
    const mockQuestion = {
      getText: () => 'Test question?'
    };
    
    const mockChoice = {
      answerObject: {
        getEnvironmentalCoherence: () => 0.7, // Below the 0.8 threshold
        getImpactScore: () => 20
      }
    };
    
    gameState.recordAnsweredQuestion(mockQuestion, mockChoice, 0.6, 1);
    
    expect(gameState.answeredQuestions.length).toBe(1);
    expect(gameState.rhDepth).toBe(0); // Shouldn't change
  });

  test('should calculate final score', () => {
    // Add multiple answered questions
    const mockSettings = {};
    
    // Mock question 1
    const mockQuestion1 = { getText: () => 'Question 1' };
    const mockChoice1 = {
      answerObject: {
        getEnvironmentalCoherence: () => 0.9,
        getImpactScore: () => 50
      }
    };
    
    // Mock question 2
    const mockQuestion2 = { getText: () => 'Question 2' };
    const mockChoice2 = {
      answerObject: {
        getEnvironmentalCoherence: () => 0.8,
        getImpactScore: () => 30
      }
    };
    
    gameState.recordAnsweredQuestion(mockQuestion1, mockChoice1, 0.9, 0);
    gameState.recordAnsweredQuestion(mockQuestion2, mockChoice2, 0.8, 1);
    
    // Each AnsweredQuestion.getPoints returns 10
    const expectedScore = 10 + 10; // 20
    
    const score = gameState.calculateFinalScore(mockSettings);
    
    expect(score).toBe(expectedScore);
    expect(gameState.score).toBe(expectedScore);
  });

  test('should get best impact', () => {
    // Mock question with high impact
    const mockQuestion1 = { getText: () => 'High Impact Question' };
    const mockChoice1 = {
      answerObject: {
        getEnvironmentalCoherence: () => 0.9,
        getImpactScore: () => 100
      }
    };
    
    // Mock question with low impact
    const mockQuestion2 = { getText: () => 'Low Impact Question' };
    const mockChoice2 = {
      answerObject: {
        getEnvironmentalCoherence: () => 0.8,
        getImpactScore: () => 20
      }
    };
    
    gameState.recordAnsweredQuestion(mockQuestion1, mockChoice1, 0.9, 0);
    gameState.recordAnsweredQuestion(mockQuestion2, mockChoice2, 0.8, 1);
    
    const bestImpact = gameState.getBestImpact();
    
    expect(bestImpact).toBe('High Impact Question');
  });

  test('should get worst mistake', () => {
    // Mock question with high impact
    const mockQuestion1 = { getText: () => 'High Impact Question' };
    const mockChoice1 = {
      answerObject: {
        getEnvironmentalCoherence: () => 0.9,
        getImpactScore: () => 100
      }
    };
    
    // Mock question with low impact
    const mockQuestion2 = { getText: () => 'Low Impact Question' };
    const mockChoice2 = {
      answerObject: {
        getEnvironmentalCoherence: () => 0.8,
        getImpactScore: () => 20
      }
    };
    
    gameState.recordAnsweredQuestion(mockQuestion1, mockChoice1, 0.9, 0);
    gameState.recordAnsweredQuestion(mockQuestion2, mockChoice2, 0.8, 1);
    
    const worstMistake = gameState.getWorstMistake();
    
    expect(worstMistake).toBe('Low Impact Question');
  });

  test('should return "None" for best impact when no questions answered', () => {
    expect(gameState.getBestImpact()).toBe('None');
  });

  test('should return "None" for worst mistake when no questions answered', () => {
    expect(gameState.getWorstMistake()).toBe('None');
  });
});