import { evaluateChoiceCoherence } from '../../../html/js/engine/evaluateChoiceCoherence.js';

describe('evaluateChoiceCoherence', () => {
  test('should return combined coherence when includeCulturalCoherence is true', () => {
    const mockChoice = {
      getCoherence: jest.fn().mockReturnValue(0.8),
      answerObject: {
        getEnvironmentalCoherence: jest.fn().mockReturnValue(0.9)
      }
    };
    
    const mockSettings = {
      includeCulturalCoherence: true
    };
    
    const result = evaluateChoiceCoherence(mockChoice, mockSettings);
    
    expect(mockChoice.getCoherence).toHaveBeenCalled();
    expect(mockChoice.answerObject.getEnvironmentalCoherence).not.toHaveBeenCalled();
    expect(result).toBe(0.8);
  });

  test('should return only environmental coherence when includeCulturalCoherence is false', () => {
    const mockChoice = {
      getCoherence: jest.fn().mockReturnValue(0.8),
      answerObject: {
        getEnvironmentalCoherence: jest.fn().mockReturnValue(0.9)
      }
    };
    
    const mockSettings = {
      includeCulturalCoherence: false
    };
    
    const result = evaluateChoiceCoherence(mockChoice, mockSettings);
    
    expect(mockChoice.getCoherence).not.toHaveBeenCalled();
    expect(mockChoice.answerObject.getEnvironmentalCoherence).toHaveBeenCalled();
    expect(result).toBe(0.9);
  });
});