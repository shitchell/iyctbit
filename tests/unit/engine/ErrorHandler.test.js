import { ErrorHandler } from '../../../html/js/engine/ErrorHandler.js';
import { Logger } from '../../../html/js/engine/Logger.js';

jest.mock('../../../html/js/engine/Logger.js', () => ({
  Logger: {
    error: jest.fn(),
    LOG_LEVELS: { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, NONE: 4 },
    currentLevel: 1
  }
}));

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should handle an error and log it', () => {
    const error = new Error('Test error');
    const context = 'Test context';
    const data = { test: 'data' };
    
    const errorId = ErrorHandler.handleError(error, context, data);
    
    expect(errorId).toBeDefined();
    expect(typeof errorId).toBe('string');
    expect(Logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error in Test context: Test error'),
      expect.objectContaining({
        id: errorId,
        message: 'Test error',
        context: 'Test context',
        data: { test: 'data' }
      })
    );
  });

  test('should create an error with code and data', () => {
    const message = 'Test error message';
    const code = ErrorHandler.ERROR_CODES.INVALID_ERA;
    const data = { test: 'data' };
    
    const error = ErrorHandler.createError(message, code, data);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe(message);
    expect(error.code).toBe(code);
    expect(error.data).toEqual(data);
  });

  test('should assert a condition and not throw when true', () => {
    expect(() => {
      ErrorHandler.assert(true, 'Should not throw', ErrorHandler.ERROR_CODES.INVALID_ERA);
    }).not.toThrow();
  });

  test('should assert a condition and throw when false', () => {
    const message = 'Should throw';
    const code = ErrorHandler.ERROR_CODES.INVALID_ERA;
    const data = { test: 'data' };
    
    expect(() => {
      ErrorHandler.assert(false, message, code, data);
    }).toThrow(message);
    
    try {
      ErrorHandler.assert(false, message, code, data);
    } catch (error) {
      expect(error.code).toBe(code);
      expect(error.data).toEqual(data);
    }
  });

  test('should have defined error codes', () => {
    expect(ErrorHandler.ERROR_CODES).toBeDefined();
    expect(Object.keys(ErrorHandler.ERROR_CODES).length).toBeGreaterThan(0);
    expect(ErrorHandler.ERROR_CODES.INVALID_ERA).toBeDefined();
    expect(ErrorHandler.ERROR_CODES.RESOURCE_LOAD_FAILED).toBeDefined();
  });

  test('should handle error with missing data', () => {
    const error = new Error('Test error');
    
    const errorId = ErrorHandler.handleError(error, 'Test context');
    
    expect(Logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error in Test context: Test error'),
      expect.objectContaining({
        data: {}
      })
    );
  });
});