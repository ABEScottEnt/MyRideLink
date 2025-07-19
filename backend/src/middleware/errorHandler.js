import logger from "../config/logger.js";

export default function errorHandler(err, req, res, next) {
  logger.error(err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
}
