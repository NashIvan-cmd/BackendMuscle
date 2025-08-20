import { Router } from "express";
import { verifyAccessToken } from "../middleware/auth.middleware";
import { createEgg, orderEgg, getAllEgg, deleteEgg } from "../controllers/egg.controller";

const router = Router();

router.post('/v1/egg', verifyAccessToken, createEgg);
router.post('/v1/order/egg', verifyAccessToken, orderEgg);

router.get('/v1/egg', verifyAccessToken, getAllEgg);

router.delete('/v1/egg', verifyAccessToken, deleteEgg);

export default router;