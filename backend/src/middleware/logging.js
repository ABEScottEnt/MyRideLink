import logger from "../config/logger.js";

export default function loggingMiddleware(req, res, next) {
  logger.info(`${req.method} ${req.url}`);
  next();
}
