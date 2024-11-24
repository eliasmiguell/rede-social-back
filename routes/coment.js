import express from 'express';
const router = express.Router();
import {createComent, getComent} from '../controllers/coment.js';
import {ckeckToken} from '../middleware/tokenValidation.js'

router.post('/', ckeckToken, createComent);
router.get('/', ckeckToken, getComent);

export default router;