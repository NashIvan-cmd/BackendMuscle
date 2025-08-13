import { Router } from "express";
import { setCreateAccProcessor } from "../controllers/auth.controller";

const router = Router();

router.post('/user', setCreateAccProcessor);


export default router