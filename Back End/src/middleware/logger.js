const winston = require('winston');
const morgan = require('morgan');

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Create Morgan stream
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  }
};

// Create Morgan middleware
const morganMiddleware = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  { stream: morganStream }
);

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      user: req.user ? req.user.id : 'anonymous',
      ip: req.ip
    });
  });

  next();
};

// Error logger middleware
const errorLogger = (err, req, res, next) => {
  logger.error({
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    status: err.status || 500,
    user: req.user ? req.user.id : 'anonymous',
    ip: req.ip
  });

  next(err);
};

module.exports = {
  logger,
  morganMiddleware,
  requestLogger,
  errorLogger
}; 