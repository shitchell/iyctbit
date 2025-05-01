import { Logger } from '../../../html/js/engine/Logger.js';

describe('Logger', () => {
  // Save original console methods to restore later
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    debug: console.debug
  };

  // Mock console methods for testing
  beforeEach(() => {
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.debug = jest.fn();
    
    // Reset logger
    Logger.clearHistory();
    Logger.currentLevel = Logger.LOG_LEVELS.INFO;
    Logger.logToConsole = true;
  });

  // Restore console methods after tests
  afterEach(() => {
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.debug = originalConsole.debug;
  });

  test('should log messages at appropriate levels', () => {
    // At INFO level, DEBUG should not log
    Logger.debug('Debug message');
    expect(console.debug).not.toHaveBeenCalled();
    expect(Logger.getHistory().length).toBe(0);

    // INFO should log
    Logger.info('Info message');
    expect(console.log).toHaveBeenCalled();
    expect(Logger.getHistory().length).toBe(1);
    expect(Logger.getHistory()[0].level).toBe('INFO');
    expect(Logger.getHistory()[0].message).toBe('Info message');

    // WARN should log
    Logger.warn('Warning message');
    expect(console.warn).toHaveBeenCalled();
    expect(Logger.getHistory().length).toBe(2);
    expect(Logger.getHistory()[1].level).toBe('WARN');
    
    // ERROR should log
    Logger.error('Error message');
    expect(console.error).toHaveBeenCalled();
    expect(Logger.getHistory().length).toBe(3);
    expect(Logger.getHistory()[2].level).toBe('ERROR');
  });

  test('should respect log level settings', () => {
    // Set to ERROR level
    Logger.setLevel(Logger.LOG_LEVELS.ERROR);
    
    // Lower levels should not log
    Logger.debug('Debug message');
    Logger.info('Info message');
    Logger.warn('Warning message');
    expect(console.debug).not.toHaveBeenCalled();
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(Logger.getHistory().length).toBe(0);
    
    // ERROR should still log
    Logger.error('Error message');
    expect(console.error).toHaveBeenCalled();
    expect(Logger.getHistory().length).toBe(1);
  });

  test('should disable console output when specified', () => {
    Logger.enableConsoleOutput(false);
    
    Logger.info('Silent info');
    Logger.warn('Silent warning');
    Logger.error('Silent error');
    
    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    
    // Messages should still be in history
    expect(Logger.getHistory().length).toBe(3);
  });

  test('should include data in log entries', () => {
    const testData = { id: 1, name: 'test' };
    
    Logger.info('Info with data', testData);
    
    expect(Logger.getHistory()[0].data).toEqual(testData);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('[INFO] Info with data'),
      testData
    );
  });

  test('should provide correct log history', () => {
    Logger.info('First message');
    Logger.warn('Second message');
    
    const history = Logger.getHistory();
    expect(history.length).toBe(2);
    expect(history[0].message).toBe('First message');
    expect(history[1].message).toBe('Second message');
    
    // History should be a copy, not a reference
    history.pop();
    expect(Logger.getHistory().length).toBe(2);
  });

  test('should clear history when requested', () => {
    Logger.info('Test message');
    expect(Logger.getHistory().length).toBe(1);
    
    Logger.clearHistory();
    expect(Logger.getHistory().length).toBe(0);
  });
});