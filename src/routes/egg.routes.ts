import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { createEgg } from "../controllers/egg.controller";

const router = Router();

router.post('/egg', verifyAccessToken, createEgg);

export default router;