import { Logger } from './Logger.js';

/**
 * Error handler for the game
 */
export class ErrorHandler {
  /**
   * Game-specific error codes
   */
  static ERROR_CODES = {
    INVALID_ERA: 'E001',
    INVALID_CHOICE: 'E002',
    RESOURCE_LOAD_FAILED: 'E003',
    INVALID_QUESTION: 'E004',
    MISSING_DATA: 'E005',
    UNSUPPORTED_OPERATION: 'E006'
  };

  /**
   * Initialize global error handling
   */
  static initialize() {
    // Catch unhandled errors and log them
    window.addEventListener('error', (event) => {
      ErrorHandler.handleError(event.error || new Error(event.message), 'Unhandled error');
      
      // Prevent default browser error handling
      event.preventDefault();
    });

    // Catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      ErrorHandler.handleError(event.reason || new Error('Unknown promise rejection'), 'Unhandled promise rejection');
      
      // Prevent default browser error handling
      event.preventDefault();
    });
  }

  /**
   * Handle and log an error
   * @param {Error} error - The error to handle
   * @param {string} context - Context of where the error occurred
   * @param {Object} [data] - Additional data related to the error
   * @returns {string} - Error ID for reference
   */
  static handleError(error, context, data = {}) {
    const errorId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const errorInfo = {
      id: errorId,
      message: error.message,
      stack: error.stack,
      code: error.code,
      context,
      data
    };

    Logger.error(`Error in ${context}: ${error.message}`, errorInfo);
    return errorId;
  }

  /**
   * Check if a condition is true and throw an error if not
   * @param {boolean} condition - The condition to assert
   * @param {string} message - Error message if condition fails
   * @param {string} code - Error code
   * @param {Object} [data] - Additional error data
   */
  static assert(condition, message, code, data = {}) {
    if (!condition) {
      const error = new Error(message);
      error.code = code;
      error.data = data;
      throw error;
    }
  }

  /**
   * Create a standardized game error
   * @param {string} message - Error message
   * @param {string} code - Error code
   * @param {Object} [data] - Additional error data
   * @returns {Error} - The created error
   */
  static createError(message, code, data = {}) {
    const error = new Error(message);
    error.code = code;
    error.data = data;
    return error;
  }
}