import express from "express";
import * as emailController from "../../controllers/email-controller";
import { rateLimiter } from "../../middlewares/rateLimiter";
const router = express.Router();

router.post("/send", rateLimiter(5), emailController.sendEmailHandler);

export default router;
