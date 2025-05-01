/**
 * A simple logging utility for the game
 */
export class Logger {
  static LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4
  };

  static currentLevel = Logger.LOG_LEVELS.INFO;
  static logToConsole = true;
  static logHistory = [];

  /**
   * Set the current logging level
   * @param {number} level - The log level to set
   */
  static setLevel(level) {
    if (level in Object.values(Logger.LOG_LEVELS)) {
      Logger.currentLevel = level;
    }
  }

  /**
   * Enable or disable console logging
   * @param {boolean} enabled - Whether to log to console
   */
  static enableConsoleOutput(enabled) {
    Logger.logToConsole = enabled;
  }

  /**
   * Clear the log history
   */
  static clearHistory() {
    Logger.logHistory = [];
  }

  /**
   * Get the entire log history
   * @returns {Array} The log history
   */
  static getHistory() {
    return [...Logger.logHistory];
  }

  /**
   * Log a debug message
   * @param {string} message - The message to log
   * @param {Object} [data] - Optional data to include with the log
   */
  static debug(message, data = null) {
    Logger._log('DEBUG', message, data);
  }

  /**
   * Log an info message
   * @param {string} message - The message to log
   * @param {Object} [data] - Optional data to include with the log
   */
  static info(message, data = null) {
    Logger._log('INFO', message, data);
  }

  /**
   * Log a warning message
   * @param {string} message - The message to log
   * @param {Object} [data] - Optional data to include with the log
   */
  static warn(message, data = null) {
    Logger._log('WARN', message, data);
  }

  /**
   * Log an error message
   * @param {string} message - The message to log
   * @param {Object} [data] - Optional data to include with the log
   */
  static error(message, data = null) {
    Logger._log('ERROR', message, data);
  }

  /**
   * Internal logging method
   * @private
   */
  static _log(level, message, data) {
    const logLevel = Logger.LOG_LEVELS[level];
    
    if (logLevel < Logger.currentLevel) {
      return;
    }

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      data: data ? JSON.parse(JSON.stringify(data)) : null
    };

    Logger.logHistory.push(logEntry);

    if (Logger.logToConsole) {
      const consoleMethod = level === 'ERROR' ? 'error' : 
                           level === 'WARN' ? 'warn' : 
                           level === 'DEBUG' ? 'debug' : 'log';
      
      if (data) {
        console[consoleMethod](`[${timestamp}] [${level}] ${message}`, data);
      } else {
        console[consoleMethod](`[${timestamp}] [${level}] ${message}`);
      }
    }
  }
}