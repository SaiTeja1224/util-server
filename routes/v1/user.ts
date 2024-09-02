import express from "express";
import * as authController from "../../controllers/user-controller";
import { requireUser } from "../../middlewares/requireUser";
const router = express.Router();

router.post("/sign-up", authController.createUserHandler);
router.post("/login", authController.loginUserHandler);
router.get("/get-user", requireUser, authController.loggedInUserHandler);
router.get("/refresh", authController.refreshHandler);
router.get("/logout", authController.logoutHandler);

export default router;
