export function setupGracefulShutdown(server, logger, port) {
  const SHUTDOWN_TIMEOUT = 30000;

  const gracefulShutdown = (signal) => {
    logger.info(`Received ${signal}, shutting down gracefully...`);
    const shutdownTimer = setTimeout(() => {
      logger.error("Graceful shutdown timeout, forcing exit");
      process.exit(1);
    }, SHUTDOWN_TIMEOUT);

    server.close(() => {
      clearTimeout(shutdownTimer);
      logger.info("Server closed gracefully");
      process.exit(0);
    });
  };

  process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Promise Rejection", {
      reason,
      promise: promise.toString(),
    });
    gracefulShutdown("unhandledRejection");
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  server.on("error", (error) => {
    logger.error("Server error", error);
    if (error.message.includes("EADDRINUSE")) {
      logger.error(`Port ${port} is already in use`);
      process.exit(1);
    }
  });

  process.on("warning", (warning) => {
    logger.warn("Process warning", {
      warning: warning.message,
      stack: warning.stack,
    });
  });

  logger.info("Error handlers and graceful shutdown configured");
}
