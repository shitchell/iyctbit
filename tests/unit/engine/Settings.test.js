import { Settings } from '../../../html/js/engine/Settings.js';

describe('Settings', () => {
  test('should initialize with default values when no options are provided', () => {
    const settings = new Settings();
    
    expect(settings.numCoreQuestions).toBe(5);
    expect(settings.exitMidRabbitHole).toBe(true);
    expect(settings.includeCulturalCoherence).toBe(false);
    expect(settings.baseCoherenceFloor).toBe(0.5);
    expect(settings.coherenceRamp).toBe(0.05);
  });

  test('should use provided values when options are specified', () => {
    const customSettings = {
      numCoreQuestions: 10,
      exitMidRabbitHole: false,
      includeCulturalCoherence: true,
      baseCoherenceFloor: 0.7,
      coherenceRamp: 0.1
    };
    
    const settings = new Settings(customSettings);
    
    expect(settings.numCoreQuestions).toBe(10);
    expect(settings.exitMidRabbitHole).toBe(false);
    expect(settings.includeCulturalCoherence).toBe(true);
    expect(settings.baseCoherenceFloor).toBe(0.7);
    expect(settings.coherenceRamp).toBe(0.1);
  });

  test('should use default values for properties not specified', () => {
    const partialSettings = {
      numCoreQuestions: 7,
      exitMidRabbitHole: false
    };
    
    const settings = new Settings(partialSettings);
    
    expect(settings.numCoreQuestions).toBe(7);
    expect(settings.exitMidRabbitHole).toBe(false);
    expect(settings.includeCulturalCoherence).toBe(false); // Default
    expect(settings.baseCoherenceFloor).toBe(0.5); // Default
    expect(settings.coherenceRamp).toBe(0.05); // Default
  });
});