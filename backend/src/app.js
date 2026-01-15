import express from "express";
import cors from "cors";
import helmet from "helmet";
import loggingMiddleware from "./middleware/logging.js";
import rateLimiter from "./middleware/rateLimiter.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import { PORT, NODE_ENV } from "./config/env.js";

import authRoutes from "./modules/auth/routes.js";
import transitRoutes from "./modules/transit/routes.js";
// import rideRoutes from "./modules/rides/routes.js";
// import paymentRoutes from "./modules/payments/routes.js";
// import healthRoutes from "./modules/health/routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimiter);
app.use(loggingMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transit", transitRoutes);
// app.use("/api/rides", rideRoutes);
// app.use("/api/payments", paymentRoutes);
// app.use("/api/health", healthRoutes);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;