// routes.js
import express from "express";
import { protect } from "../../middleware/auth.js";

import {
  findRoutesController
} from "./controllers.js";

const router = express.Router();

// Toggle protection via ENV variable
const ROUTE_PROTECTION_ENABLED = process.env.ROUTE_PROTECTION_ENABLED === "true";

// Helper to conditionally apply middleware
const maybeProtect = (handler) => (ROUTE_PROTECTION_ENABLED ? [protect, handler] : [handler]);

// Public routes
router.get("/findRoutes", findRoutesController);

export default router;