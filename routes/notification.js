import express from 'express';
const router = express.Router()

import { ckeckToken} from "../middleware/tokenValidation.js";

import { getNotification} from '../controllers/notification.js'

router.get('/', ckeckToken,  getNotification)

export default router