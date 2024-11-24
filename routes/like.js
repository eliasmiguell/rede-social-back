import express from 'express';
const router = express.Router()

import { ckeckToken} from "../middleware/tokenValidation.js";

import {getLike, addLike, deleteLike} from '../controllers/like.js'

router.get('/', ckeckToken, getLike)
router.post('/', ckeckToken, addLike)
router.delete('/', ckeckToken, deleteLike)
export default router