import logger from "../config/logger.js";

export function setupSocket(io) {
  io.on("connection", (socket) => {
    logger.info("Socket connected: " + socket.id);
    socket.on("disconnect", () =>
      logger.info("Socket disconnected: " + socket.id)
    );
    // Add more socket event handlers here as needed
  });
}
