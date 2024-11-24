import express from 'express';
import {register, login, refresh, logout} from '../controllers/auth.js'
import {checkRefreshToken} from "../middleware/refreshTokenValidation.js"
import { ckeckToken} from "../middleware/tokenValidation.js"
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', ckeckToken, logout);
router.get('/refresh', checkRefreshToken, refresh);

export default router;