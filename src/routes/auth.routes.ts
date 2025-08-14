import { Router } from "express";
import { setCreateAccProcessor, setLoginProcessor, loginFn } from "../controllers/auth.controller";

const router = Router();

router.post('/user', setCreateAccProcessor);
router.post('/log/user', loginFn);


export default router