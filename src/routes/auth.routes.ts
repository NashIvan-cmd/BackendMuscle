import { Router } from "express";
import { registerFn, loginFn, logOutFn } from "../controllers/auth.controller";

const router = Router();

router.post('/users', registerFn);
router.post('/log/user', loginFn);
router.post('/logout', logOutFn);


export default router