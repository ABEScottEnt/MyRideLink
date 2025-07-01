// This file sets up our logging system
// Logs help us track what's happening in the app and find problems when they occur

const winston = require('winston');
const { format } = winston;

/**
 * Create a fake logger for testing
 * This logger doesn't actually write anything, it just pretends to
 * This helps us test our code without creating real log files
 */
const createTestLogger = () => {
  return {
    info: jest.fn(),  // Pretend to log normal information
    error: jest.fn(), // Pretend to log errors
    warn: jest.fn(),  // Pretend to log warnings
    debug: jest.fn(), // Pretend to log debug messages
    add: jest.fn()    // Pretend to add new logging destinations
  };
};

/**
 * Create the real logger for actual use
 * This logger writes messages to the console and files
 */
const createLogger = () => {
  // Create the main logger with basic settings
  const logger = winston.createLogger({
    // How detailed should the logs be? (error, warn, info, debug)
    level: process.env.LOG_LEVEL || 'info',
    
    // How should we format the log messages?
    format: format.combine(
      format.timestamp(), // Add the time to each message
      format.json()      // Store messages as JSON for easy processing
    ),
    
    // Where should we send the logs?
    transports: [
      // Send logs to the console (terminal)
      new winston.transports.Console({
        format: format.combine(
          format.colorize(), // Make different types of logs different colors
          format.simple()   // Make it easy to read in the terminal
        )
      })
    ]
  });

  // In production, also save logs to files
  if (process.env.NODE_ENV === 'production') {
    // Save error messages to error.log
    logger.add(new winston.transports.File({ 
      filename: 'error.log', 
      level: 'error' 
    }));
    
    // Save all messages to combined.log
    logger.add(new winston.transports.File({ 
      filename: 'combined.log' 
    }));
  }

  return logger;
};

// Use the test logger during tests, otherwise use the real logger
module.exports = process.env.NODE_ENV === 'test' ? createTestLogger() : createLogger(); 