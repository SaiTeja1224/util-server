import express from "express";
import * as authController from "../../controllers/auth-controller";
import { rateLimiter } from "../../middlewares/rateLimiter";
const router = express.Router();

router.post("/login", authController.loginHandler);
router.get("/logout", authController.logoutHandler);
router.get("/refresh", authController.refreshHandler);

// INTERNAL
router.get("/validate", rateLimiter(), authController.validateTokenHandler);

export default router;
