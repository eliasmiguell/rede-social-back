import express from 'express';
import { ckeckToken } from '../middleware/tokenValidation.js';
import {sendMessage,getConversationMessages, deletemessage, markAllMessagesAsRead} from '../controllers/message.js'
const router = express.Router()

router.post('/',  ckeckToken, sendMessage);
router.get('/get-messagens',  ckeckToken, getConversationMessages);
router.patch('/update',  ckeckToken, markAllMessagesAsRead);
router.delete('/delete',  ckeckToken, deletemessage);



export default router;