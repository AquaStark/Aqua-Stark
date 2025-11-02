import fs from 'fs';
import path from 'path';

/**
 * Unified logging middleware for centralized logging management
 *
 * @class LoggingMiddleware
 * @author Aqua Stark Team
 * @version 1.0.0
 * @since 2025-01-XX
 */
class LoggingMiddleware {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3,
    };

    this.currentLogLevel = process.env.LOG_LEVEL || 'INFO';
    // Check if running on Vercel (serverless environment)
    this.isVercel = !!process.env.VERCEL;
    // Use proper path resolution
    this.logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
    // 10MB default
    this.maxLogSize = parseInt(process.env.MAX_LOG_SIZE) || 10 * 1024 * 1024;
    this.maxLogFiles = parseInt(process.env.MAX_LOG_FILES) || 5;

    // Only create log directory in local development
    if (!this.isVercel) {
      this.ensureLogDirectory();
    }
  }

  /**
   * Ensures log directory exists
   * @private
   */
  ensureLogDirectory() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create log directory:', error.message);
    }
  }

  /**
   * Checks if log level should be processed
   * @param {string} level - Log level to check
   * @returns {boolean} - Whether to log this level
   * @private
   */
  shouldLog(level) {
    return this.logLevels[level] <= this.logLevels[this.currentLogLevel];
  }

  /**
   * Formats log message with timestamp and metadata
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   * @returns {string} - Formatted log message
   * @private
   */
  formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const metadataStr =
      Object.keys(metadata).length > 0 ? ` | ${JSON.stringify(metadata)}` : '';

    return `[${timestamp}] [${level}] ${message}${metadataStr}`;
  }

  /**
   * Writes log to file with rotation
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @param {Object} metadata - Additional metadata
   * @private
   */
  writeToFile(level, message, metadata = {}) {
    // Skip file operations in serverless environment (Vercel)
    if (this.isVercel) {
      return;
    }

    const logFile = path.join(this.logDir, `${level.toLowerCase()}.log`);
    const formattedMessage = this.formatMessage(level, message, metadata);

    try {
      // Check if file exists and get its size
      if (fs.existsSync(logFile)) {
        const stats = fs.statSync(logFile);
        if (stats.size > this.maxLogSize) {
          this.rotateLogFile(logFile);
        }
      }

      fs.appendFileSync(logFile, formattedMessage + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error.message);
    }
  }

  /**
   * Rotates log files when they exceed max size
   * @param {string} logFile - Path to log file
   * @private
   */
  rotateLogFile(logFile) {
    // Skip file operations in serverless environment (Vercel)
    if (this.isVercel) {
      return;
    }

    try {
      // Remove oldest log file if we have reached max files
      const logFileBase = logFile.replace('.log', '');
      const oldestFile = `${logFileBase}.${this.maxLogFiles - 1}.log`;

      if (fs.existsSync(oldestFile)) {
        fs.unlinkSync(oldestFile);
      }

      // Shift existing log files
      for (let i = this.maxLogFiles - 2; i >= 0; i--) {
        const currentFile = i === 0 ? logFile : `${logFileBase}.${i}.log`;
        const nextFile = `${logFileBase}.${i + 1}.log`;

        if (fs.existsSync(currentFile)) {
          fs.renameSync(currentFile, nextFile);
        }
      }
    } catch (error) {
      console.error('Failed to rotate log file:', error.message);
    }
  }

  /**
   * Logs error messages
   * @param {string} message - Error message
   * @param {Object} metadata - Additional metadata
   * @param {Error} error - Error object
   */
  error(message, metadata = {}, error = null) {
    if (!this.shouldLog('ERROR')) return;

    const errorMetadata = {
      ...metadata,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
    };

    const formattedMessage = this.formatMessage(
      'ERROR',
      message,
      errorMetadata
    );
    console.error(formattedMessage);
    this.writeToFile('ERROR', message, errorMetadata);
  }

  /**
   * Logs warning messages
   * @param {string} message - Warning message
   * @param {Object} metadata - Additional metadata
   */
  warn(message, metadata = {}) {
    if (!this.shouldLog('WARN')) return;

    const formattedMessage = this.formatMessage('WARN', message, metadata);
    console.warn(formattedMessage);
    this.writeToFile('WARN', message, metadata);
  }

  /**
   * Logs info messages
   * @param {string} message - Info message
   * @param {Object} metadata - Additional metadata
   */
  info(message, metadata = {}) {
    if (!this.shouldLog('INFO')) return;

    const formattedMessage = this.formatMessage('INFO', message, metadata);
    console.log(formattedMessage);
    this.writeToFile('INFO', message, metadata);
  }

  /**
   * Logs debug messages
   * @param {string} message - Debug message
   * @param {Object} metadata - Additional metadata
   */
  debug(message, metadata = {}) {
    if (!this.shouldLog('DEBUG')) return;

    const formattedMessage = this.formatMessage('DEBUG', message, metadata);
    console.debug(formattedMessage);
    this.writeToFile('DEBUG', message, metadata);
  }

  /**
   * Express middleware for request/response logging
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  requestLogger(req, res, next) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substr(2, 9);

    // Add request ID to request object for tracking
    req.requestId = requestId;

    // Log incoming request
    this.info('Incoming request', {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.get('User-Agent'),
      ip: req.ip || req.connection?.remoteAddress,
      headers: {
        'content-type': req.get('Content-Type'),
        authorization: req.get('Authorization') ? '[REDACTED]' : undefined,
      },
    });

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = (...args) => {
      const duration = Date.now() - startTime;

      this.info('Response sent', {
        requestId,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get('Content-Length') || 0,
      });

      return originalEnd.apply(res, args);
    };

    next();
  }

  /**
   * Express middleware for error logging
   * @param {Error} error - Error object
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  errorLogger(error, req, res, next) {
    this.error(
      'Unhandled error in request',
      {
        requestId: req.requestId,
        method: req.method,
        url: req.url,
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      },
      error
    );

    next(error);
  }

  /**
   * Logs controller errors with context
   * @param {string} controllerName - Name of the controller
   * @param {string} methodName - Name of the method
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  logControllerError(controllerName, methodName, error, context = {}) {
    this.error(
      `Error in ${controllerName}.${methodName}`,
      {
        controller: controllerName,
        method: methodName,
        ...context,
      },
      error
    );
  }

  /**
   * Logs service operations
   * @param {string} serviceName - Name of the service
   * @param {string} operation - Operation being performed
   * @param {Object} metadata - Additional metadata
   */
  logServiceOperation(serviceName, operation, metadata = {}) {
    this.info(`Service operation: ${serviceName}.${operation}`, {
      service: serviceName,
      operation,
      ...metadata,
    });
  }

  /**
   * Logs database operations
   * @param {string} operation - Database operation
   * @param {string} table - Database table
   * @param {Object} metadata - Additional metadata
   */
  logDatabaseOperation(operation, table, metadata = {}) {
    this.debug(`Database operation: ${operation} on ${table}`, {
      operation,
      table,
      ...metadata,
    });
  }
}

// Create singleton instance
const loggingMiddleware = new LoggingMiddleware();

// Export both the class and the instance
export { LoggingMiddleware, loggingMiddleware };

// Export default instance
export default loggingMiddleware;
