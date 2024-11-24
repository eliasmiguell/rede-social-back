import express from 'express';
const router = express.Router()

import { ckeckToken} from "../middleware/tokenValidation.js";

import {addFriendship, deleteFriendship, getFriendship} from '../controllers/friendship.js'

router.get('/', ckeckToken, getFriendship)
router.post('/', ckeckToken, addFriendship)
router.delete('/', ckeckToken, deleteFriendship)
export default router