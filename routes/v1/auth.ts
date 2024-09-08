import express from "express";
import * as authController from "../../controllers/auth-controller";
const router = express.Router();

router.post("/login", authController.loginHandler);
router.get("/logout", authController.logoutHandler);
router.get("/refresh", authController.refreshHandler);

// INTERNAL
router.post("/validate", authController.validateTokenHandler);

export default router;
