import express from "express";
import * as userController from "../../controllers/user-controller";
import { requireUser } from "../../middlewares/requireUser";
const router = express.Router();

router.post("/register", userController.registerUserHandler);
router.get("/get-user", requireUser, userController.loggedInUserHandler);

export default router;
