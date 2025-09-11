import app from "./src/app.js";
import http from "http";
import { Server } from "socket.io";
import logger from "./src/config/logger.js";
import { PORT, NODE_ENV } from "./src/config/env.js";
import { setupSocket } from "./src/lib/socket.js";
import { setupGracefulShutdown } from "./src/lib/gracefulShutdown.js";

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

setupSocket(io);

const port = Number(PORT);

server.listen(port, "0.0.0.0", () => {
  logger.info(
    `Server running on port ${port} [${NODE_ENV}] (pid: ${process.pid})`
  );
});

setupGracefulShutdown(server, logger, port);

export default server;
